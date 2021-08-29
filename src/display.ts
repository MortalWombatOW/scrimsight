import * as d3 from 'd3';
import {getEvents, OWEvent, OWPredicate} from './data';

export function updateDisplay(fields: Array<string>,
    filters: Array<OWPredicate>) {
//   d3.select('#display').selectChildren().remove();

  let events = getEvents();
  const dims = fields.length;

  for (const predicate of filters) {
    events = events.filter(predicate);
  }

  if (dims == 2) {
    plot2d(events,
        fields[0], fields[1], 'cumsum');
  } else {
    drawTable(events, fields);
  }
}

function drawTable(data: Array<OWEvent>, fields: Array<string>) {
  let sortAscending = true;
  const table = d3.select('#display').append('table');
  const titles = fields;
  const headers = table.append('thead').append('tr')
      .selectAll('th')
      .data(titles).enter()
      .append('th')
      .text((d) => d)
      .on('click', function(d) {
        headers.attr('class', 'header');
        console.log(rows);

        if (sortAscending) {
          rows.sort((a:OWEvent, b:OWEvent) => b[d] - a[d]);
          sortAscending = false;
        //   this.className = 'aes';
        } else {
          rows.sort((a, b) => a[d] - b[d]);
          sortAscending = true;
        //   this.className = 'des';
        }
      });


  const rows = table.append('tbody').selectAll('tr')
      .data(data.slice(0, 500)).enter()
      .append('tr');
  rows.selectAll('td')
      .data(function(d) {
        return titles.map(function(k) {
          return {'value': d[k], 'name': k};
        });
      }).enter()
      .append('td')
      .attr('data-th', function(d) {
        return d['name'];
      })
      .text(function(d) {
        return d['value'];
      });
}


function plot2d(events: Array<OWEvent>, xName: string, yName: string,
    aggregation: string) {
  const data = events.map((event) => {
    return {x: event[xName], y: event[yName]};
  });


  const margin = {top: 10, right: 30, bottom: 30, left: 60};
  const width = 460 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const xMax = d3.max(data.map((d) => parseFloat(d['x'])));
  const xMin = d3.min(data.map((d) => parseFloat(d['x'])));
  const yMax = d3.max(data.map((d) => parseFloat(d['y'])));
  const yMin = d3.min(data.map((d) => parseFloat(d['y'])));

  const svg = d3.select('#display').append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform',
          'translate(' + margin.left + ',' + margin.top + ')');

  const x = d3.scaleLinear( ).domain([xMin, xMax]).range([0, width]);
  const y = d3.scaleLinear( ).domain([yMin, yMax]).range([height, 0]);

  svg.append('g').attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x));

  svg.append('g').call(d3.axisLeft(y));

  svg.append('g')
      .selectAll('dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', function(d) {
        return x(d['x']);
      } )
      .attr('cy', function(d) {
        return y(parseFloat(d['y']));
      } )
      .attr('r', 1.5)
      .style('fill', '#69b3a2');
}
