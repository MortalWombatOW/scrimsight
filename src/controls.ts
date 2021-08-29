import * as d3 from 'd3';
import {getEvents, OWEvent} from './data';
import {updateDisplay} from './display';

export function setupControls() {
  document.getElementById('querybutton').addEventListener('click', update);
  document.getElementById('addfield').addEventListener('click', addField);
  document.getElementById('addfilter').addEventListener('click', addFilter);
}

function update() {
  const fields = Array.from(document.getElementById('fields').children).map(
      (el: Element) => el.getAttribute('data-fieldName'),
  );
  const filters = Array.from(document.getElementById('fields').children).map(
      (el) => el.getAttribute('data-filterName'),
  );

  console.log(fields);
  console.log(filters);

  const data = getEvents();


  d3.select('#summary').text(`${data.length} rows`);

  updateDisplay(['timestamp', 'value2'],
      [(event: OWEvent) => event.eventType == 'damage_dealt']);
}

function addField() {}

function addFilter() {}
