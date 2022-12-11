import {TsBase64} from './TsBase64';
import {Report} from './types';

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
