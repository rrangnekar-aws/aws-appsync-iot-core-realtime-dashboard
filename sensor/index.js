const awsIot = require('aws-iot-device-sdk');

//load the sensors file that contains the location of the device certificates and the clientId of the sensor
var sensors = require('./sensors.json');

//constants used in the application
const SHADOW_TOPIC = "$aws/things/[thingName]/shadow/update";
const VALUE_TOPIC = "dt/bay-health/SF/[thingName]/sensor-value"; //topic to which sensor values will be published

//shadow document to be transmitted at statup
var shadowDocument = {
    state: {
        reported: {
            name: "",
            enabled: true,
            geo: {
                latitude: 0,
                longitude: 0
            }
        }
    }
}

async function run(sensor) {

    //initialize the IOT device
    var device = awsIot.device(sensor.settings);

    //create a placeholder for the message
    var msg = {
        co: 0,
        humidity: 0,
        no2: 0,
        o3: 0,
        pm10: 0,
        pm25: 0,
        so2: 0,
        temperature: 0,
        timestamp: new Date().getTime()
    }

    device.on('connect', function() {
    
        console.log('connected to IoT Hub');
    
        //publish the shadow document for the sensor
        var topic = SHADOW_TOPIC.replace('[thingName]', sensor.settings.clientId);
    
        shadowDocument.state.reported.name = sensor.name;
        shadowDocument.state.reported.enabled = true;
        shadowDocument.state.reported.geo.latitude = sensor.geo.latitude;
        shadowDocument.state.reported.geo.longitude = sensor.geo.longitude;
    
        device.publish(topic, JSON.stringify(shadowDocument)); 
    
        console.log('published to shadow topic ' + topic + ' ' + JSON.stringify(shadowDocument));
    
        //publish new value readings based on value_rate
        setInterval(function(){

            //calculate randome values for each sensor reading
            msg.co = RandomValue(10, 20) / 100;
            msg.humidity = RandomValue(700, 800) / 10;
            msg.no2 = RandomValue(15, 19) / 10;
            msg.o3 = RandomValue(80, 90) / 100;
            msg.pm10 = RandomValue(500, 800) / 10;
            msg.pm25 = RandomValue(250, 500) / 10;
            msg.so2 = RandomValue(150, 190) / 100;
            msg.temperature = RandomValue(480, 570) / 10;
            
            msg.timestamp = new Date().getTime();

            //publish the sensor reading message
            var topic = VALUE_TOPIC.replace('[thingName]', sensor.settings.clientId);

            device.publish(topic, JSON.stringify(msg)); 

            console.log('published to telemetry topic ' + topic + ' ' + JSON.stringify(msg));

        }, sensor.frequency);
    });

    device.on('error', function(error) {
        console.log('Error: ', error);
    });
}

function RandomValue (min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

//run simulation for each sensor
sensors.forEach((sensor) => {
    run(sensor);
})
