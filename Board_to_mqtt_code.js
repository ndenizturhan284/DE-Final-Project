var mqtt    = require('mqtt');
//var client  = mqtt.connect("mqtt://test.mosquitto.org", {clientId:"raspberrypi"});
//var client  = mqtt.connect("mqtt://mqtt.eclipse.org", {clientId:"raspberrypi"});
var client  = mqtt.connect("mqtt://mqtt.eclipse.org", {clientId:"raspberrypi", 
username:"Kobe",
password:"test11",
clean:true});

var ThunderboardReact = require('node-thunderboard-react');
var thunder = new ThunderboardReact();

client.on('connect', function () {
  client.subscribe('Humidity')
  client.subscribe('Temperature')
  client.subscribe('UV Index')
  client.subscribe('Pressure')
  client.subscribe('Light')
  client.subscribe('Sound')
 }) 
 
client.on('message', function (topic, message) {
  console.log(topic, message.toString())
})

thunder.init((error) => {
  thunder.startDiscovery((device) => {
    console.log('- Found ' + device.localName);
    thunder.stopDiscovery();
    device.connect((error) => {
      console.log('- Connected ' + device.localName);
      getEnvironmentalSensing(device);
    });
  });
});



function getEnvironmentalSensing(device) {
  device.getEnvironmentalSensing((error, res) => {
    client.publish('Humidity', res.humidity.toString())
    client.publish('Temperature', res.temperature.toString())
    client.publish('UV Index', res.uvIndex.toString())
    client.publish('Pressure', res.pressure.toString())
    client.publish('Light', res.light.toString())
    client.publish('Sound', res.sound.toString())
	  
    
    setTimeout(() => {
      getEnvironmentalSensing(device);
    }, 2000);
  });
}
