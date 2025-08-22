import React from 'react';
import { useParams } from 'react-router-dom';
import { collectUserSubmissions, normalizeEmail, safeArray } from '../utils/dataUtils';

const UserDetail = ({ data, selectedClientId }) => {
  const { userId } = useParams();
  
  if (!data) return <div className="loading">Loading...</div>;

  const users = data.users || {};
  const u = users[userId];
  
  if (!u) return <div className="error">User not found</div>;

  const email = (u.email || '').toString();
  const emailNorm = normalizeEmail(email);
  const clients = Object.keys(u.clients || {});
  const batches = clients.flatMap(cid => safeArray(((u.clients || {})[cid] || {}).batches)).map(String);
  const userSubmissions = collectUserSubmissions(data, emailNorm);

  return (
    <>
      <section className="kpis" id="userDetails">
        <div className="kpi">
          <div className="kpi-label">User ID</div>
          <div className="kpi-value">{userId}</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Email</div>
          <div className="kpi-value">{email.replaceAll('"', '')}</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Default Client</div>
          <div className="kpi-value">{u.default_client || u.defaultClient || ''}</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Default Language</div>
          <div className="kpi-value">{u.default_language || u.defaultLanguage || ''}</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Clients</div>
          <div className="kpi-value">{clients.join(', ')}</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Batches</div>
          <div className="kpi-value">{batches.join(', ')}</div>
        </div>
      </section>

      <section className="tables">
        <div className="panel">
          <div className="panel-header">Recent Submissions</div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Client</th>
                  <th>Scope</th>
                  <th>ID</th>
                  <th>Version</th>
                  <th>Avg Completeness</th>
                  <th>Avg Quality</th>
                  <th>Focus Loss</th>
                  <th>Pastes</th>
                </tr>
              </thead>
              <tbody>
                {userSubmissions.map((row, index) => (
                  <tr key={index}>
                    <td>{row.dateMs ? new Date(row.dateMs).toLocaleString() : ''}</td>
                    <td>{row.clientId}</td>
                    <td>{row.scope}</td>
                    <td>{row.id}</td>
                    <td>{row.version}</td>
                    <td>{row.avgCompleteness.toFixed(1)}%</td>
                    <td>{row.avgQuality.toFixed(1)}%</td>
                    <td>{row.focusLoss}</td>
                    <td>{row.pastes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
};

export default UserDetail;
