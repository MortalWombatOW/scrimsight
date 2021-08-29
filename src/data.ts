import * as d3 from 'd3';
import {SHA256} from 'crypto-js';

export type OWEvent = {
  timestamp: number;
  eventType: string;
  value1: string;
  value2: string;
  value3: string;
};

export const OWFieldNames: Array<string> = ['timestamp', 'eventType', 'value1',
  'value2', 'value3'];

export type OWPredicate = (OWEvent) => boolean;

export function setupUploadButton() {
  const uploader = document.getElementById('uploader');
  const reader = new FileReader();

  let fileLastUpdated;

  reader.onload = (e) => {
    console.log(e);
    parseFile(e.target.result, fileLastUpdated);
  };
  uploader.addEventListener(
      'change',
      (e) => {
        console.log('loading');
        console.log(e);
        const file = e.target['files'][0];
        fileLastUpdated = file.lastModified;
        reader.readAsText(file);
      },
      false,
  );
}

function parseFile(file, fileLastUpdated) {
  // eslint-disable-next-line new-cap
  const fileHash = SHA256(file).toString().slice(0, 10);
  const rawEvents = d3
      .dsvFormat(';')
      .parseRows(file, (row) => parseRow(row, {fileHash, fileLastUpdated}));
  console.log(rawEvents.slice(0, 10));
  addEvents(rawEvents);
}

function parseRow(row, fileInfo) {
  return {
    timestamp: parseTimestamp(row),
    eventType: row[1],
    value1: row[2],
    value2: row[3],
    value3: row[4],
    ...fileInfo,
  };
}

const events = [];

function parseTimestamp(row) {
  return row[0]
      .trim()
      .slice(1, -1)
      .split(':')
      .map((x, i) => Math.pow(60, 2 - i) * parseInt(x))
      .reduce((a, b) => a + b);
}

export function addEvents(newEvents) {
  events.push(...newEvents);
}

export function getEvents(): Array<OWEvent> {
  return events;
}
