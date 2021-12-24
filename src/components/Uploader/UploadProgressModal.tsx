import {CircularProgress, Modal, Step, StepLabel, Stepper} from '@mui/material';
import {FileStatus} from '../../lib/data/types';
import React, {useEffect, useState} from 'react';
import {useFileUploadStatus} from './../../hooks/useFileUploadStatus';

const UploadProgressModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const {uploadState, computeStateForFiles} = useFileUploadStatus();

  const [fileStatuses, setFileStatuses] = useState<FileStatus[]>([]);

  useEffect(() => {
    setFileStatuses(computeStateForFiles());
  }, [JSON.stringify(uploadState)]);

  // console.log(fileStatuses);
  return (
    <Modal open={isOpen} onClose={() => setIsOpen(false)}>
      <div className="Uploader-progresscontainer">
        {fileStatuses.map((fs) => (
          <div key={fs.fileName} className="Uploader-progressforfile">
            <span>{fs.fileName}</span>
            <Stepper
              alternativeLabel
              activeStep={1}
              // connector={<QontoConnector />}>
            >
              <Step>
                <StepLabel StepIconComponent={CircularProgress}>test</StepLabel>
              </Step>
              <Step>
                <StepLabel StepIconComponent={CircularProgress}>test</StepLabel>
              </Step>
            </Stepper>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default UploadProgressModal;
