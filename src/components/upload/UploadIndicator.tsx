import { Upload, Loader2 } from 'lucide-react';

interface UploadIndicatorProps {
  isUploading: boolean;
  isDragActive: boolean;
}

export const UploadIndicator = ({ isUploading, isDragActive }: UploadIndicatorProps) => {
  if (isUploading) {
    return (
      <div className="space-y-4">
        <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary" />
        <p className="text-lg">Processing your file...</p>
      </div>
    );
  }

  return (
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
  );
};