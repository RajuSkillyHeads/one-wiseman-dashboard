import React from 'react';

const Header = ({ selectedClientId, onClientChange, clients }) => {
  const clientOptions = ['all', ...Object.keys(clients || {})];

  return (
    <header className="app-header">
      <div className="left">
        <div className="brand">One Wiseman • Admin Dashboard</div>
      </div>
      <div className="filters">
        <label htmlFor="clientFilter">Client</label>
        <select 
          id="clientFilter" 
          value={selectedClientId}
          onChange={(e) => onClientChange(e.target.value)}
        >
          {clientOptions.map(clientId => (
            <option key={clientId} value={clientId}>
              {clientId === 'all' ? 'All' : clientId}
            </option>
          ))}
        </select>
      </div>
    </header>
  );
};

export default Header;
