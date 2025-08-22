import React from 'react';
import { aggregateKPIs, formatDate, safeArray } from '../utils/dataUtils';

const Assignments = ({ data, selectedClientId }) => {
  if (!data) return <div className="loading">Loading...</div>;

  const kpis = aggregateKPIs(data, selectedClientId);
  const assignments = Array.from(kpis.collections.allAssignments.values());

  return (
    <section className="tables">
      <div className="panel">
        <div className="panel-header">Assignments</div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Client</th>
                <th>Scope</th>
                <th>ID</th>
                <th>Status</th>
                <th>Start</th>
                <th>Target</th>
                <th>#Questions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((v, index) => {
                if (selectedClientId !== 'all' && v.clientId !== selectedClientId) return null;
                
                const item = v.item || {};
                const start = item.start_date ? formatDate(item.start_date) : '';
                const target = item.target_date ? formatDate(item.target_date) : '';
                const qn = safeArray(item.questions).length;

                return (
                  <tr key={index}>
                    <td>{v.clientId}</td>
                    <td>{v.scope}{v.batchId ? `:${v.batchId}` : ''}</td>
                    <td>{v.id}</td>
                    <td>{item.status || ''}</td>
                    <td>{start}</td>
                    <td>{target}</td>
                    <td>{qn}</td>
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

export default Assignments;
