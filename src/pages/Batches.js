import React from 'react';
import { aggregateKPIs, formatDate } from '../utils/dataUtils';

const Batches = ({ data, selectedClientId }) => {
  if (!data) return <div className="loading">Loading...</div>;

  const kpis = aggregateKPIs(data, selectedClientId);
  const batches = kpis.collections.allBatches;

  return (
    <section className="tables">
      <div className="panel">
        <div className="panel-header">Batches</div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Client</th>
                <th>Batch ID</th>
                <th>Name</th>
                <th>Status</th>
                <th>Start</th>
                <th>End</th>
                <th>Assignments</th>
                <th>Assessments</th>
              </tr>
            </thead>
            <tbody>
              {batches.map(({ clientId, batchId, batch }) => {
                if (selectedClientId !== 'all' && clientId !== selectedClientId) return null;
                
                return (
                  <tr key={`${clientId}-${batchId}`}>
                    <td>{clientId}</td>
                    <td>{batchId}</td>
                    <td>{batch.batch_name || ''}</td>
                    <td>{batch.status || ''}</td>
                    <td>{formatDate(batch.start_date)}</td>
                    <td>{formatDate(batch.end_date)}</td>
                    <td>{Object.keys(batch.assignments || {}).length}</td>
                    <td>{Object.keys(batch.assessments || {}).length}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Batches;
