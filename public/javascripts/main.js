let barChart; // Declare globally to manage bar chart instance
let lineChart; // Declare globally to manage line chart instance

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Parse the data from the hidden input
    const filteredChartData = JSON.parse(document.querySelector("#dataValue").value || '[]');
    let data = [];

    // Fetch data if filteredChartData is empty
    if (!filteredChartData || filteredChartData.length === 0) {
      const response = await fetch(`/data`);
      const fetchedData = await response.json();

      if (!Array.isArray(fetchedData)) {
        throw new TypeError("Fetched data must be an array");
      }

      data = fetchedData;
    } else {
      data = filteredChartData;
    }

    // Ensure data is an array
    if (!Array.isArray(data)) {
      throw new TypeError("Data must be an array");
    }

    // Calculate total time spent for each feature
    const featureTotals = calculateFeatureTotals(data);

    // Render horizontal bar chart
    renderHorizontalBarChart(featureTotals, data);
  } catch (error) {
    console.error("Error fetching filtered data:", error);
    alert("Failed to load filtered data.");
  }
});


// Calculate totals for each feature
function calculateFeatureTotals(data) {
  const totals = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
  data.forEach((row) => {
    // Convert feature values to numbers and add to totals
    for (const feature in totals) {
      totals[feature] += parseInt(row[feature], 10) || 0; // Add the feature's value or 0 if undefined or NaN
    }
  });
  return totals;
}

// Render the horizontal bar chart
function renderHorizontalBarChart(featureTotals, fullData) {
  const ctx = document.getElementById("barChart").getContext("2d");

  const labels = Object.keys(featureTotals); // Features (A, B, C...)
  const data = Object.values(featureTotals); // Corresponding totals

  // Destroy any existing bar chart instance
  if (barChart) {
    barChart.destroy();
  }

  barChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Total Time Spent",
          data: data,
          backgroundColor: labels.map((label) => getColor(label)),
          borderColor: labels.map((label) => getColor(label)),
          borderWidth: 1,
        },
      ],
    },
    options: {
      indexAxis: "y", // Horizontal bars
      responsive: true,
      onClick: (event, elements) => {
        if (elements.length > 0) {
          const clickedIndex = elements[0].index;
          const feature = labels[clickedIndex];
          renderTimeTrendLineChart(feature, fullData);
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Total Time Spent (in hours)", // X-axis title
          },
        },
        y: {
          title: {
            display: true,
            text: "Features", // Y-axis title
          },
        },
      },
    },
  });
}

function renderTimeTrendLineChart(feature, data) {
  const ctx = document.getElementById("lineChart").getContext("2d");
  document.getElementById("lineChart").style.display = "block";

  // Prepare data for the selected feature
  const timeTrendData = data
    .map((row) => {
      const dateParts = row.Day.split("/");
      if (dateParts.length !== 3) {
        console.error(`Invalid date format: ${row.Day}`);
        return null;
      }

      const formattedDate = new Date(Date.UTC(dateParts[2], dateParts[1] - 1, dateParts[0])); // UTC midnight
      if (isNaN(formattedDate)) {
        console.error(`Invalid date: ${row.Day}`);
        return null;
      }

      return {
        date: formattedDate.toISOString().split("T")[0], // Format as yyyy-MM-dd
        value: parseInt(row[feature], 10) || 0, // Convert feature value to number
      };
    })
    .filter((item) => item !== null);

  if (timeTrendData.length === 0) {
    alert("No valid data available for this feature.");
    return;
  }

  // Sort by date
  timeTrendData.sort((a, b) => new Date(a.date) - new Date(b.date));

  const labels = timeTrendData.map((point) => point.date);
  const values = timeTrendData.map((point) => point.value);

  // Destroy the existing line chart instance
  if (lineChart) {
    lineChart.destroy();
  }

  // Create a new line chart
  lineChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: `Time Trend for Feature ${feature}`,
          data: values,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.4,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          type: "time",
          time: {
            parser: "yyyy-MM-dd",
            unit: "day",
            tooltipFormat: "dd MMM yyyy",
          },
          title: {
            display: true,
            text: "Date",
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Time Spent",
          },
        },
      },
      plugins: {
        zoom: {
          pan: {
            enabled: true, // Enable panning
            mode: "x", // Restrict panning to the x-axis
          },
          zoom: {
            wheel: {
              enabled: true, // Enable zooming with the mouse wheel
            },
            pinch: {
              enabled: true, // Enable zooming with pinch gestures
            },
            mode: "x", // Restrict zooming to the x-axis
          },
        },
      },
    },
  });
}

// Helper to assign colors to features
function getColor(label) {
  const colors = {
    A: "rgba(75, 192, 192, 0.8)", // Cyan
    B: "rgba(153, 102, 255, 0.8)", // Purple
    C: "rgba(255, 159, 64, 0.8)", // Orange
    D: "rgba(54, 162, 235, 0.8)", // Blue
    E: "rgba(255, 99, 132, 0.8)", // Red
    F: "rgba(255, 205, 86, 0.8)", // Yellow
  };
  return colors[label] || "rgba(201, 203, 207, 0.8)"; // Default gray
}
