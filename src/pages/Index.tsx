import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import TransactionTable from '@/components/TransactionTable';
import TransactionStats from '@/components/TransactionStats';
import { Transaction } from '@/types/transaction';
import { parse } from 'papaparse';

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const handleFileUpload = (csvData: string) => {
    parse(csvData, {
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
        return value;
      },
      complete: (results) => {
        setTransactions(results.data as Transaction[]);
      },
    });
  };

  return (
    <div className="container py-8 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Transaction Viewer</h1>
        <p className="text-gray-600">Upload your CSV file to view and analyze your transactions</p>
      </div>

      {transactions.length === 0 ? (
        <FileUpload onFileUpload={handleFileUpload} />
      ) : (
        <div className="space-y-8">
          <TransactionStats transactions={transactions} />
          <TransactionTable transactions={transactions} />
        </div>
      )}
    </div>
  );
};

export default Index;