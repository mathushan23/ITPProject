const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

// Utility to generate dynamic colors for datasets
const generateColors = (count) => {
  return Array.from({ length: count }, (_, i) => `hsl(${(i * 360) / count}, 70%, 60%)`);
};

const generateChartBuffer = async (type, labels, data) => {
  const width = 800;
  const height = 400;
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

  const isPie = type === 'pie';
  const colors = generateColors(labels.length);

  const config = {
    type: type,
    data: {
      labels: labels,
      datasets: [
        {
          label: isPie ? '' : 'Order Stats',
          data: data,
          backgroundColor: colors,
          borderColor: isPie ? '#ffffff' : '#333',
          borderWidth: 2,
          fill: type === 'line', // fill only for line charts
          tension: 0.4, // line smoothing
        },
      ],
    },
    options: {
      responsive: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            font: {
              size: 12,
            },
          },
        },
        tooltip: {
          enabled: true,
          backgroundColor: '#f5f5f5',
          titleFont: { size: 14 },
          bodyFont: { size: 12 },
          borderColor: '#ccc',
          borderWidth: 1,
        },
      },
      ...(isPie
        ? {}
        : {
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Days / Categories',
                  font: {
                    size: 14,
                    weight: 'bold',
                  },
                },
                ticks: {
                  font: {
                    size: 12,
                  },
                },
              },
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Number of Orders',
                  font: {
                    size: 14,
                    weight: 'bold',
                  },
                },
                ticks: {
                  font: {
                    size: 12,
                  },
                },
              },
            },
          }),
    },
  };

  try {
    return await chartJSNodeCanvas.renderToBuffer(config);
  } catch (error) {
    console.error('Chart render error:', error);
    throw error;
  }
};

module.exports = { generateChartBuffer };
