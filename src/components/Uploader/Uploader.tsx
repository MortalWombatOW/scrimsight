/* eslint-disable no-restricted-syntax */
import React, {ChangeEvent, useState} from 'react';
import {Button, ButtonGroup} from '@mui/material';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import {useFileUploadStatus} from './../../hooks/useFileUploadStatus';
import UploadProgressModal from './UploadProgressModal';

const Uploader = () => {
  const {startFileUpload} = useFileUploadStatus();
  const [modalOpen, setModalOpen] = useState(false);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files);
    startFileUpload(files);
    setModalOpen(true);
  };

  return (
    <div>
      <ButtonGroup variant="outlined" color="inherit">
        <Button component="label" className="Uploader-button">
          Load Files
          <input
            id="fileinput"
            type="file"
            onChange={onInputChange}
            hidden
            multiple
          />
        </Button>
        <Button
          component="label"
          className="Uploader-button"
          onClick={() => setModalOpen(true)}>
          <ManageSearchIcon />
        </Button>
      </ButtonGroup>
      <UploadProgressModal isOpen={modalOpen} setIsOpen={setModalOpen} />
    </div>
  );
};

export default Uploader;
