import {
  Metric,
  PackedReport,
  Report,
  ReportComponentType,
  ReportControl,
} from './types';
import {encode, decode} from '@msgpack/msgpack';
import {TsBase64} from './TsBase64';
import {keys} from 'ts-transformer-keys';
// const damageByPlayer: Metric = {
//   values: [],
// };

// function toHexString(byteArray) {
//   return Array.prototype.map
//     .call(byteArray, function (byte) {
//       return ('0' + (byte & 0xff).toString(16)).slice(-2);
//     })
//     .join('');
// }

// function toByteArray(hexString) {
//   const result: number[] = [];
//   for (let i = 0; i < hexString.length; i += 2) {
//     result.push(parseInt(hexString.substr(i, 2), 16));
//   }
//   return result;
// }

export const decodeReport = (encodedReport: string): Report => {
  return JSON.parse(TsBase64.Decode(encodedReport));
  // const packed = decode(
  //   toByteArray(TsBase64.Decode(encodedReport)),
  // ) as PackedReport;
  // return unpackReport(packed);
};

export const encodeReport = (report: Report): string => {
  return TsBase64.Encode(JSON.stringify(report));
};

// const getPacked = (arr: any[] | any): any[] => {
//   if (!Array.isArray(arr)) {
//     return ['>', arr];
//   }
//   const packed: PackedReport = [];
//   packed.push(arr.length);
//   for (const item of arr) {
//     packed.push(...getPacked(item));
//   }
//   return packed;
// };

// export const packReport = (report: Report): PackedReport => {
//   const pr: PackedReport = [];
//   pr.push(report.title);
//   // push controls
//   pr.push(report.controls.length);
//   for (const control of report.controls) {
//     pr.push(control.type);
//   }
//   // push metric groups
//   pr.push(report.metricGroups.length);
//   for (const metricGroup of report.metricGroups) {
//     pr.push(metricGroup.metric.values.length);
//     for (const metricValue of metricGroup.metric.values) {
//       pr.push(metricValue);
//     }
//     pr.push(metricGroup.metric.groups.length);
//     for (const group of metricGroup.metric.groups) {
//       pr.push(group);
//     }
//     pr.push(metricGroup.metric.filters ? metricGroup.metric.filters.length : 0);
//     if (metricGroup.metric.filters) {
//       for (const filter of metricGroup.metric.filters) {
//         pr.push(filter.type);
//         pr.push(filter.value);

//   return pr;
// };

// export function unpackReport<T extends {[key: string]: unknown}>(
//   packed: PackedReport,
// ) {
//   const objKeys = keys<T>();
//   const obj: T = {} as T;
//   let keyPtr = 0;
//   let i = 0;
//   while (i < packed.length) {
//     const lengthOrStr = packed[i];
//     if (lengthOrStr === '>') {
//       obj[objKeys[keyPtr++]] = packed[i + 1] as string;
//       i += 2;
//     } else if
//       const arr = [];
//       for (let j = 0; j < lengthOrStr; j++) {
//         arr.push(packed[i + j + 1]);
//       }
//       obj[objKeys[keyPtr++]] = arr;
//       i += lengthOrStr + 1;
//     }
// }
