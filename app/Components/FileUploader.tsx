import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { formatSize } from '~/lib/utils';

interface FileUploaderProps {
  onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0] || null;
      setSelectedFile(file);
      onFileSelect?.(file);
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    multiple: false,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 20 * 1024 * 1024,
  });

  const file = selectedFile;

  return (
    <div className='w-full gradient-border'>
      <div {...getRootProps()}>
        <input {...getInputProps()} />

        <div className='space-y-4 cursor-pointer'>
          {!file && (
            <div className='mx-auto w-16 h-16 flex items-center justify-center'>
              <img src='/icons/upload.svg' alt='upload' className='size-20 invert' />
            </div>
          )}

          {file ? (
            <div className='uploader-selected-file cursor-default' onClick={(e) => e.stopPropagation()}>
              <div className='flex items-center space-x-3'>
                <img src='/images/pdf.png' alt='pdf' className='size-10' />
                <div className='text-start'>
                  <p className='text-sm font-medium text-white-500 truncate max-w-xs'>{file.name}</p>
                  <p className='text-sm text-white-500 font-bold'>{formatSize(file.size)}</p>
                </div>
              </div>

              <button
                className='p-2 cursor-pointer'
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedFile(null);
                  onFileSelect?.(null);
                }}>
                <img src='/icons/cross.svg' alt='remove' className='w-4 h-4 invert' />
              </button>
            </div>
          ) : (
            <div>
              <p className='text-lg text-white-500'>
                <span className='font-semibold'>Click to upload </span>
                or drag and drop your file here
              </p>
              <p className='text-lg text-white-500'>PDF (max 20MB)</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
