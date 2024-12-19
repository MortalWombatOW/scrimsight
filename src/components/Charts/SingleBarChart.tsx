import { Bar, BarChart, XAxis } from "recharts";
import { useWombatDataManager } from "wombat-data-framework";
import { SingleKeySingleValueData } from "~/lib/data/shapes";

export const SingleBarChart = <T extends object>({ categoryKey, valueKey, data }: SingleKeySingleValueData<T>) => {

  const dataManager = useWombatDataManager();

  const valueColumn = dataManager.getColumn(valueKey);

  return (
    <BarChart width={500} height={400} data={data} margin={{ top: 50, right: 30, left: 50, bottom: 100 }}>
      <XAxis dataKey={categoryKey} angle={-45} textAnchor="end" />
      <Bar dataKey={valueKey} fill="#8884d8" label={{ formatter: valueColumn.formatter, position: 'top', fill: 'grey', fontSize: 10 }} />
    </BarChart>
  );
};
