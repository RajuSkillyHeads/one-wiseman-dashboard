import React from 'react';
import { Link } from 'react-router-dom';
import { aggregateKPIs } from '../utils/dataUtils';

const Users = ({ data, selectedClientId }) => {
  if (!data) return <div className="loading">Loading...</div>;

  const kpis = aggregateKPIs(data, selectedClientId);
  const users = kpis.collections.allUsers;

  return (
    <section className="tables">
      <div className="panel">
        <div className="panel-header">Users</div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>S. No</th>
                <th>Email</th>
                <th>Default Client</th>
                <th>Default Language</th>
                <th>Clients</th>
              </tr>
            </thead>
            <tbody>
              {users.map(([uid, u], index) => {
                if (selectedClientId !== 'all') {
                  const memberships = Object.keys((u.clients || {}));
                  if (!memberships.includes(selectedClientId)) return null;
                }
                
                const clients = Object.keys(u.clients || {}).join(', ');
                const emailText = (u.email || '').toString().replaceAll('"', '');
                
                return (
                  <tr key={uid}>
                    <td>{index + 1}</td>
                    <td>
                      <Link to={`/user/${uid}`}>
                        {emailText}
                      </Link>
                    </td>
                    <td>{u.default_client || ''}</td>
                    <td>{u.default_language || ''}</td>
                    <td>{clients}</td>
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

export default Users;
