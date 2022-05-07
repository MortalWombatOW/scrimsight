import React, {useMemo} from 'react';
import {useParams} from 'react-router-dom';
import {reportMap} from '../../lib/data/report';

const ReportPage = () => {
  const {id} = useParams();
  const shouldLoadReport = !!id;

  const report = useMemo(() => (id ? reportMap[id] : null), [shouldLoadReport]);

  return <div>ReportPage</div>;
};

export default ReportPage;
