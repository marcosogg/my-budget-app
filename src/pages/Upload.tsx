import { useNavigate } from 'react-router-dom';
import FileUpload from '@/components/FileUpload';
import { Transaction } from '@/types/transaction';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Upload = () => {
  const navigate = useNavigate();

  const handleFileUpload = async (transactions: Transaction[]) => {
    navigate('/transactions');
  };

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between mb-8">
        <Button variant="outline" onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-4xl font-bold mb-2">Upload Transactions</h1>
          <p className="text-gray-600">Upload your CSV file to import new transactions</p>
        </div>
        <div className="w-[100px]" /> {/* Spacer for alignment */}
      </div>

      <FileUpload onFileUpload={handleFileUpload} />
    </div>
  );
};

export default Upload;