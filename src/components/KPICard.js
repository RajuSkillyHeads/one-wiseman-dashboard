import React from 'react';

const KPICard = ({ icon, label, value }) => {
  return (
    <div className="kpi">
      <div className="kpi-header">
        <span className="kpi-icon">{icon}</span>
        <span className="kpi-label">{label}</span>
      </div>
      <div className="kpi-value">{value}</div>
    </div>
  );
};

export default KPICard;
