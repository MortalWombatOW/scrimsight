// @flow

import React, { useEffect, useState } from 'react'
import type {StatelessFunctionalComponent} from 'react';
import type { RawEvent } from "../types";
import * as d3 from 'd3'


const Uploader = ({addEvents}) => {

    const [lastModified, setLastModified] = useState();

    // addEvents([]);
    const reader = new FileReader();

    reader.onload = (e) => {
        console.log(e);
        addEvents(parseFile(e.target.result, fileLastUpdated));
      };
    

    const onInputChange = (e) => {
        const file = e.target['files'][0];
        setLastModified(file.lastModified);
        reader.readAsText(file);

    };

    return (
        <div>
            <input type="file" onchange={onInputChange} />
        </div>
    );
};

const parseFile = (file, fileLastUpdated) => {
  // eslint-disable-next-line new-cap
  const fileHash = SHA256(file).toString().slice(0, 10);
  const rawEvents = d3
      .dsvFormat(';')
      .parseRows(file, (row) => parseRow(row, {fileHash, fileLastUpdated}));
  console.log(rawEvents.slice(0, 10));
  return rawEvents;
}


export interface UploaderProps {
    addEvents: (events: Array<RawEvent>) => null
};

export default (Uploader: StatelessFunctionalComponent<UploaderProps>);