import {Data} from './metricsv2';

export default class ResultCache {
  static data: {[key: string]: Data | string} = {};

  static storeKeyValue(key, value) {
    console.log('storing', key);
    this.data[key] = value;
  }

  static getValueForKey(key) {
    return this.data[key];
  }

  static notDone(key) {
    return this.data[key] === undefined || this.data[key] === 'running';
  }

  static clear() {
    this.data = {};
  }
}
