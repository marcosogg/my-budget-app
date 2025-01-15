import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { parse } from 'papaparse';
import { Transaction } from '@/types/transaction';

interface FileUploadProps {
  onFileUpload: (data: Transaction[]) => void;
}

const FileUpload = ({ onFileUpload }: FileUploadProps) => {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        
        // Parse CSV data
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
            return headerMap[header] || header;
          },
          transform: (value, field) => {
            if (field === 'amount' || field === 'fee' || field === 'balance') {
              return parseFloat(value);
            }
            if (field === 'completedDate' || field === 'startedDate') {
              // Parse date in M/D/YY H:MM format
              const date = new Date(value);
              return date.toISOString();
            }
            return value;
          },
          complete: async (results) => {
            const transactions = (results.data as Transaction[])
              .filter(t => t.state === 'COMPLETED'); // Filter only completed transactions
            
            try {
              const { data: { user } } = await supabase.auth.getUser();
              
              if (!user) {
                toast.error('Please sign in to save transactions');
                return;
              }

              // Save transactions to Supabase
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
                return;
              }

              onFileUpload(transactions);
              toast.success('Transactions saved successfully!');
            } catch (error) {
              console.error('Error:', error);
              toast.error('Failed to process file');
            }
          },
        });
      };
      reader.readAsText(file);
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
      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
      {isDragActive ? (
        <p className="text-lg">Drop the CSV file here...</p>
      ) : (
        <div>
          <p className="text-lg mb-2">Drag & drop a CSV file here, or click to select</p>
          <p className="text-sm text-gray-500">Supports CSV files only</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;