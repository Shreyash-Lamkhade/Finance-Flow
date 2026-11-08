/**
 * charts.js
 * Chart.js with Tableau 10 color palette
 */

let pieChart = null;
let barChart = null;

// Tableau 10 standard palette
const TABLEAU_COLORS = [
  '#4E79A7', '#F28E2B', '#E15759', '#76B7B2', '#59A14F',
  '#EDC948', '#B07AA1', '#FF9DA7', '#9C755F', '#BAB0AC'
];

const TABLEAU_INCOME = '#59A14F';
const TABLEAU_EXPENSE = '#E15759';

/** Get chart text/grid colors based on current theme */
const getChartTheme = () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  return {
    text: isDark ? '#94A3B8' : '#64748B',
    grid: isDark ? '#2D3748' : '#E2E8F0',
    tooltipBg: isDark ? '#1C2430' : '#FFFFFF'
  };
};

/** Initialize or update pie chart (expenses by category) */
export const updatePieChart = (categoryData) => {
  const canvas = document.getElementById('pieChart');
  const labels = Object.keys(categoryData);
  const values = Object.values(categoryData);
  const theme = getChartTheme();

  if (pieChart) pieChart.destroy();

  pieChart = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: TABLEAU_COLORS.slice(0, labels.length),
        borderWidth: 2,
        borderColor: document.documentElement.getAttribute('data-theme') === 'dark' ? '#1C2430' : '#FFFFFF'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '55%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: theme.text, padding: 14, font: { family: 'Inter', size: 12 } }
        }
      }
    }
  });
};

/** Initialize or update bar chart (income vs expense) – Tableau style */
export const updateBarChart = (income, expenses) => {
  const canvas = document.getElementById('barChart');
  const theme = getChartTheme();

  if (barChart) barChart.destroy();

  barChart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: ['Income', 'Expenses'],
      datasets: [{
        label: 'Amount (₹)',
        data: [income, expenses],
        backgroundColor: [TABLEAU_INCOME, TABLEAU_EXPENSE],
        hoverBackgroundColor: ['#4A8E42', '#C94547'],
        borderRadius: { topLeft: 4, topRight: 4 },
        borderSkipped: false,
        barThickness: 48
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { top: 28, right: 16, bottom: 4, left: 8 } },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: theme.tooltipBg,
          titleColor: theme.text,
          bodyColor: theme.text,
          borderColor: theme.grid,
          borderWidth: 1,
          padding: 10,
          callbacks: {
            label: ctx => ` ₹${ctx.parsed.y.toFixed(2)}`
          }
        },
        // Value labels drawn on top of bars
        datalabels: false
      },
      scales: {
        y: {
          beginAtZero: true,
          border: { display: false, dash: [4, 4] },
          ticks: {
            color: theme.text,
            font: { family: 'Inter', size: 11 },
            maxTicksLimit: 5,
            callback: val => `₹${val >= 1000 ? (val / 1000).toFixed(1) + 'k' : val}`
          },
          grid: {
            color: theme.grid,
            lineWidth: 1
          }
        },
        x: {
          border: { display: false },
          ticks: {
            color: theme.text,
            font: { family: 'Plus Jakarta Sans', size: 12, weight: '600' }
          },
          grid: { display: false }
        }
      },
      animation: {
        onComplete(ctx) {
          // Draw value labels on top of bars after animation
          const chart = ctx.chart;
          const { ctx: c, data } = chart;
          c.save();
          c.font = `600 12px 'Plus Jakarta Sans', Inter, sans-serif`;
          c.textAlign = 'center';
          c.textBaseline = 'bottom';
          data.datasets.forEach((dataset, i) => {
            const meta = chart.getDatasetMeta(i);
            meta.data.forEach((bar, index) => {
              const val = dataset.data[index];
              if (val === 0) return;
              const label = `₹${val >= 1000 ? (val / 1000).toFixed(1) + 'k' : val.toFixed(0)}`;
              c.fillStyle = theme.text;
              c.fillText(label, bar.x, bar.y - 6);
            });
          });
          c.restore();
        }
      }
    }
  });
};

/** Update both charts */
export const updateCharts = (stats, categoryData) => {
  updatePieChart(categoryData);
  updateBarChart(stats.income, stats.expenses);
};
