'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Paperclip } from 'lucide-react';

const FileManager: React.FC = () => {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [showOptions, setShowOptions] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  useEffect(() => {
    if (user) {
      fetchUploadedFiles();
    }
  }, [user]);

  const fetchUploadedFiles = async () => {
    if (!user) return;
    try {
      const response = await fetch('/api/documents');
      const data = await response.json();
      setUploadedFiles(data.documents);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setUploadStatus('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) return;
    
    setUploadStatus('Uploading...');
    
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('userId', user.uid);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setUploadStatus('File uploaded successfully!');
        fetchUploadedFiles();
        setSelectedFile(null);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('Error uploading file. Please try again.');
    }
  };

  const handleFileSelect = (fileName: string) => {
    console.log('Selected file:', fileName);
    // Implement file selection logic here
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="p-2 bg-green-500 text-white rounded-full"
      >
        <Paperclip size={24} />
      </button>
      {showOptions && (
        <div className="absolute mt-2 w-64 bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-4">
            <input
              type="file"
              onChange={handleFileChange}
              className="mb-2"
            />
            <button
              onClick={handleUpload}
              className="w-full px-4 py-2 bg-green-500 text-white rounded"
              disabled={!selectedFile}
            >
              Upload New File
            </button>
            {uploadStatus && <p className="mt-2 text-sm">{uploadStatus}</p>}
          </div>
          <div className="p-4 border-t">
            <h3 className="font-bold mb-2">Previously Uploaded Files:</h3>
            <ul className="max-h-40 overflow-y-auto">
              {uploadedFiles.map((fileName, index) => (
                <li key={index} className="mb-1">
                  <button
                    onClick={() => handleFileSelect(fileName)}
                    className="text-blue-500 hover:underline"
                  >
                    {fileName}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileManager;
