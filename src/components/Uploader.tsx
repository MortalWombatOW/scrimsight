/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { ChangeEvent, useState } from 'react';
import sha256 from 'crypto-js/sha256';
import { dsvFormat } from 'd3-dsv';
import { Button } from '@mui/material';
import type { RawEvent } from '../types';

function parseTimestamp(str: string) {
  return str
    .trim()
    .slice(1, -1)
    .split(':')
    .map((x: string, i: number) => (60 ** (2 - i)) * parseInt(x, 10))
    .reduce((a: number, b: number) => a + b);
}

function parseRow(row: any[], fileInfo: { fileHash: any; lastModified: any; }) {
  return {
    timestamp: parseTimestamp(row[0]),
    eventType: row[1],
    value1: row[2],
    value2: row[3],
    value3: row[4],
    ...fileInfo,
  };
}

function parseFile(file: string, lastModified: number) {
  // eslint-disable-next-line new-cap
  const fileHash = sha256(file).toString().slice(0, 10);
  const rawEvents = dsvFormat(';')
    .parseRows(file, (row) => parseRow(row, { fileHash, lastModified }));
  return rawEvents;
}

function Uploader(props: UploaderProps) {
  const [lastModified, setLastModified] = useState<number>(0);

  // addEvents([]);
  const reader = new FileReader();

  reader.onload = (e: ProgressEvent<FileReader>) => {
    if (!e.target) return;
    props.addEvents(parseFile(e.target.result as string, lastModified));
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
    addEvents(events: Array<RawEvent>): void;
}

export default Uploader;
