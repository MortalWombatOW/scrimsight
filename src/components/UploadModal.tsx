import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useSetAtom } from 'jotai';
import { X, Upload, FileText, AlertCircle, Trash2 } from 'lucide-react';
import { loadFilesAtom } from '@atoms/loadFiles';

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
}

const UploadModal = ({ open, onClose }: UploadModalProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const loadFiles = useSetAtom(loadFilesAtom);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setError(null);
    setSelectedFiles(prev => {
      const newFiles = acceptedFiles.filter(newFile => 
        !prev.some(existingFile => 
          existingFile.name === newFile.name && 
          existingFile.lastModified === newFile.lastModified
        )
      );
      return [...prev, ...newFiles];
    });
  }, []);

  const removeFile = useCallback((index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleLoad = useCallback(async () => {
    if (selectedFiles.length === 0) return;

    setIsProcessing(true);
    setError(null);

    try {
      await loadFiles(selectedFiles);
      setSelectedFiles([]);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process files');
    } finally {
      setIsProcessing(false);
    }
  }, [loadFiles, selectedFiles, onClose]);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'text/csv': ['.csv'],
      'application/json': ['.json'],
      'text/log': ['.log'],
    },
    multiple: true,
    disabled: isProcessing,
  });

  const handleClose = () => {
    if (!isProcessing) {
      setError(null);
      setSelectedFiles([]);
      onClose();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getDropzoneClassName = () => {
    let baseClass = 'border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer';
    
    if (isProcessing) {
      return `${baseClass} border-gray-300 bg-gray-50 cursor-not-allowed`;
    }
    
    if (isDragAccept) {
      return `${baseClass} border-success bg-success/10`;
    }
    
    if (isDragReject) {
      return `${baseClass} border-error bg-error/10`;
    }
    
    if (isDragActive) {
      return `${baseClass} border-primary bg-primary/10`;
    }
    
    return `${baseClass} border-gray-300 hover:border-primary hover:bg-primary/5`;
  };

  if (!open) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg">Upload Log Files</h3>
          <button
            className="btn btn-sm btn-circle btn-ghost"
            onClick={handleClose}
            disabled={isProcessing}
          >
            <X size={18} />
          </button>
        </div>

        <div {...getRootProps()} className={getDropzoneClassName()}>
          <input {...getInputProps()} />
          
          <div className="space-y-4">
            {isProcessing ? (
              <>
                <div className="loading loading-spinner loading-lg text-primary"></div>
                <p className="text-sm text-gray-600">Processing files...</p>
              </>
            ) : (
              <>
                <div className="text-primary">
                  {isDragActive ? (
                    <Upload size={48} className="mx-auto mb-2" />
                  ) : (
                    <FileText size={48} className="mx-auto mb-2" />
                  )}
                </div>
                
                <div>
                  <p className="text-base font-medium mb-2">
                    {isDragActive
                      ? 'Drop your files here'
                      : 'Drag and drop log files here'}
                  </p>
                  <p className="text-sm text-gray-600">
                    or <span className="text-primary font-medium">click to browse</span>
                  </p>
                </div>
                
                <div className="text-xs text-gray-500">
                  Supported formats: .txt, .csv, .json, .log
                </div>
              </>
            )}
          </div>
        </div>

        {selectedFiles.length > 0 && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-sm">Selected Files ({selectedFiles.length})</h4>
              <button
                className="btn btn-xs btn-ghost text-gray-500"
                onClick={() => setSelectedFiles([])}
                disabled={isProcessing}
              >
                Clear All
              </button>
            </div>
            
            <div className="max-h-48 overflow-y-auto space-y-2">
              {selectedFiles.map((file, index) => (
                <div key={`${file.name}-${file.lastModified}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <FileText size={16} className="text-gray-500 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    className="btn btn-xs btn-ghost text-error hover:bg-error/10"
                    onClick={() => removeFile(index)}
                    disabled={isProcessing}
                    title="Remove file"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="alert alert-error mt-4">
            <AlertCircle size={18} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="modal-action">
          <button
            className="btn btn-ghost"
            onClick={handleClose}
            disabled={isProcessing}
          >
            Cancel
          </button>
          {selectedFiles.length > 0 && (
            <button
              className="btn btn-primary"
              onClick={handleLoad}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Processing...
                </>
              ) : (
                `Load ${selectedFiles.length} File${selectedFiles.length === 1 ? '' : 's'}`
              )}
            </button>
          )}
        </div>
      </div>
      
      <div className="modal-backdrop" onClick={handleClose}></div>
    </div>
  );
};

export default UploadModal;