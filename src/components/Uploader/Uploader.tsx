/* eslint-disable no-restricted-syntax */
import React, {ChangeEvent, forwardRef, useState} from 'react';
import {Button, Modal, LinearProgress} from '@mui/material';
import uploadFile from './../../lib/data/uploadfile';
import {useEffect} from 'react';
import ErrorIcon from '@mui/icons-material/Error';
import {useFileUploadStatus} from './../../hooks/useFileUploadStatus';
import {useCallback} from 'react';

type StrToNum = {[key: string]: number};

const LoadProgress = forwardRef((props: {fileProgress: StrToNum}, ref: any) => {
  const {fileProgress} = props;
  return (
    <div className="Uploader-progresscontainer" ref={ref}>
      {Object.keys(fileProgress).map((fileName) => (
        <div key={fileName}>
          {fileName}
          {fileProgress[fileName] >= 0 ? (
            <LinearProgress
              variant="determinate"
              value={fileProgress[fileName]}
            />
          ) : (
            <ErrorIcon />
          )}
        </div>
      ))}
    </div>
  );
});
LoadProgress.displayName = 'LoadProgress';

const Uploader = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [fileUploadStatus] = useFileUploadStatus();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    files.forEach((file) => {
      const updateFileProgress = (fileName: string, progress: number) => {
        console.log(`${fileName} progress: ${progress}`);
        setFileProgress((prevState) => ({
          ...prevState,
          [fileName]: progress,
        }));
      };

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (!e.target) return;
        uploadFile(
          e.target.result as string,
          file.name,
          file.lastModified,
          (progress: number) => updateFileProgress(file.name, progress),
        );
      };
      reader.readAsText(file);
    });
  }, [fileProgress, files]);

  const onInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target || !e.target.files) return;
    setFiles(Array.from(e.target.files));
  });

  return (
    <div>
      <Button color="inherit" variant="outlined" component="label">
        Load Files
        <input
          id="fileinput"
          type="file"
          onChange={onInputChange}
          hidden
          multiple
        />
      </Button>
      <Modal open={isActive} onClose={() => setIsActive(false)}>
        <LoadProgress fileProgress={fileUploadStatus} />
      </Modal>
    </div>
  );
};

export default Uploader;
