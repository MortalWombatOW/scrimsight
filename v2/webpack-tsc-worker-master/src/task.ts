export enum TaskType {
    ParseLog,
}



type MapInfoTransform = (arg0: any) => any;

export class Task {
  inputKey: string;
  outputKey: string;
  run: MapInfoTransform;
}










const taskConfig: Map<TaskType, Task> = new Map([
  [
    TaskType.ParseLog,
    {
      inputKey: "log",
      outputKey: "events",
      run: (log: string) => {
        console.log(log);
      },
    },
  ],
]);

export function getTask(taskType: TaskType): Task {
    return taskConfig.get(taskType);
}
