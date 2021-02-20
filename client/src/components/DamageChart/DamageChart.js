import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './DamageChart.css';
import { Group } from '@visx/group';
import { line, LinePath } from '@visx/shape';
import { scaleLinear, scaleTime } from '@visx/scale';
import axios from 'axios';
// import * as allCurves from '@visx/curve';
import { extent, max, min } from 'd3-array';
import { Axis, Orientation, SharedAxisProps, AxisScale } from '@visx/axis';
import Block from '../Block/Block';


function csvJSON(csv){

  var lines=csv.split("\n");

  var result = [];

  var headers=lines[0].split(",");

  for (var i = 0; i < headers.length - 1; i++) {
    var val = headers[i];
    val = val.replace(/(?:\\[rn]|[\r\n]+)+/g, "").trim();
    console.log(val);
    headers[i] = val;
  }

  for(var i=1;i<lines.length;i++){

	  var obj = {};
	  var currentline=lines[i].split(",");

	  for(var j=0;j<headers.length;j++){
      if (headers[j] == '') continue;

      var val = currentline[j];
      if (!isNaN(parseFloat(val))) {
        val = parseFloat(val);
      }
		  obj[headers[j]] = val;

	  }

	  result.push(obj);

  }
  
  //return result; //JavaScript object
  const grouped =  groupBy(result, 'player'); //JSON
  for (let player of Object.keys(grouped)){
    for (let i = 0; i < grouped[player].length; i++) {
      delete grouped[player][i]['player'];
    }
  }

  return grouped;
}

var groupBy = function(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

const DamageChart = (props) => {
  const [data, setData] = useState(null);

  if (data == null){
    axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/logfile/${props.id}`, {
        // params :{
        //     dataType: 'json'
        // }
    })
        .then(function (response) {
            console.log('SUCCESS', response);
            console.log(csvJSON(response.data.data));
            setData(csvJSON(response.data.data));
        })
        .catch(function (error) {
            console.log('ERROR', error)
        });
      
        return <div>asdasdg</div>;
  }

  const width = 700;
  const height = 400;
  const margin = { top: 20, bottom: 20, left: 20, right: 20 };

  // Then we'll create some bounds
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  // We'll make some helpers to get at the data we want
  const x = d => d.time;
  const y = d => d['damage\r'];
  const data2 = data['MortalWombat'];
  // And then scale the graph by our data
  const xScale = scaleTime({
    range: [50, xMax],
    // round: true,
    domain: [min(data2, x), max(data2, x) + 25],
    padding: 0.4,
  });
  const yScale = scaleLinear({
    range: [height - 50, 50],
    // round: true,
    domain: [min(data2, y), max(data2, y)],
  });

  // Compose together the scale and accessor functions to get point functions
  const compose = (scale, accessor) => data2 => scale(accessor(data2));
  const xPoint = compose(xScale, x);
  const yPoint = compose(yScale, y);
  // const curveTypes = Object.keys(allCurves);
  console.log(data2)

  // xScale.range([0, width - 50]);
  // yScale.range([height - 2, 0]);
  return (
  <div className="DamageChart">
    <Block>
    <svg width={width} height={height}>
    {/* <rect x={0} y={0} width={width} height={height} fill="#444444bb"  /> */}
    {Object.keys(data).map(player => <LinePath
      data={data[player]}
      x={xPoint}
      y={yPoint}
      strokeWidth={2}
      stroke="white"
    />)}
    </svg>
    </Block>
  </div>
);
};

// DamageChart.propTypes = {};

// DamageChart.defaultProps = {};

export default DamageChart;
