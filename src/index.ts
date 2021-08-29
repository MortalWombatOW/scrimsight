import * as d3 from 'd3';
import {setupControls} from './controls';
import {setupUploadButton} from './data';
import './styles.scss';

function setup() {
  const body = d3.select(document.body);

  body.append('p').text('D3 starter works');

  setupUploadButton();
  setupControls();
}

setup();
