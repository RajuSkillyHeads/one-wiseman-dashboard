import React from 'react';
import { aggregateKPIs, safeArray } from '../utils/dataUtils';

const Questions = ({ data, selectedClientId }) => {
  if (!data) return <div className="loading">Loading...</div>;

  const kpis = aggregateKPIs(data, selectedClientId);
  const questions = Array.from(kpis.collections.allQuestions.values());

  return (
    <section className="tables">
      <div className="panel">
        <div className="panel-header">Questions</div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Source</th>
                <th>Client</th>
                <th>Question ID</th>
                <th>Type</th>
                <th>Tags</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((v, index) => {
                if (selectedClientId !== 'all' && v.source === 'client' && v.clientId !== selectedClientId) return null;
                
                const item = v.item || {};
                const tags = safeArray(item.tags).join(', ');

                return (
                  <tr key={index}>
                    <td>{v.source}</td>
                    <td>{v.clientId || ''}</td>
                    <td>{v.id}</td>
                    <td>{item.type || ''}</td>
                    <td>{tags}</td>
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

export default Questions;
