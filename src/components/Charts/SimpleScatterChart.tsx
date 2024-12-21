import { LabelList, Scatter, ScatterChart, XAxis, YAxis } from "recharts";
import { SingleKeyDoubleValueData } from "~/lib/data/shapes";

export const SimpleScatterChart = <T extends object>({ categoryKey, valueKey, valueKey2, data }: SingleKeyDoubleValueData<T>) => {
  return (
    <ScatterChart width={500} height={400}>
      <XAxis dataKey={valueKey}
        type="number"
      />
      <YAxis dataKey={valueKey2}
        type="number"
      />
      <Scatter data={data} fill="#8884d8">
        <LabelList
          dataKey={categoryKey}
          position="top"
        />
      </Scatter>
    </ScatterChart>
  );
};
