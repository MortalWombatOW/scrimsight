import {Data} from './metricsv2';

export default class ResultCache {
  static data: {[key: string]: Data} = {};

  static storeKeyValue(key, value) {
    console.log('storing', key);
    this.data[key] = value;
  }

  static getValueForKey(key) {
    return this.data[key];
  }
}
