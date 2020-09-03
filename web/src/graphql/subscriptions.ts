/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateSensorValue = /* GraphQL */ `
  subscription OnCreateSensorValue($sensorId: String!) {
    onCreateSensorValue(sensorId: $sensorId) {
      id
      sensorId
      co
      humidity
      no2
      o3
      pm10
      pm25
      so2
      temperature
      status
      timestamp
      createdAt
      updatedAt
    }
  }
`;
export const onCreateSensorValues = /* GraphQL */ `
  subscription OnCreateSensorValues {
    onCreateSensorValues {
      id
      sensorId
      co
      humidity
      no2
      o3
      pm10
      pm25
      so2
      temperature
      status
      timestamp
      createdAt
      updatedAt
    }
  }
`;
