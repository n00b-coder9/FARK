import React from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import { useSelector } from 'react-redux';
/**
 * Line Chart component
 * This renders a line chart plotting the no of clicks made per day
 */

// The component to render the line chart
function LineChart() {
  // // Retreive the selected Url
  const selectedUrl = useSelector((state) => state.urls.selectedUrl);
  const clicks = selectedUrl ? selectedUrl.clicks : [];

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
  const options = {
    chart: {
      reflow: 'true',
      BackgroundColor: '#fbfbfb',
      plotBorderWidth: null,
      plotShadow: false,
      type: 'line',
    },
    title: {
      text: 'Clicks by Date ',
      align: 'left',
    },
    xAxis: {
      title: {
        text: 'Date',
      },
      categories: groupArrays.map((groups) => groups.date),
    },
    yAxis: {
      title: {
        text: 'Clicks',
      },
    },
    series: [{
      name: 'Clicks',
      data: groupArrays.map((groups) => groups.clicks.length),
    }],
  };

  return (
    <div style={{
      display: 'flex',
      flexGrow: 1,
      flexBasis: '30%',
    }}>
      <div style={{
        width: '100% !important',
        backgroundColor: '#fbfbfb',
      }}>

        <HighchartsReact
          highcharts={Highcharts}
          options={options} />
      </div>
    </div>);
}

export default LineChart;
