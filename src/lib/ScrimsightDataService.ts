import * as Comlink from 'comlink';
import type { ScrimsightDataModel } from './ScrimsightDataModel';

type WorkerAPI = {
  processFiles(files: { fileName: string; fileModified: number; fileContent: string }[]): Promise<ScrimsightDataModel>;
};

export class ScrimsightDataService {
  private dataModel: ScrimsightDataModel | null = null;
  private worker: Worker | null = null;
  private workerAPI: Comlink.Remote<WorkerAPI> | null = null;
  private isProcessing = false;

  constructor() {
    this.initializeWorker();
  }

  private initializeWorker(): void {
    try {
      this.worker = new Worker(new URL('./buildDataModel.worker.ts', import.meta.url), {
        type: 'module'
      });
      this.workerAPI = Comlink.wrap<WorkerAPI>(this.worker);
    } catch (error) {
      console.error('Failed to initialize web worker:', error);
    }
  }

  async addFiles(files: File[]): Promise<void> {
    if (this.isProcessing) {
      throw new Error('Already processing files. Please wait for the current operation to complete.');
    }

    if (!this.workerAPI) {
      throw new Error('Web worker not available');
    }

    this.isProcessing = true;

    try {
      const fileData = await Promise.all(
        files.map(async (file) => {
          const fileContent = await this.readFileAsText(file);
          return {
            fileName: file.name,
            fileModified: file.lastModified,
            fileContent
          };
        })
      );

      this.dataModel = await this.workerAPI.processFiles(fileData);
    } finally {
      this.isProcessing = false;
    }
  }

  private readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === 'string') {
          resolve(result);
        } else {
          reject(new Error('Failed to read file as text'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error(`Failed to read file: ${file.name}`));
      };
      
      reader.readAsText(file);
    });
  }


  getDataModel(): ScrimsightDataModel {
    if (!this.dataModel) {
      throw new Error('No data model available. Please add files first using addFiles().');
    }
    return this.dataModel;
  }

  isDataAvailable(): boolean {
    return this.dataModel !== null;
  }

  clearData(): void {
    this.dataModel = null;
  }

  dispose(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.workerAPI = null;
    this.dataModel = null;
    this.isProcessing = false;
  }
}