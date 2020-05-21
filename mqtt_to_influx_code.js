var ThunderboardReact = require('node-thunderboard-react');
var thunder = new ThunderboardReact(); 

const {InfluxDB, Point, ClientOptions} = require('@influxdata/influxdb-client')
const username = 'telegraf_1'
const password = 'perfection'

const database = 'telegraf_1'
const retentionPolicy = 'autogen'

const bucket = `${database}/${retentionPolicy}`

const clientOptions = {
  url: 'http://localhost:8086',
  token: `${username}:${password}`,
}

const influxDB = new InfluxDB(clientOptions)

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


const writeAPI = influxDB.getWriteApi('', bucket)
function getEnvironmentalSensing(device) {
  device.getEnvironmentalSensing((error, res) => {
    const Sound = new Point('Sound')
    .tag('host', 'host1')
    .floatField('used_percent', res.sound)
	  writeAPI.writePoint(Sound)
    
    const Humidity = new Point('Humidity')
    .tag('host', 'host1')
    .floatField('used_percent', res.humidity)
	  writeAPI.writePoint(Humidity)
    
    const Temp = new Point('Temp')
    .tag('host', 'host1')
    .floatField('used_percent', res.temperature)
	  writeAPI.writePoint(Temp)
    
    const Light = new Point('Light')
    .tag('host', 'host1')
    .floatField('used_percent', res.light)
	  writeAPI.writePoint(Light)
    
    console.log(res.sound)
    setTimeout(() => {
      getEnvironmentalSensing(device);
    }, 2000);
  });
}
