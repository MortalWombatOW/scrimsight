import * as d3 from 'd3';
import {debug} from 'webpack';
import {getEvents, OWEvent, OWPredicate} from './data';

export function updateDisplay(fields: Array<string>,
    filters: Array<OWPredicate>) {
//   d3.select('#display').selectChildren().remove();

  let events = getEvents();
  const dims = fields.length;

  for (const predicate of filters) {
    events = events.filter(predicate);
  }

  const aggMode = d3.select('#display').append('select');

  aggMode.selectAll('options').data(['time', 'player', 'team', 'map'])
      .enter()
      .append('option').text((s)=>s).attr('value', (s) => s);

  aggMode.property('value', aggregation);

  aggMode.on('change', (e) => {
    d3.selectAll('#display > *').remove();
    plot2d(events, xName, yName, e.target.value);
  });

  // clear display
  d3.selectAll('#display > *').remove();

  if (dims == 2) {
    plot2d(events, fields[0], fields[1]);
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
    aggregation: string = 'time') {
        type OWDatum = {x: number, y: number, group: string};


        //   .map((kv: any[][]) => {
        //     return {x: kv[0][0], g: kv[0][1],
        //       y: d3.sum(kv[1].map((d) => d.y))};
        //   });


        const players = Array.from(
            new Set(events
                .map((e) => e.value1)));

        const data: Array<OWDatum> = events.map((event) => {
        //   console.log(players.indexOf(event.value1));
          return {x: parseFloat(event[xName]), y: parseFloat(event[yName]),
            group: getGroup(event, aggregation)};
        });

        const groups = Array.from(new Set(data.map((d) => d.group)));


        // if (aggregation == 'cumsum') {
        //   data = Array.from(d3.group(data, (d) => [d.x, d.g]))
        //       .map((kv: any[][]) => {
        //         return {x: kv[0][0], g: kv[0][1],
        //           y: d3.sum(kv[1].map((d) => d.y))};
        //       });

        //   //   data = d3.zip(data.map((d) => [d.x, d.g]),
        //   //       d3.cumsum(data.map((d) => d.y)))
        //   //       .map((d) => {
        //   //         return {x: d[0][0], y: d[1], g: d[0][1]};
        //   //       });
        //   //   console.log(data);
        // }
        // data = Array.from(d3.group(data, (d) => [d.x, d.g]))
        //     .map((kv: any[][]) => {
        //       return {x: kv[0][0], g: kv[0][1],
        //         y: d3.sum(kv[1].map((d) => d.y))};
        //     });

        const margin = {top: 10, right: 30, bottom: 30, left: 60};
        const width = 800 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        const xMax = d3.max(data.map((d) => d.x));
        const xMin = d3.min(data.map((d) => d.x));
        const yMax = d3.max(data.map((d) => d.y));
        const yMin = d3.min(data.map((d) => d.y));
        // const gMax = d3.max(data.map((d) => d.g));
        // const gMin = d3.min(data.map((d) => d.g));

        const svg = d3.select('#display').append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform',
                'translate(' + margin.left + ',' + margin.top + ')');

        const x = d3.scaleLinear( ).domain([xMin, xMax]).range([0, width]);
        const y = d3.scaleLinear( ).domain([yMin, yMax]).range([height, 0]);
        const gS =
            d3.scaleOrdinal(
                Array.from(d3.schemeCategory10))
                .domain(players)
                .unknown('grey');

        svg.append('g').attr('transform', 'translate(0,' + height + ')')
            .call(d3.axisBottom(x));

        svg.append('g').call(d3.axisLeft(y));

        console.log(data);

        svg.append('g')
            .selectAll('dot')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', (d) => x(d.x))
            .attr('cy', (d) => y(d.y))
            .attr('fill', (d) => gS(players[d.g]))
            .attr('r', 1.5);


        // for (const group of groups) {
        const line = d3.line()
            .x((d) => x(+d.x))
            .y((d) => y(+d.y));

        svg.selectAll('groups')
            .data(groups)
            .enter()

            .append('path')
            .attr('stroke', 'black')
            .attr('d', line(groups));
        // }
  //
}

function getGroup(event: OWEvent, aggregation: string): any {
  if (aggregation == 'player') {
    return event.value1;
  }

  return new Error('not implemented');
}

