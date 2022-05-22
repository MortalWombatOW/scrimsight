import React, {useState} from 'react';
import {decodeReport, encodeReport} from 'lib/data/report';
import Header from '../../components/Header/Header';
import {
  ReportControl,
  ReportComponentType,
  ReportControlType,
  ReportMetricGroup,
} from '../../lib/data/types';
import './ReportBuilderPage.scss';
import {Button, Checkbox, FormControlLabel, FormGroup} from '@mui/material';
import {enumKeys} from '../../lib/enum';
import AddIcon from '@mui/icons-material/Add';

const ReportBuilderPage = () => {
  const [reportTitle, setReportTitle] = useState('');
  const [controls, setControls] = useState<ReportControl[]>([]);
  // const [controlDefaults, setControlDefaults] = useState({});
  const [metricGroups, setMetricGroups] = useState<ReportMetricGroup[]>([]);
  const [encoded, setEncoded] = useState('');

  if (encoded.length > 0) {
    const report = decodeReport(encoded);
    console.log(report);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const report = {
      title: reportTitle,
      controls,
      // controlDefaults: {...controlDefaults},
      metricGroups,
    };
    setEncoded(encodeReport(report));
  };

  return (
    <div className="ReportBuilderPage">
      <Header refreshCallback={undefined} />
      <div className="container">
        <h1>Report Builder</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Report Title</label>
            <input
              type="text"
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
            />
          </div>
          <div>
            <label>Controls</label>
            <FormGroup>
              {enumKeys(ReportControlType).map((type) => (
                <FormControlLabel
                  key={type}
                  control={
                    <Checkbox
                      checked={
                        controls.filter((c) => c.type == type).length == 1
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setControls((prev) => [...prev, {type}]);
                        } else {
                          setControls((prev) =>
                            prev.filter((c) => c.type !== type),
                          );
                        }
                      }}
                    />
                  }
                  label={ReportControlType[type]}
                />
              ))}
            </FormGroup>
          </div>
          <div>
            <label>Metric Groups</label>
            {metricGroups.map((group, i) => (
              <div key={i}>metric!</div>
            ))}
            {/* <FormGroup>
              {enumKeys(ReportControlType).map((key) => (
                <FormControlLabel
                  key={key}
                  control={
                    <Checkbox
                      checked={
                        controls.filter((c) => (c.type = key)).length == 1
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setControls((prev) => [
                            ...prev,
                            {type: key as ReportControlType},
                          ]);
                        } else {
                          setControls((prev) =>
                            prev.filter((c) => c.type !== key),
                          );
                        }
                      }}
                    />
                  }
                  label={ReportControlType[key]}
                />
              ))}
            </FormGroup> */}
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => {
                setMetricGroups((prev) => [
                  ...prev,
                  {
                    metric: {
                      values: [],
                      groups: [],
                      filters: [],
                    },
                    components: [],
                  },
                ]);
              }}>
              Add metric
            </Button>
          </div>
          <button type="submit">Submit</button>
        </form>
        <pre>{encoded}</pre>
      </div>
    </div>
  );
};

export default ReportBuilderPage;
