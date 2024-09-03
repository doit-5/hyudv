import fetch from 'node-fetch';
import * as d3 from 'd3';
import { csvFormat } from 'd3-dsv';

const response = await fetch(
  'https://raw.githubusercontent.com/hanqyu/map-demo/main/south-korea.json'
);
const koreaMapData = await response.json();

console.log(JSON.stringify(koreaMapData, null, 2));
