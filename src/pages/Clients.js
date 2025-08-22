import React from 'react';
import { safeArray } from '../utils/dataUtils';

const Clients = ({ data, selectedClientId }) => {
  if (!data) return <div className="loading">Loading...</div>;

  const selected = selectedClientId === 'all' ? Object.keys(data.clients || {}) : [selectedClientId];

  return (
    <section className="tables">
      <div className="panel">
        <div className="panel-header">Clients</div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Client ID</th>
                <th>Name</th>
                <th>Primary Email</th>
                <th>Alt Emails</th>
                <th>Batches</th>
                <th>Assignments</th>
                <th>Assessments</th>
              </tr>
            </thead>
            <tbody>
              {selected.map(clientId => {
                const c = (data.clients || {})[clientId] || {};
                const cc = ((data.client_config || {})[clientId]) || {};
                const name = cc.name || c.name || '';
                const primary = c.primary_email || '';
                const alt = safeArray(c.alternative_emails).join(', ');
                const batchesCount = Object.keys(c.batches || {}).length;
                const assignmentsCount = Object.keys(c.assignments || {}).length + 
                  Object.values(c.batches || {}).reduce((acc, b) => acc + Object.keys(b.assignments || {}).length, 0);
                const assessmentsCount = Object.keys(c.assessments || {}).length + 
                  Object.values(c.batches || {}).reduce((acc, b) => acc + Object.keys(b.assessments || {}).length, 0);

                return (
                  <tr key={clientId}>
                    <td>{clientId}</td>
                    <td>{name}</td>
                    <td>{primary}</td>
                    <td>{alt}</td>
                    <td>{batchesCount}</td>
                    <td>{assignmentsCount}</td>
                    <td>{assessmentsCount}</td>
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

export default Clients;
