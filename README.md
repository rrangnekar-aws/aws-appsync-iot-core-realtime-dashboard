# aws-appsync-iot-core-realtime-dashboard

This application demonstrates a web application dashboard receiving real-time updates from a series of IoT sensors. The solution is built with React, AWS AppSync, and AWS IoT Core technologies.

This has been forked from the original project to depict Air Quality sensors (instead of pH sensors) and also use a DynamoDB stream as a source.

![Image description](images/map.jpg)

The sensors are represented as the colored dots.  Their color will fluxuate between red, green, and yellow based on the messages received from the sensors.

Click on a sensor to view the detailed values received in realtime from that specific sensor.

![Image description](images/airquality.png)

## Architecture

![Image description](images/architecture.jpg)

1. The sensor component is developed with the AWS IoT Device SDK for JavaScript.  The sensors are registered as _Things_ in IoT Core and publish random values to the Cloud on a configurable frequency.  Metadata about each sensor, such as its geolocation, is stored in a _Thing Shadow_.

2. Rules in IoT Core subscribe to the message topic and forward the JSON payload to a Lambda function and the IoT Analytics pipeline.

3. The Node.js Lambda function executes a GraphQL mutation in AppSync.  The mutation saves the sensor's value in DynamoDB and broadcasts the value in real-time to the web dashboard. The Lambda function uses an IAM role and policy to obtain permissions to interact with AppSync.

4. The React web dashboard application is written in TypeScript and subscribes to the AppSync sensor subscriptions.  When new values are received, a map is updated in real-time to reflect the new sensor values. The application uses Cognito to authenticate users and allow them to perform the AppSync subscription. 

5. The QuickSight dashboard generates charts and reports for Business Intelligence functions using data from the IoT Analytics timeseries optimized datastore. 

## Getting Started

### **Prerequisites**

1. An AWS account in which you have Administrator access.

2. [Node.js](https://nodejs.org/en/download/) (^10.0) with NPM (^5.2)

3. [Amplify CLI](https://aws-amplify.github.io/docs/) (^4.21.1).

4. A [Mapbox](https://www.mapbox.com/) account with a free *Default Public Access Token*

5. A previously created DynamoDB stream and its ARN.

After you have installed and configured Amplify, take note of the AWS profile you selected during the configuration.  If you created a profile other than **default**, you will need the profile name for later steps in the deployment.

### **Installing**

If you run into issues installing or configuring anything in this project please checkout the [Troubleshooting](#troubleshooting) section below.


**Clone this code repository**

```
$ git clone https://github.com/aws-samples/aws-appsync-iot-core-realtime-dashboard.git
```

**Add your DynamoDB stream ARN**

This project requires a DynamoDB stream ARN which notify the Lambda function to publish data to the dashboard.
Edit the `web/amplify/backend/function/createsensorvalue/createsensorvalue-cloudformation-template.json` and update the 2 Resource fields which need `<YOUR_DDB_STREAM_ARN>`.

**Switch to the project's web folder**

```
$ cd aws-appsync-iot-core-realtime-dashboard/web
```

**Install the web app's Node.js packages**

```
$ npm install
```

**Initialize your Amplify environment**

```
$ amplify init

? Enter a name for the environment: mysandbox
? Choose your default editor: [select your favorite IDE]
? Do you want to use an AWS profile? Yes
? Please choose the profile you want to use: default
```

When you select your profile, make sure to select the same profile you used when configuring Amplify.

Amplify will then begin to provision your account for the project deployment.

Once your account has been provisioned, entering the 'amplify status' command will show you the resources Amplify will create in your account:

```
$ amplify status

Current Environment: mysandbox

| Category     | Resource name        | Operation | Provider plugin   |
| ------------ | -------------------- | --------- | ----------------- |
| Auth         | iotdashboardbce44907 | Create    | awscloudformation |
| Api          | iotdashboard         | Create    | awscloudformation |
| Function     | listsensors          | Create    | awscloudformation |
| Function     | getsensor            | Create    | awscloudformation |
| Function     | createsensorvalue    | Create    | awscloudformation |
| Iotrule      | createsensorvalue    | Create    | awscloudformation |
| Iotanalytics | batch                | Create    | awscloudformation |
```

**Deploy the app infrastructure to your AWS account**

```
$ amplify push

? Do you want to update code for your updated GraphQL API (Y/n) Y

? This will overwrite your current graphql queries, mutations and subscriptions Y
```
You will then see a series of output messages as Amplify builds and deploys the app's CloudFormation Templates, creating the app infrastucture in your AWS account. 

Resources being created in your account include:

- AppSync GraphQL API
- DynamoDB Table
- Cognito User Pool
- Lambda Functions (3)
- IoT Rule
- IoT Analytic


**Configure Mapbox API key**

This application uses maps from [Mapbox](https://www.mapbox.com/) to display the sensor locations.  You must create an account and request a free ***default access token***.  Once you have the token, update the ***src/settings.json*** file with the token value.

***src/settings.json***
```
{
    "mapboxApiAccessToken": "your-token-here"
}
```

**Install the IoT sensor simulator**

Open a new terminal window then switch to the app's **sensor** folder (aws-appsync-iot-core-realtime-dashboard/sensor). 

Install the Node js packages, and run the Node js app to create your sensor as a _Thing_ in AWS IoT Core.  It will also create and install the certificates your sensor needs to authenticate to IoT Core.

From the app's **sensor** folder:

```
$ npm install
$ node create-sensors.js
```

_*Note - this will create the sensor using your default AWS profile account and region.  If you have not specified a default region in your local AWS configuration, it will default to us-east-1._

If you do not have a **default** profile or you are using a profile other than **default**, run the app with an AWS_PROFILE environment variable specifiying the profile name you would like to use.

Replace [my-aws-profile] with the name of your profile:

```
$ AWS_PROFILE=[my-aws-profile] node create-sensor.js
```

## Run the Web App

**Start the IoT Sensor**

From the **sensor** terminal window:

```
$ node index.js
```
You will see output from the app as it connects to IoT Core and publishes new messages for six sensors every few seconds.

```
published to shadow topic $aws/things/sensor-sf-north/shadow/update {"state":{"reported":{"name":"SF Bay - North","enabled":true,"geo":{"latitude":37.800307,"longitude":-122.354788}}}}

published to telemetry topic dt/bay-health/SF/sensor-sf-north/sensor-value {"pH":5,"temperature":54.7,"salinity":25,"disolvedO2":6.1,"timestamp":1591831843844}
```

**Start the web app**

Switch back to the terminal window pointing to the **web** folder and run:

```
$ npm start
```

This will launch the application in your machine's default web browser.

**Sign-up and Sign-in**

The web app requires users to authenticate via Cognito.  The first screen you will see is a logon screen.  Click the **Create account** link and create a new account using your email address.

Cognito will then email you a confirmation code.  Enter this code into the subsequent confirmation screen and logon to the app with your credentials.

**Use the Web App**

You should now see a screen similar to the one at the top of this guide.  If you look at the terminal window running the sensor app, you shoud see the values being published to the Cloud reflected in the web app's sensor gauge in real-time.

From the initial map screen, click on a sensor to navigate to the sensor's detail page.

## Build the QuickSight BI Dashboard

Sensor data has been transmitted to both the real-time dashboard and IoT Analytics.  We will now use IoT Analytics to build a BI dash board using **QuickSight**.

Logon to the AWS Console and navigate to the **IoT Analytics** service and select **Data sets** from the menu.

Select the **bayhealth_app_dataset**


![Image description](images/datasets.jpg)


From the **Actions** menu select **Run now** to refresh the data set.


![Image description](images/datasetrun.jpg)


From the AWS Console navigate to the AWS QuickSight service in the North Virginia region.

If you have not registered for QuickSight in your account follow these instructions to configure the service:

- Enroll for standard edition (if you have not used it before)
- Click on your login user (upper right) -> Manage QuickSight -> Account Settings -> Add and Remove -> Check IoT Analytics -> Apply
- Click on QuickSight logo (upper left) to navigate to home page 
- Change the region to your working region

From the QuickSight menu:

- Select New Analysis -> New data set -> Choose AWS IOT Analytics
- Select an AWS IoT Analytics dataset to import - Choose **bayhealth_app_dataset**
- Click Create data source -> Visualize
- Select items from the **Field List** to visulaize 
    - Choose sensorId for Y axis 
    - Choose all the sensor readings for Value axis
    - Choose average from Value drop down

![Image description](images/quicksight.jpg)

## The Mobile App

![Image description](images/mobile.jpg)

This project also contains a **React Native** mobile application.  In order to run this app you will also need a **Mac** with:

- Xcode (^11.0)
- Xcode iPhone Simulator enabled
- Xcode Command-line Tools
- CocoaPods

**Install the mobile app**

Switch to the project's **mobile** folder:

```
$ cd aws-appsync-iot-core-realtime-dashboard/mobile
```

Install the mobile app's Node.js packages

```
$ npm install
```

Install the mobile app's CocoaPods packages

```
$ cd ios
$ pod install
$ cd ..
```

Pull the Amplify backend environment into the mobile app

```
$ amplify pull

? Do you want to use an AWS profile? (Y/n) Y
? Please choose the profile you want to use: [default]
? Which app are you working on? iotdashboard
? Choose your default editor: [select your favorite IDE]
? Choose the type of app that you're building: javascript
? What javascript framework are you using: react-native
? Source Directory Path:  src
? Distribution Directory Path: dist
? Build Command:  npm run-script build
? Start Command: npm run-script start
? Do you plan on modifying this backend? Yes
```

The mobile app also uses **MapBox** to display a map of the sensors.  Configure the MapBox token for the mobile app by adding your token to the ***src/settings.json*** file in the **mobile** folder:

```
{
    "mapboxApiAccessToken": "your-token-here"
}
```

Start the mobile app in the iOS Simulator

```
$ npm run ios
```

**Use the mobile app**

Logon to the mobile app with the same credentials you created for the web app.

Tap on a sensor in the map to view the real-time readings coming off the sensor.

## Cleanup

Once you are finished working with this project, you may want to delete the resources it created in your AWS account.  

From the **web** folder:

```
$ amplify delete
? Are you sure you want to continue? (This would delete all the environments of the project from the cloud and wipe out all the local amplify resource files) (Y/n)  Y
```

From the **sensor** folder:

```
$ node delete-sensors.js
```

## Troubleshooting

**Installing Amplify**
```
$ npm install -g @aws-amplify/cli
```

If you receive EACCES permisisons errors, make sure your system is setup properly to install global packages.  See this [Guide for options](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally).

## License

This sample code is made available under a modified MIT-0 license. See the LICENSE file.
