/* eslint-disable no-restricted-syntax */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { ChangeEvent, useState } from 'react';
import sha256 from 'crypto-js/sha256';
import { dsvFormat } from 'd3-dsv';
import { Button } from '@mui/material';
import { createRawEventDataset } from '../../lib/data/data';
import Dataset from '../services/Dataset';

function parseTimestamp(str: string) {
  return str
    .trim()
    .slice(1, -1)
    .split(':')
    .map((x: string, i: number) => (60 ** (2 - i)) * parseInt(x, 10))
    .reduce((a: number, b: number) => a + b);
}

function parseRow(row: any[], fileInfo: { fileHash: any; lastModified: any; }): any[] {
  return [
    parseTimestamp(row[0]),
    ...row.slice(1),
  ];
}

function parseFile(file: string, lastModified: number): Dataset {
  // eslint-disable-next-line new-cap
  const fileHash = sha256(file).toString().slice(0, 10);
  const rawEvents = dsvFormat(';')
    .parseRows(file, (row) => parseRow(row, { fileHash, lastModified }));
  return createRawEventDataset(rawEvents);
}

function Uploader(props: UploaderProps) {
  const [lastModified, setLastModified] = useState<number>(0);

  // addEvents([]);
  const reader = new FileReader();

  reader.onload = (e: ProgressEvent<FileReader>) => {
    if (!e.target) return;
    props.addData(parseFile(e.target.result as string, lastModified));
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target || !e.target.files) return;

    const file = e.target.files[0];
    setLastModified(file.lastModified);
    reader.readAsText(file);
  };

  return (
    <Button color="inherit" variant="outlined" component="label">
      Upload Events
      {' '}
      <input id="fileinput" type="file" onChange={onInputChange} hidden />
    </Button>
  );
}

export interface UploaderProps {
    addData(dataset: Dataset): void;
}

export default Uploader;
