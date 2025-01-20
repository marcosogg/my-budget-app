import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Transaction } from '@/types/transaction';
import { UploadIndicator } from './upload/UploadIndicator';
import { clearExistingData, saveTransactions } from '@/services/transactionService';
import { parseCSV } from '@/services/csvParserService';

interface FileUploadProps {
  onFileUpload: (data: Transaction[]) => void;
}

const FileUpload = ({ onFileUpload }: FileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

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
          
          const transactions = await parseCSV(text);
          console.log('Filtered completed transactions count:', transactions.length);
          
          if (transactions.length === 0) {
            toast.error('No valid completed transactions found in the CSV');
            setIsUploading(false);
            return;
          }
      
          const { data: { session } } = await supabase.auth.getSession();
          const user = session?.user;
          console.log('Current user for transaction upload:', user);
          
          if (!user) {
            console.error('No authenticated user found during upload');
            toast.error('Please sign in to save transactions');
            setIsUploading(false);
            return;
          }
      
          console.log('Preparing to save transactions for user:', user.id);
          const saved = await saveTransactions(transactions, user.id);
          
          if (saved) {
            onFileUpload(transactions);
            const hasAdjustedRent = transactions.some(t => 
              t.description?.includes('⚡') && t.description?.toLowerCase().includes('rent')
            );
            
            if (hasAdjustedRent) {
              toast.success(`Successfully uploaded ${transactions.length} transactions! Rent transaction adjusted.`);
            } else {
              toast.success(`Successfully uploaded ${transactions.length} transactions!`);
            }
          }
        } catch (error) {
          console.error('Error processing file:', error);
          toast.error('Failed to process file');
        } finally {
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
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}`}
    >
      <input {...getInputProps()} className="hidden" />
      <UploadIndicator isUploading={isUploading} isDragActive={isDragActive} />
    </div>
  );
};

export default FileUpload;