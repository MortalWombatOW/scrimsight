import {Modal, Box, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@mui/material';
import React from 'react';
import CloseIcon from '@mui/icons-material/Close';

interface UploadProgressModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  initialRowCounts: {[objectStoreName: string]: number};
  rowCounts: {[fileName: string]: {[objectStoreName: string]: number}};
  objectStoreNames: string[];
}

const UploadProgressModal: React.FC<UploadProgressModalProps> = ({isOpen, setIsOpen, initialRowCounts, rowCounts, objectStoreNames}) => (
  <Modal open={isOpen} onClose={() => setIsOpen(false)}>
    <div className="Uploader-progresscontainer">
      <Box component="div" display="flex" alignItems="center" className="header-container">
        <span className="header">File Uploads</span>
        <IconButton aria-label="close" onClick={() => setIsOpen(false)} className="close-button">
          <CloseIcon />
        </IconButton>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>File Name</TableCell>
              {objectStoreNames.map((name) => (
                <TableCell key={name}>{name}</TableCell>
              ))}    
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Initial</TableCell>
              {objectStoreNames.map((name) => (
                <TableCell key={name}>{initialRowCounts[name]}</TableCell>
              ))}
            </TableRow>
            {Object.entries(rowCounts).map(([fileName, counts]) => (
              <TableRow key={fileName}>
                <TableCell>{fileName}</TableCell>
                {objectStoreNames.map((name) => (
                  <TableCell key={name}>{counts[name]}</TableCell>
                ))}

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  </Modal>
);

export default UploadProgressModal;
