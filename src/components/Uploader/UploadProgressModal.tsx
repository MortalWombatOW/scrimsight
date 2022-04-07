import {CircularProgress, Modal, Box, LinearProgress, Fab} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {FileUpload} from '../../lib/data/types';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
const UploadProgressModal = ({
  isOpen,
  setIsOpen,
  files,
  filePercents,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  files: FileUpload[];
  filePercents: {[fileName: string]: number};
}) => {
  // const {uploadState, computeStateForFiles} = useFileUploadStatus();

  // useEffect(() => {
  //   // setFileStatuses(computeStateForFiles());
  // }, [JSON.stringify(uploadState)]);

  // console.log(fileStatuses);

  const getIcon = (percent: number) => {
    // if (percent === 100) {
    //   return <CheckIcon color="success" />;
    // }
    // if (percent < 0) {
    //   return (
    //     <ErrorIcon
    //       color="error"
    //       style={{
    //         fontSize: '32px',
    //       }}
    //     />
    //   );
    // }
    return (
      <Box position="relative" display="inline-flex">
        <CircularProgress
          variant="determinate"
          value={percent < 0 ? 100 : percent}
          size={32}
          color={
            percent === 100 ? 'success' : percent < 0 ? 'error' : 'primary'
          }
        />
        <Box
          top={0}
          left={0}
          bottom={0}
          right={0}
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center">
          {percent === 100 ? (
            <CheckIcon color="success" />
          ) : percent < 0 ? (
            <CloseIcon color="error" />
          ) : percent === undefined ? (
            <HourglassEmptyIcon color="primary" />
          ) : null}
        </Box>
      </Box>
    );
  };

  return (
    <Modal open={isOpen} onClose={() => setIsOpen(false)}>
      <div className="Uploader-progresscontainer">
        <Box display="flex" alignItems="center">
          <span className="header">File Uploads</span>
          <IconButton
            aria-label="close"
            onClick={() => setIsOpen(false)}
            style={{
              position: 'absolute',
              right: '20px',
            }}>
            <CloseIcon />
          </IconButton>
        </Box>
        {files.length === 0 ? (
          <div>No files selected</div>
        ) : (
          files.map((file) => (
            <div
              key={file.fileName}
              className="Uploader-progress"
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                margin: '3px',
              }}>
              {getIcon(filePercents[file.fileName])}
              <span
                style={{
                  marginLeft: '5px',
                }}>
                {file.fileName}
              </span>
              {filePercents[file.fileName] < 0 ? (
                <span
                  style={{
                    marginLeft: '5px',
                    color: 'red',
                  }}>
                  {file.error}
                </span>
              ) : null}
            </div>
          ))
        )}
      </div>
    </Modal>
  );
};

export default UploadProgressModal;
