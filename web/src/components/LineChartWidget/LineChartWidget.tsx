import React, { useEffect, useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import Paper from '@material-ui/core/Paper'
import { Line } from 'react-chartjs-2';
import { ChartOptions, defaults } from 'chart.js';

defaults.global.defaultFontColor = '#ffffff';

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
      padding: theme.spacing(2),
      display: 'flex',
      overflow: 'auto',
      flexDirection: 'column',
  },
  title: {
      fontSize:20
  },
  chart: {
      padding: 10,
      height: 400
  }
}));

interface IProps {
    title: string,
    value: number | null,
    timestamp: string
}

interface IChartData {
  labels: Array<string>,
  datasets: Array<IData>
}

interface IData {
  pointBackgroundColor: string,
  data: Array<number>
}

const LineChartWidget: React.FC<IProps> = ({title, value, timestamp}: IProps) => {
  
  const classes = useStyles();

  const [chartData, setChartData] = useState<IChartData>({
    labels: [],
    datasets: [
      {
        pointBackgroundColor: "#fff",
        data: []
      }
    ]
  })

  useEffect(() => {

    const UpdateValues = (value : number, timestamp : string)=> {

      const newChartDataSet = { ...chartData.datasets[0] };
      newChartDataSet.data.push(value);
  
      var d = new Date(0);
      d.setUTCSeconds(parseInt(timestamp)/1000);      

      const newChartData = {
        ...chartData,
        datasets: [newChartDataSet],
        labels: chartData.labels.concat(
          d.toLocaleTimeString()
        )
      };
  
      setChartData(newChartData);
    }

    if (value && timestamp) {
      UpdateValues(value, timestamp);
    }

    // eslint-disable-next-line
  }, [value]);

  const options : ChartOptions = {
    title: { display: false },
    legend: { display: false },
    responsive: true,
    maintainAspectRatio: false
  }

  return (
    <Paper className={classes.paper}>
        <div className={classes.title}>
            {title}
        </div>
        <div className={classes.chart}>
            <Line 
              data={chartData} 
              options={options}
            />
        </div>
    </Paper>  
  );
}

export default LineChartWidget;
