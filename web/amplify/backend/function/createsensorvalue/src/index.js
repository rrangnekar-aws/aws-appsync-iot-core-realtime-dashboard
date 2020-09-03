/* Amplify Params - DO NOT EDIT
	API_IOTDASHBOARD_GRAPHQLAPIENDPOINTOUTPUT
	API_IOTDASHBOARD_GRAPHQLAPIIDOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const https = require('https');
const AWS = require('aws-sdk');
const urlParse = require("url").URL;

//environment variables
const region = process.env.REGION
const appsyncUrl = process.env.API_IOTDASHBOARD_GRAPHQLAPIENDPOINTOUTPUT
const endpoint = new urlParse(appsyncUrl).hostname.toString();

function RandomValue (min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function submit_appsync(item){

  const req = new AWS.HttpRequest(appsyncUrl, region);

  //define the graphql mutation to create the sensor values
  const mutationName = 'CreateSensorValue';
  const mutation = require('./mutations').createSensorValue;

  req.method = "POST";
  req.headers.host = endpoint;
  req.headers["Content-Type"] = "application/json";
  req.body = JSON.stringify({
      query: mutation,
      operationName: mutationName,
      variables: item
  });

  const signer = new AWS.Signers.V4(req, "appsync", true);
  signer.addAuthorization(AWS.config.credentials, AWS.util.date.getDate());

  return new Promise((resolve, reject) => {
    const httpRequest = https.request({ ...req, host: endpoint }, (result) => {
        result.on('data', (data) => {
            console.log("data: "+data.toString());
            resolve(JSON.parse(data.toString()));
        });
  });

    httpRequest.write(req.body);
    httpRequest.end();

  });
}


exports.handler = async (event) => {

  //console.log('event received:' + JSON.stringify(event));
  
  var promises = [];
  
  event.Records.forEach(record => {
    //console.log(record.eventID);
    //console.log(record.eventName);
    //console.log('DynamoDB Record: %j', record.dynamodb);
      
    const item = {
      input: {
        sensorId: record.dynamodb.Keys.Device.S,
        co: record.dynamodb.NewImage.co.M.avgValue.N,
        humidity: record.dynamodb.NewImage.humidity.M.avgValue.N,
        no2: record.dynamodb.NewImage.no2.M.avgValue.N,
        o3: record.dynamodb.NewImage.o3.M.avgValue.N,
        pm10: record.dynamodb.NewImage.pm10.M.avgValue.N,
        pm25: record.dynamodb.NewImage.pm25.M.avgValue.N,
        so2: record.dynamodb.NewImage.so2.M.avgValue.N,
        temperature: record.dynamodb.NewImage.temperature.M.avgValue.N,
        status: 1,
        timestamp: Date.parse(record.dynamodb.Keys.EventTime.S)
      }
    };
    
    console.log("DDB item: %j", JSON.stringify(item))
    
    promises.push(submit_appsync(item));
  });

  await Promise.all(promises).then(response => {
    
    console.log("AppSync Publish received: " + JSON.stringify(response))
    })
    .catch(error => console.log(`AppSync Publish Error ${error}`))
  
  return;
}
