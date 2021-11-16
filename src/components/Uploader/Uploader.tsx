/* eslint-disable no-restricted-syntax */
import React, {ChangeEvent, useState} from 'react';
import sha256 from 'crypto-js/sha256';
import {Button} from '@mui/material';
import uploadFile from './../../lib/data/uploadfile';
import {useIndexedDB} from 'react-indexed-db';

const Uploader = () => {
  const [lastModified, setLastModified] = useState<number>(0);
  const {add: addToMapTable} = useIndexedDB('map');
  const {add: addToPlayerStatusTable} = useIndexedDB('player_status');
  const {add: addToPlayerAbilityTable} = useIndexedDB('player_ability');
  const {add: addToPlayerInteractionTable} = useIndexedDB('player_interaction');
  // addEvents([]);
  const reader = new FileReader();

  reader.onload = (e: ProgressEvent<FileReader>) => {
    if (!e.target) return;
    uploadFile(
      e.target.result as string,
      lastModified,
      addToMapTable,
      addToPlayerStatusTable,
      addToPlayerAbilityTable,
      addToPlayerInteractionTable,
    );
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target || !e.target.files) return;

    const file = e.target.files[0];
    setLastModified(file.lastModified);
    reader.readAsText(file);
  };

  return (
    <Button color="inherit" variant="outlined" component="label">
      Upload Logs{' '}
      <input id="fileinput" type="file" onChange={onInputChange} hidden />
    </Button>
  );
};

export default Uploader;
