/* eslint-disable no-restricted-syntax */
import React, {ChangeEvent, forwardRef, useState} from 'react';
import {Button, Modal, LinearProgress} from '@mui/material';
import uploadFile from './../../lib/data/uploadfile';
import {useIndexedDB} from 'react-indexed-db';
import {useEffect} from 'react';
import ErrorIcon from '@mui/icons-material/Error';

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
  const {add: addToMapTable, getByIndex: getMapByIndex} = useIndexedDB('map');
  const {add: addToPlayerStatusTable} = useIndexedDB('player_status');
  const {add: addToPlayerAbilityTable} = useIndexedDB('player_ability');
  const {add: addToPlayerInteractionTable} = useIndexedDB('player_interaction');

  const [files, setFiles] = useState<File[]>([]);
  const [fileProgress, setFileProgress] = useState<StrToNum>({});
  const isActive = Object.keys(fileProgress).length > 0;

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
          addToMapTable,
          addToPlayerStatusTable,
          addToPlayerAbilityTable,
          addToPlayerInteractionTable,
          getMapByIndex,
          (progress: number) => updateFileProgress(file.name, progress),
        );
      };
      reader.readAsText(file);
    });
  }, [
    addToMapTable,
    addToPlayerAbilityTable,
    addToPlayerInteractionTable,
    addToPlayerStatusTable,
    fileProgress,
    files,
    getMapByIndex,
  ]);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target || !e.target.files) return;
    setFiles(Array.from(e.target.files));
  };

  const resetState = () => {
    setFileProgress({});
    setFiles([]);
  };
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
      <Modal open={isActive} onClose={resetState}>
        <LoadProgress fileProgress={fileProgress} />
      </Modal>
    </div>
  );
};

export default Uploader;
