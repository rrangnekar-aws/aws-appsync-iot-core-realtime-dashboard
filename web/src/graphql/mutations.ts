/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createSensorValue = /* GraphQL */ `
  mutation CreateSensorValue(
    $input: CreateSensorValueInput!
    $condition: ModelSensorValueConditionInput
  ) {
    createSensorValue(input: $input, condition: $condition) {
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
export const updateSensorValue = /* GraphQL */ `
  mutation UpdateSensorValue(
    $input: UpdateSensorValueInput!
    $condition: ModelSensorValueConditionInput
  ) {
    updateSensorValue(input: $input, condition: $condition) {
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
export const deleteSensorValue = /* GraphQL */ `
  mutation DeleteSensorValue(
    $input: DeleteSensorValueInput!
    $condition: ModelSensorValueConditionInput
  ) {
    deleteSensorValue(input: $input, condition: $condition) {
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
