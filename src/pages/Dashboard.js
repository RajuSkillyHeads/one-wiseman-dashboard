import React from 'react';
import KPICard from '../components/KPICard';
import { 
  SubmissionsChart, 
  AverageScoresChart, 
  SubmissionSplitChart, 
  QuestionTypesChart 
} from '../components/Charts';
import { aggregateKPIs } from '../utils/dataUtils';

const Dashboard = ({ data, selectedClientId }) => {
  if (!data) return <div className="loading">Loading...</div>;

  const kpis = aggregateKPIs(data, selectedClientId);

  // Debug logging
  console.log('Dashboard KPIs:', kpis);
  console.log('Chart data:', {
    submissionsByDay: kpis.submissionsByDay,
    avgCompleteness: kpis.avgCompleteness,
    avgQuality: kpis.avgQuality,
    assignmentsCountBySub: kpis.assignmentsCountBySub,
    assessmentsCountBySub: kpis.assessmentsCountBySub,
    questionTypeCounts: kpis.questionTypeCounts
  });

  const kpiData = [
    { icon: '🏢', label: 'Clients', value: kpis.clientsCount },
    { icon: '🎓', label: 'Batches', value: kpis.batchesCount },
    { icon: '📝', label: 'Assignments', value: kpis.assignmentsCount },
    { icon: '🧪', label: 'Assessments', value: kpis.assessmentsCount },
    { icon: '❓', label: 'Questions', value: kpis.questionsCount },
    { icon: '👤', label: 'Users', value: kpis.usersCount },
    { icon: '📤', label: 'Submissions', value: kpis.submissionCount },
    { icon: '✅', label: 'Avg Completeness', value: `${kpis.avgCompleteness.toFixed(1)}%` },
    { icon: '⭐', label: 'Avg Quality', value: `${kpis.avgQuality.toFixed(1)}%` }
  ];

  return (
    <>
      <section className="kpis" id="overview">
        {kpiData.map((kpi, index) => (
          <KPICard
            key={index}
            icon={kpi.icon}
            label={kpi.label}
            value={kpi.value}
          />
        ))}
      </section>

      <section className="charts" id="charts">
        <SubmissionsChart submissionsByDay={kpis.submissionsByDay} />
        <AverageScoresChart 
          avgCompleteness={kpis.avgCompleteness}
          avgQuality={kpis.avgQuality}
        />
      </section>

      <section className="charts" id="more-charts">
        <SubmissionSplitChart 
          assignmentsCountBySub={kpis.assignmentsCountBySub}
          assessmentsCountBySub={kpis.assessmentsCountBySub}
        />
        <QuestionTypesChart questionTypeCounts={kpis.questionTypeCounts} />
      </section>

      <section className="tables" id="recent">
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
                  <th>User</th>
                  <th>Version</th>
                  <th>Avg Completeness</th>
                  <th>Avg Quality</th>
                  <th>Focus Loss</th>
                  <th>Pastes</th>
                </tr>
              </thead>
              <tbody>
                {kpis.recentSubmissions.map((row, index) => (
                  <tr key={index}>
                    <td>{row.dateMs ? new Date(row.dateMs).toLocaleString() : ''}</td>
                    <td>{row.clientId}</td>
                    <td>{row.scope}</td>
                    <td>{row.id}</td>
                    <td>{row.user}</td>
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

export default Dashboard;
