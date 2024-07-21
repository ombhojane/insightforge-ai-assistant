'use client';

import React, { useState } from 'react';

const FileUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setUploadStatus('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('Please select a file first.');
      return;
    }

    // For now, we'll just simulate an upload
    setUploadStatus('Uploading...');
    
    // Simulating an API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setUploadStatus('File uploaded successfully!');
    // Here you would typically send the file to your server or cloud storage
  };

  return (
    <div className="mt-4">
      <input
        type="file"
        onChange={handleFileChange}
        className="mb-2"
      />
      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-green-500 text-white rounded"
        disabled={!selectedFile}
      >
        Upload
      </button>
      {uploadStatus && <p className="mt-2">{uploadStatus}</p>}
    </div>
  );
};

export default FileUpload;
