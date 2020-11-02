import PropTypes from 'prop-types';
import React from 'react';
import { Pie } from 'react-chartjs-2';
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
  let state = null;
  let title = null;

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
        location,
        clicks: groups[location],
      };
    });
    state = {
      labels: groupArrays.map((groups) => groups.location),
      datasets: [{
        label: 'Clicks',
        backgroundColor: [
          '#f95d6a',
          '#ff7c43',
          '#ffa600',
          '#2a5c36',
          '#386323',
          '#4f6702',
          '#6b6900',
          '#8c6600',
          '#b15d00',
          '#d84900',
          '#ff1313'],
        hoverbackgroundColor: [
          '#B21F00',
          '#C9DE00',
          '#2FDE00',
          '#00A6B4',
          '#6800B4',
          '#003f5c',
          '#2f4b7c',
          '#665191',
          '#a05195',
          '#d45087',
        ],
        data: groupArrays.map((groups) => groups.clicks.length),
      }],
    };
    title = 'Urls Clicked by location';
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
        title,
        clicks: groups[title],
      };
    });
    state = {
      labels: groupArrays.map((groups) => groups.title),
      datasets: [{
        label: 'Clicks',
        backgroundColor: [
          '#f95d6a',
          '#ff7c43',
          '#ffa600',
          '#2a5c36',
          '#386323',
          '#4f6702',
          '#6b6900',
          '#8c6600',
          '#b15d00',
          '#d84900',
          '#ff1313'],
        hoverbackgroundColor: [
          '#B21F00',
          '#C9DE00',
          '#2FDE00',
          '#00A6B4',
          '#6800B4',
          '#003f5c',
          '#2f4b7c',
          '#665191',
          '#a05195',
          '#d45087',
        ],
        data: groupArrays.map((groups) => groups.clicks.length),
      }],
    };
    title = 'Urls Clicked Last Month';
  }
  return (
    <div style={{
      height: '100%',
      display: 'flex',
    }}>
      <Pie
        data={state}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          title: {
            display: true,
            text: title,
            fontSize: 20,
          },
          legend: {
            display: true,
            position: 'right',
          },

        }}
      />
    </div>
  );
}

PieChart.propTypes = {
  variant: PropTypes.string,
};
