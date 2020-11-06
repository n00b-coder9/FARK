import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';

/**
 * This is the Pie Chart component
 * This has two variants
 * 1. This plots the no of clicks made in the last month per location on a pieChart
 * 2. This plots the no of clicks made in the last month per url on a pieChart
 * @usage Just import it and pass a variant prop
 * whose value should be 'Clicks_by_location' for 1 else Clicks_by_urls for 2
 */

export default function PieChart(props) {
  const { variant } = props;

  const urls = useSelector((state) => state.urls.urls);
  const selectedUrl = useSelector((state) => state.urls.selectedUrl);
  const clicks = selectedUrl ? selectedUrl.clicks : [];
  let options = null;

  // Check if the
  if (variant === 'Clicks_by_location') {
    const groups = clicks.reduce((groups, click) => {
      const location = click.location.state;
      if (!groups[location]) {
        groups[location] = [];
      }
      const date1 = new Date();
      const date2 = new Date(click.time.split('T')[0]);
      const diffDays = Math.ceil((date1 - date2) / (1000 * 60 * 60 * 24));
      if (diffDays <= 31) {
        groups[location].push(click);
      }
      return groups;
    }, {});
    const groupArrays = Object.keys(groups).map((location) => {
      return {
        name: location,
        y: groups[location].length,
      };
    });
    options = {
      chart: {
        plotBackgroundColor: '#fbfbfb',
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
      },
      title: {
        text: 'Clicks by Location',
        align: 'left',
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
      },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}<b/>:{point.percentage:.1f} %',
          },
        },
      },
      series: [{
        name: 'Clicks',
        colorByPoint: true,
        data: groupArrays,
      }],
    };
  } else if (variant === 'Clicks_by_urls') {
    const groups = urls.reduce((groups, url) => {
      const clicks = url.clicks ? url.clicks : [];
      const title = url.title ? url.title : url.shortUrl;
      for (const click of clicks) {
        const date1 = new Date();
        const date2 = new Date(click.time.split('T')[0]);
        const diffDays = Math.ceil((date1 - date2) / (1000 * 60 * 60 * 24));
        if (!groups[title]) {
          groups[title] = [];
        }
        if (diffDays <= 31) {
          groups[title].push(click);
        }
      }
      return groups;
    }, {});
    const groupArrays = Object.keys(groups).map((title) => {
      return {
        name: title,
        y: groups[title].length,
      };
    });
    options = {
      chart: {
        plotBackgroundColor: '#fbfbfb',
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
      },
      title: {
        text: 'Clicks last month',
        align: 'left',
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
      },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}<b/>:{point.percentage:.1f} %',
          },
        },
      },
      series: [{
        name: 'Clicks',
        colorByPoint: true,
        data: groupArrays,
      }],
    };
  }
  return (
    <div style={{
      display: 'flex',
      flexGrow: 1,
      height: '40%',
    }}>
      <div style={{
        width: '100% !important',
        backgroundColor: '#fbfbfb',
      }}>
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
        />
      </div>
    </div>
  );
}

PieChart.propTypes = {
  variant: PropTypes.string,
};
