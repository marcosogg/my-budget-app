import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { parse } from 'papaparse';
import { Transaction } from '@/types/transaction';

interface FileUploadProps {
  onFileUpload: (data: Transaction[]) => void;
}

const parseCustomDate = (dateStr: string): string | null => {
  if (!dateStr) return null;
  
  try {
    console.log('Parsing date:', dateStr);
    // Split date and time
    const [datePart, timePart] = dateStr.split(' ');
    if (!datePart || !timePart) {
      console.error('Invalid date format - missing date or time part:', dateStr);
      return null;
    }

    // Switch day and month positions for European format (DD/MM/YYYY)
    const [day, month, year] = datePart.split('/');
    const [hours, minutes] = timePart.split(':');

    if (!month || !day || !year || !hours || !minutes) {
      console.error('Invalid date components:', { month, day, year, hours, minutes });
      return null;
    }

    // Validate numeric values
    const numMonth = parseInt(month);
    const numDay = parseInt(day);
    const numYear = parseInt(year);
    const numHours = parseInt(hours);
    const numMinutes = parseInt(minutes);

    // Basic validation
    if (
      numMonth < 1 || numMonth > 12 ||
      numDay < 1 || numDay > 31 ||
      numHours < 0 || numHours > 23 ||
      numMinutes < 0 || numMinutes > 59
    ) {
      console.error('Date components out of valid range:', {
        month: numMonth,
        day: numDay,
        hours: numHours,
        minutes: numMinutes
      });
      return null;
    }

    // Additional validation for days in month
    const daysInMonth = new Date(numYear, numMonth, 0).getDate();
    if (numDay > daysInMonth) {
      console.error(`Invalid day ${numDay} for month ${numMonth}`);
      return null;
    }

    // Create full year (20XX)
    const fullYear = numYear < 50 ? 2000 + numYear : 1900 + numYear;

    // Create date object with all components
    const date = new Date(
      fullYear,
      numMonth - 1, // months are 0-based
      numDay,
      numHours,
      numMinutes
    );

    // Validate the resulting date
    if (isNaN(date.getTime())) {
      console.error('Invalid date object created:', date);
      return null;
    }

    return date.toISOString();
  } catch (error) {
    console.error('Error parsing date:', dateStr, error);
    return null;
  }
};

const FileUpload = ({ onFileUpload }: FileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const clearExistingData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user:', user);
      
      if (!user) {
        console.error('No authenticated user found');
        toast.error('Please sign in to manage transactions');
        return false;
      }

      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error clearing transactions:', error);
        toast.error('Failed to clear existing transactions');
        return false;
      }

      console.log('Successfully cleared existing transactions');
      return true;
    } catch (error) {
      console.error('Error in clearExistingData:', error);
      toast.error('Failed to clear existing data');
      return false;
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      toast.error('Please select a CSV file');
      return;
    }

    const file = acceptedFiles[0];
    console.log('Processing file:', file.name, 'Type:', file.type);
    
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      toast.error('Please upload a valid CSV file');
      return;
    }

    setIsUploading(true);
    toast.info('Processing your CSV file...', { duration: 2000 });

    try {
      const cleared = await clearExistingData();
      if (!cleared) {
        setIsUploading(false);
        return;
      }

      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          console.log('File read successfully, starting CSV parsing');
          const text = e.target?.result as string;
          
          if (!text) {
            throw new Error('Failed to read file content');
          }
          
          parse(text, {
            header: true,
            skipEmptyLines: true,
            transformHeader: (header) => {
              const headerMap: { [key: string]: string } = {
                'Type': 'type',
                'Product': 'product',
                'Started Date': 'startedDate',
                'Completed Date': 'completedDate',
                'Description': 'description',
                'Amount': 'amount',
                'Fee': 'fee',
                'Currency': 'currency',
                'State': 'state',
                'Balance': 'balance'
              };
              console.log('Transforming header:', header, 'to:', headerMap[header] || header);
              return headerMap[header] || header;
            },
            transform: (value, field) => {
              if (field === 'amount' || field === 'fee' || field === 'balance') {
                return parseFloat(value);
              }
              if (field === 'completedDate' || field === 'startedDate') {
                const parsedDate = parseCustomDate(value);
                if (!parsedDate) {
                  console.error('Failed to parse date:', value);
                  return null;
                }
                return parsedDate;
              }
              return value;
            },
            complete: async (results) => {
              try {
                console.log('CSV parsing complete. Row count:', results.data.length);
                const transactions = (results.data as Transaction[])
                  .filter(t => t.state === 'COMPLETED' && t.completedDate && t.startedDate);
                console.log('Filtered completed transactions count:', transactions.length);
                
                if (transactions.length === 0) {
                  toast.error('No valid completed transactions found in the CSV');
                  setIsUploading(false);
                  return;
                }

                const { data: { user } } = await supabase.auth.getUser();
                console.log('Current user for transaction upload:', user);
                
                if (!user) {
                  console.error('No authenticated user found during upload');
                  toast.error('Please sign in to save transactions');
                  setIsUploading(false);
                  return;
                }

                console.log('Preparing to save transactions for user:', user.id);
                const { error } = await supabase.from('transactions').insert(
                  transactions.map(t => ({
                    user_id: user.id,
                    type: t.type,
                    product: t.product,
                    started_date: t.startedDate,
                    completed_date: t.completedDate,
                    description: t.description,
                    amount: t.amount,
                    fee: t.fee,
                    currency: t.currency,
                    state: t.state,
                    balance: t.balance
                  }))
                );

                if (error) {
                  console.error('Error saving transactions:', error);
                  toast.error('Failed to save transactions');
                  setIsUploading(false);
                  return;
                }

                console.log('Transactions saved successfully');
                onFileUpload(transactions);
                toast.success(`Successfully uploaded ${transactions.length} transactions!`);
              } catch (error) {
                console.error('Error in complete callback:', error);
                toast.error('Failed to process transactions');
              } finally {
                setIsUploading(false);
              }
            },
            error: (error) => {
              console.error('CSV parsing error:', error);
              toast.error('Failed to parse CSV file');
              setIsUploading(false);
            }
          });
        } catch (error) {
          console.error('Error processing file:', error);
          toast.error('Failed to process file');
          setIsUploading(false);
        }
      };

      reader.onerror = (error) => {
        console.error('FileReader error:', error);
        toast.error('Failed to read file');
        setIsUploading(false);
      };

      reader.readAsText(file);
    } catch (error) {
      console.error('Unexpected error during file upload:', error);
      toast.error('An unexpected error occurred');
      setIsUploading(false);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}`}
    >
      <input {...getInputProps()} />
      {isUploading ? (
        <div className="space-y-4">
          <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary" />
          <p className="text-lg">Processing your file...</p>
        </div>
      ) : (
        <>
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          {isDragActive ? (
            <p className="text-lg">Drop the CSV file here...</p>
          ) : (
            <div>
              <p className="text-lg mb-2">Drag & drop a CSV file here, or click to select</p>
              <p className="text-sm text-gray-500">Supports CSV files only</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FileUpload;