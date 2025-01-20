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

  const handleError = (error: Error, message: string) => {
    console.error(message, error);
    toast.error(message);
    setIsUploading(false);
  };

  const processFile = async (file: File) => {
    const reader = new FileReader();
    
    return new Promise<Transaction[]>((resolve, reject) => {
      reader.onload = async (e) => {
        try {
          const text = e.target?.result as string;
          if (!text) {
            throw new Error('Failed to read file content');
          }
          
          const transactions = await parseCSV(text);
          console.log('Filtered completed transactions count:', transactions.length);
          
          if (transactions.length === 0) {
            reject(new Error('No valid completed transactions found'));
            return;
          }

          resolve(transactions);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
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
      // Clear existing data
      const cleared = await clearExistingData();
      if (!cleared) {
        handleError(new Error('Failed to clear existing data'), 'Failed to prepare for upload');
        return;
      }

      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      
      if (!user) {
        handleError(new Error('No authenticated user'), 'Please sign in to save transactions');
        return;
      }

      // Process file and save transactions
      const transactions = await processFile(file);
      const saved = await saveTransactions(transactions, user.id);
      
      if (saved) {
        onFileUpload(transactions);
        const hasAdjustedRent = transactions.some(t => 
          t.description?.includes('⚡') && t.description?.toLowerCase().includes('rent')
        );
        
        toast.success(
          hasAdjustedRent 
            ? `Successfully uploaded ${transactions.length} transactions! Rent transaction adjusted.`
            : `Successfully uploaded ${transactions.length} transactions!`
        );
      }
    } catch (error) {
      handleError(
        error as Error,
        (error as Error).message === 'No valid completed transactions found'
          ? 'No valid completed transactions found in the CSV'
          : 'Failed to process file'
      );
    } finally {
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