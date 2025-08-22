import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Helper function to get CSS variables
function getCssVar(name) {
  const rs = getComputedStyle(document.documentElement);
  return (rs.getPropertyValue(name) || '').trim();
}

// Helper function to convert hex to rgba
function hexToRgba(hex, alpha) {
  if (!hex) return `rgba(0,0,0,${alpha || 1})`;
  const h = hex.replace('#','');
  const bigint = parseInt(h.length === 3 ? h.split('').map(c=>c+c).join('') : h, 16);
  const r = (bigint >> 16) & 255, g = (bigint >> 8) & 255, b = bigint & 255;
  return `rgba(${r},${g},${b},${alpha == null ? 1 : alpha})`;
}

// Helper function to create gradient
function makeGradient(ctx, topColor, bottomColor) {
  const g = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
  g.addColorStop(0, topColor);
  g.addColorStop(1, bottomColor);
  return g;
}

// Common chart options
const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: getCssVar('--muted') || '#636177',
        font: {
          family: getComputedStyle(document.body).fontFamily
        }
      }
    }
  },
  scales: {
    x: {
      ticks: { color: getCssVar('--muted') },
      grid: { color: hexToRgba(getCssVar('--muted'), 0.15) }
    },
    y: {
      ticks: { color: getCssVar('--muted') },
      grid: { color: hexToRgba(getCssVar('--muted'), 0.15) },
      beginAtZero: true
    }
  }
};

export const SubmissionsChart = ({ submissionsByDay }) => {
  const dayLabels = Array.from(submissionsByDay.keys()).sort();
  const dayValues = dayLabels.map(d => submissionsByDay.get(d));
  
  // If no data, show empty state
  if (dayLabels.length === 0 || dayValues.every(v => v === 0)) {
    return (
      <div className="panel">
        <div className="panel-header">Submissions Over Time</div>
        <div style={{ height: '300px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
          No submission data available
        </div>
      </div>
    );
  }
  
  const lineBorder = getCssVar('--purple') || '#7b61ff';
  const purpleStrong = getCssVar('--purple-strong') || lineBorder;
  const magenta = getCssVar('--magenta') || '#ff3ea5';

  const data = {
    labels: dayLabels,
    datasets: [{
      label: 'Submissions',
      data: dayValues,
      borderColor: lineBorder,
      backgroundColor: (context) => {
        const chart = context.chart;
        const { ctx, chartArea } = chart;
        if (!chartArea) return null;
        return makeGradient(ctx, hexToRgba(purpleStrong, 0.35), hexToRgba(magenta, 0.08));
      },
      tension: 0.35,
      borderWidth: 2,
      pointRadius: 0,
      fill: 'start',
    }]
  };

  return (
    <div className="panel">
      <div className="panel-header">Submissions Over Time</div>
      <div style={{ height: '300px', padding: '20px' }}>
        <Line data={data} options={commonOptions} />
      </div>
    </div>
  );
};

export const AverageScoresChart = ({ avgCompleteness, avgQuality }) => {
  // If no data, show empty state
  if ((!avgCompleteness && avgCompleteness !== 0) || (!avgQuality && avgQuality !== 0)) {
    return (
      <div className="panel">
        <div className="panel-header">Average Scores</div>
        <div style={{ height: '300px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
          No score data available
        </div>
      </div>
    );
  }

  const blue = getCssVar('--blue') || '#3b82f6';
  const purpleStrong = getCssVar('--purple-strong') || getCssVar('--purple') || '#7b61ff';

  const data = {
    labels: ['Completeness', 'Quality'],
    datasets: [{
      label: 'Average %',
      data: [avgCompleteness || 0, avgQuality || 0],
      backgroundColor: [
        hexToRgba(blue, 0.85),
        hexToRgba(purpleStrong, 0.85)
      ],
      borderRadius: 10,
      borderSkipped: false
    }]
  };

  const options = {
    ...commonOptions,
    scales: {
      ...commonOptions.scales,
      y: {
        ...commonOptions.scales.y,
        max: 100
      }
    }
  };

  return (
    <div className="panel">
      <div className="panel-header">Average Scores</div>
      <div style={{ height: '300px', padding: '20px' }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export const SubmissionSplitChart = ({ assignmentsCountBySub, assessmentsCountBySub }) => {
  // If no data, show empty state
  if ((!assignmentsCountBySub && assignmentsCountBySub !== 0) || (!assessmentsCountBySub && assessmentsCountBySub !== 0)) {
    return (
      <div className="panel">
        <div className="panel-header">Submissions Split (Assignments vs Assessments)</div>
        <div style={{ height: '250px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
          No submission data available
        </div>
      </div>
    );
  }

  const purple = getCssVar('--purple') || '#7b61ff';

  const data = {
    labels: ['Assignments', 'Assessments'],
    datasets: [{
      data: [assignmentsCountBySub || 0, assessmentsCountBySub || 0],
      backgroundColor: [
        hexToRgba(purple, 0.9),
        hexToRgba(purple, 0.5)
      ],
      borderWidth: 0
    }]
  };

  const options = {
    ...commonOptions,
    cutout: '55%',
    plugins: {
      ...commonOptions.plugins,
      legend: {
        ...commonOptions.plugins.legend,
        position: 'bottom'
      }
    }
  };

  return (
    <div className="panel">
      <div className="panel-header">Submissions Split (Assignments vs Assessments)</div>
      <div style={{ height: '250px', padding: '20px' }}>
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export const QuestionTypesChart = ({ questionTypeCounts }) => {
  const labels = Object.keys(questionTypeCounts || {});
  const values = labels.map(l => questionTypeCounts[l]);
  
  // If no data, show empty state
  if (labels.length === 0 || values.every(v => v === 0)) {
    return (
      <div className="panel">
        <div className="panel-header">Question Types Distribution</div>
        <div style={{ height: '250px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
          No question data available
        </div>
      </div>
    );
  }

  const purple = getCssVar('--purple') || '#7b61ff';
  const shades = [0.95, 0.8, 0.65, 0.5, 0.35, 0.25].map(a => hexToRgba(purple, a));

  const data = {
    labels,
    datasets: [{
      data: values,
      backgroundColor: shades.slice(0, values.length),
      borderWidth: 0
    }]
  };

  const options = {
    ...commonOptions,
    cutout: '55%',
    plugins: {
      ...commonOptions.plugins,
      legend: {
        ...commonOptions.plugins.legend,
        position: 'bottom'
      }
    }
  };

  return (
    <div className="panel">
      <div className="panel-header">Question Types Distribution</div>
      <div style={{ height: '250px', padding: '20px' }}>
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};
