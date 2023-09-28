import {Modal, Box, IconButton} from '@mui/material';
import React from 'react';
import {FileUpload} from '../../lib/data/types';
import CloseIcon from '@mui/icons-material/Close';
import StatusIcon from '../Common/StatusIcon';

interface UploadProgressModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  files: FileUpload[];
  filePercents: {[fileName: string]: number};
}

const FileItem: React.FC<{file: FileUpload; percent: number}> = ({
  file,
  percent,
}) => (
  <div className="Uploader-progress">
    <StatusIcon percent={percent} />
    <span className="file-name">{file.fileName}</span>
    {percent < 0 && <span className="file-error">{file.error}</span>}
  </div>
);

const UploadProgressModal: React.FC<UploadProgressModalProps> = ({
  isOpen,
  setIsOpen,
  files,
  filePercents,
}) => (
  <Modal open={isOpen} onClose={() => setIsOpen(false)}>
    <div className="Uploader-progresscontainer">
      <Box
        component="div"
        display="flex"
        alignItems="center"
        className="header-container">
        <span className="header">File Uploads</span>
        <IconButton
          aria-label="close"
          onClick={() => setIsOpen(false)}
          className="close-button">
          <CloseIcon />
        </IconButton>
      </Box>
      {files.length === 0 ? (
        <div>No files selected</div>
      ) : (
        files.map((file) => (
          <FileItem
            key={file.fileName}
            file={file}
            percent={filePercents[file.fileName]}
          />
        ))
      )}
    </div>
  </Modal>
);

export default UploadProgressModal;
