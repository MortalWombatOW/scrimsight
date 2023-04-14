/* eslint-disable no-restricted-syntax */
import React, {ChangeEvent, useState} from 'react';
import {Button, ButtonGroup} from '@mui/material';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
// import {useFileUploadStatus} from './../../hooks/useFileUploadStatus';
import UploadProgressModal from './UploadProgressModal';
import {FileUpload} from 'lib/data/types';
import {uploadFile} from 'lib/data/uploadfile';

const Uploader = ({
  refreshCallback,
}: {
  refreshCallback: (() => void) | undefined;
}) => {
  // const {startFileUpload} = useFileUploadStatus();
  const [modalOpen, setModalOpen] = useState(false);
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [filePercents, setFilePercents] = useState<{
    [fileName: string]: number;
  }>({});

  const handleFilePerChange = (fileName: string) => {
    return (percent: number) => {
      setFilePercents((prev) => ({
        ...prev,
        [fileName]: percent,
      }));
      if (percent === 100) {
        refreshCallback && refreshCallback();
      }
    };
  };

  const startFileUploads = async (fileUploads: FileUpload[]) => {
    setFiles((files) => [...files, ...fileUploads]);
    for (const fileUpload of fileUploads) {
      await uploadFile(fileUpload, handleFilePerChange(fileUpload.fileName));
    }
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    const filesToUpload: FileUpload[] = Array.from(e.target.files).map(
      (file) => ({
        file,
        fileName: file.name,
      }),
    );

    console.log(filesToUpload);
    startFileUploads(filesToUpload);
    setModalOpen(true);
  };

  return (
    <div>
      {/* <ButtonGroup variant="outlined" color="inherit">
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
      </ButtonGroup> */}
      <Button variant='contained' component="label" color="secondary">
          Add maps
          <input
            id="fileinput"
            type="file"
            onChange={onInputChange}
            hidden
            multiple
          />
        </Button>
      <UploadProgressModal
        isOpen={modalOpen}
        setIsOpen={setModalOpen}
        files={files}
        filePercents={filePercents}
      />
    </div>
  );
};

export default Uploader;
