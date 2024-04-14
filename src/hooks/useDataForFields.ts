import React from 'react';
import {useDataNodes} from './useData';
import {AlaSQLNode} from '../WombatDataFramework/DataTypes';

const matchFields = (queryInputFields: string[], dataFields: string[]) => {
  return queryInputFields.every((f) => dataFields.includes(f));
};

const dataNodes: {
  fields: string[];
  node: AlaSQLNode<any>;
}[] = [
  {
    fields: ['mapId', 'team1Name', 'team2Name'],
    node: new AlaSQLNode(
      'mapteams',
      `SELECT
        mapId,
        team1Name,
        team2Name
      FROM ? AS match_start
      `,
      ['match_start_object_store'],
    ),
  },
];

export const useDataForFields = (fields: string[]) => {
  const node = dataNodes.find((n) => matchFields(fields, n.fields));
  console.log('useDataForFields', fields, node);
  const data = useDataNodes(node ? [node.node] : []);

  return node ? data[node.node.getName()] : [];
};
