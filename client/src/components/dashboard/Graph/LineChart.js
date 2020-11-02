import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
/**
 * Line Chart component
 * This renders a line chart plotting the no of clicks made per day
 */


// The component to render the line chart
function LineChart() {
  const [height, setHeight] = useState(window.innerHeight * 0.35);
  const [width, setWidth] = useState(window.innerWidth * 0.5);
  // Retreive the selected Url
  const selectedUrl = useSelector((state) => state.urls.selectedUrl);
  const clicks = selectedUrl ? selectedUrl.clicks : [];

  useEffect(() => {
    window.onresize = () => {
      setWidth(window.innerWidth * 0.5);
      setHeight(window.innerHeight * 0.35);
    };
  });

  // Group the Clicks according to date
  const groups = clicks.reduce((groups, click) => {
    // Retrieve the Date from clicked time
    const date = click.time.split('T')[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(click);
    return groups;
  }, {});
  // Generate an array according to the groups made
  const groupArrays = Object.keys(groups).map((date) => {
    return {
      date,
      clicks: groups[date],
    };
  });

  // Data to be passed to the chart
  const state = {
    labels: groupArrays.map((groups) => groups.date),
    datasets: [{
      label: 'Clicks',
      fill: false,
      lineTension: 0.5,
      backgroundColor: 'rgba(75,192,192,1)',
      borderColor: 'rgba(0,0,0,1)',
      borderWidth: 2,
      data: groupArrays.map((groups) => groups.clicks.length),
    }],
  };

  return (<div>
    <Line
      height={height}
      width={width}
      data={state}
      options={{
        maintainAspectRatio: 'false',
        title: {
          display: true,
          text: 'Clicks per month',
          fontSize: 20,
        },
        legend: {
          display: true,
          position: 'right',
        },
      }}
    />
  </div>);
}

export default LineChart;
