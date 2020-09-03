import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import { API, graphqlOperation } from 'aws-amplify';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { onCreateSensorValue } from '../../graphql/subscriptions';
import { GetSensor } from '../../api/Sensors';
import NumericWidget, { WIDGET_MODE } from '../../components/NumericWidget/NumericWidget';
import LineChartWidget from '../../components/LineChartWidget/LineChartWidget';

const useStyles = makeStyles(() => ({
  dashboardContainer: {
    marginTop:100
  },
  title: {
    marginBottom: 20,
    minHeight:30
  }
}));

interface ISensorSubscriptionResponse {
  value: {
    data: {
      onCreateSensorValue: {
        name: string,
        co: number,
        humidity: number,
        no2: number,
        o3: number,
        pm10: number,
        pm25: number,
        so2: number,
        temperature: number,
        timestamp: string
      }
    }
  }
}

const SensorPage: React.FC = () => {
  
  const classes = useStyles();
  const { id } = useParams();

  const [name, setName] = useState("Fetching sensor data...");
  const [co, setCo] = useState<number | null>(null);
  const [humidity, setHumidity] = useState<number | null>(null);
  const [no2, setNo2] = useState<number | null>(null);
  const [o3, setO3] = useState<number | null>(null);
  const [pm10, setPm10] = useState<number | null>(null);
  const [pm25, setPm25] = useState<number | null>(null);
  const [so2, setSo2] = useState<number | null>(null);
  const [temperature, setTemperature] = useState<number | null>(null);
  const [timestamp, setTimestamp] = useState<string>("");
  const [readyToSubscribe, setReadyToSubscribe] = useState(false);

  //fetch sensor to get name
  useEffect(() => {

    setReadyToSubscribe(false);

    const initSensor = async () => {
      
      console.log('fetching sensor');

      try {

        const response = await GetSensor(id || "");

        if (response) {
          setName(response.name);
          console.log('sensor retrived');
          setReadyToSubscribe(true);
        }
      }
      catch (error) {
        console.log('error fetching sensor', error);
      }
    };

    initSensor()

  }, [id]);

  //subscribe to changes to the sensor's value
  useEffect(() => {  

    if (readyToSubscribe){
    
      console.log('start subscription to sensor');

      const subscriber = API.graphql(graphqlOperation(onCreateSensorValue, {sensorId: id})).subscribe({
        next: (response: ISensorSubscriptionResponse) => {
  
          //update the sensor's status in state
          if (response.value.data.onCreateSensorValue) {
            setCo(response.value.data.onCreateSensorValue.co);
            setHumidity(response.value.data.onCreateSensorValue.humidity);
            setNo2(response.value.data.onCreateSensorValue.no2);
            setO3(response.value.data.onCreateSensorValue.o3);
            setPm10(response.value.data.onCreateSensorValue.pm10);
            setPm25(response.value.data.onCreateSensorValue.pm25);
            setSo2(response.value.data.onCreateSensorValue.so2);
            setTemperature(response.value.data.onCreateSensorValue.temperature);
            setTimestamp(response.value.data.onCreateSensorValue.timestamp);
            console.log('sensor value received');
          }
        },
        error: (error: any) => {
          console.log('error on sensor subscription', error);
        }
      });

      return () => {
        console.log('terminating subscription to sensor');
        subscriber.unsubscribe();
      }
    }
      
  }, [id, readyToSubscribe]);

  return (

    <Container className={classes.dashboardContainer} maxWidth="xl">
      <div className={classes.title}>
        <Typography variant="h5" align="left" >
            {name}
        </Typography>
      </div>

      <Grid container spacing={4}>

        <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
          <NumericWidget
            mode={WIDGET_MODE.CURRENT}
            title="CO (ppm)"
            value={co}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
          <NumericWidget
            mode={WIDGET_MODE.CURRENT}
            title="Humidity (%)"
            value={humidity}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
          <NumericWidget
            mode={WIDGET_MODE.CURRENT}
            title="NO2 (ppm)"
            value={no2}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
          <NumericWidget
            mode={WIDGET_MODE.CURRENT}
            title="O3 (ppm)"
            value={o3}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
          <NumericWidget
            mode={WIDGET_MODE.CURRENT}
            title="PM 10 (μg/m3)"
            value={pm10}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
          <NumericWidget
            mode={WIDGET_MODE.CURRENT}
            title="PM 2.5 (μg/m3)"
            value={pm25}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
          <NumericWidget
            mode={WIDGET_MODE.CURRENT}
            title="SO2 (ppm)"
            value={so2}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
          <NumericWidget
            mode={WIDGET_MODE.CURRENT}
            title="Temperature (°C)"
            value={temperature}
          />
        </Grid>
      </Grid>

      <Grid container spacing={4}>

        <Grid item xs={12}>
            <LineChartWidget
              title="CO (ppm)"
              value={co}
              timestamp={timestamp}
            />
        </Grid>

        <Grid item xs={12}>
          <LineChartWidget
            title="Humidity (%)"
            value={humidity}
            timestamp={timestamp}
          />
        </Grid>

        <Grid item xs={12}>
          <LineChartWidget
            title="NO2 (ppm)"
            value={no2}
            timestamp={timestamp}
          />
        </Grid>

        <Grid item xs={12}>
          <LineChartWidget
            title="O3 (ppm)"
            value={o3}
            timestamp={timestamp}
          />
        </Grid>

        <Grid item xs={12}>
          <LineChartWidget
            title="PM 10 (μg/m3)"
            value={pm10}
            timestamp={timestamp}
          />
        </Grid>

        <Grid item xs={12}>
          <LineChartWidget
            title="PM 2.5 (μg/m3)"
            value={pm25}
            timestamp={timestamp}
          />
        </Grid>

        <Grid item xs={12}>
          <LineChartWidget
            title="SO2 (ppm)"
            value={so2}
            timestamp={timestamp}
          />
        </Grid>

        <Grid item xs={12}>
          <LineChartWidget
            title="Temperature (°C)"
            value={temperature}
            timestamp={timestamp}
          />
        </Grid>

      </Grid>

    </Container>
  );
}

export default SensorPage;
