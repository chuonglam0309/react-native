import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  LogBox,
  Platform,
  PermissionsAndroid,Alert
} from 'react-native';

import { BleManager } from 'react-native-ble-plx';
import { NativeEventEmitter, NativeModules } from 'react-native';
import { enableBluetooth,disableBluetooth } from './src/lib/bleManager';
import {atob} from 'react-native-quick-base64';


const manager = new BleManager();



    const serviceUUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b'; // UUID của service cần đọc
    const characteristicUUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8'; // UUID của characteristic cần đọc

LogBox.ignoreAllLogs();//Ignore all log notifications

// layout cho mỗi button trên flatlist
const BLEDevice = ({ device, onPress }) => (
  <TouchableOpacity
    style={{
      marginVertical: 5,
      paddingVertical:8,
      // borderWidth:0.5,
      backgroundColor:'white',
      borderRadius:8,
      marginHorizontal:5,
      alignItems:'center'
    }}
    onPress={onPress}>
    <Text style={{
      fontSize:20,
    }}>{device.name.length === 0 ? 'NULL': device.name} || {device.mac} || {device.rssi} </Text>
  </TouchableOpacity>
);
const App = () => {

  const [deviceSelected, setDeviceSelected]=useState()
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState([]);
  const [weight, setWeight] = useState('');





  const array = [];
  const eventEmitter = new NativeEventEmitter();
  eventEmitter.addListener();

  // gọi lại button của flatlist để truyền sự kiện nút bấm và dữ liệu
  const renderItem = ({ item }) => (
    <BLEDevice device={item} onPress={() => {
      connectToDevice(item)
      setDeviceSelected(item)
    }} />
  );

  useEffect(() => {
    handleAndroidPermissions()
    startScan();
  }, []);


  const handleAndroidPermissions = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 31) {
      try {
        const result = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);

        if (
          result[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] ===
          PermissionsAndroid.RESULTS.GRANTED &&
          result[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] ===
          PermissionsAndroid.RESULTS.GRANTED&&
          result[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
          PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.debug(
            '[handleAndroidPermissions] User accepts runtime permissions android 12+',
          );

        } else {
          console.error(
            '[handleAndroidPermissions] User refuses runtime permissions android 12+',
          );
        }
      } catch (error) {
        console.error('[handleAndroidPermissions]', error);
      }
    }
  };
  const InraDevices = () => {
    console.log(devices.length);
    devices.forEach(d => {
      console.log(d);
    });
  }
  const enableBle  = async () => {
    enableBluetooth();
  }




  const startScan = () => {
    if (!isScanning) {
      console.log('scan');
      manager.startDeviceScan(null, null, handleDiscoverDevice);
      setIsScanning(true);
      setTimeout(() => {
        stopScan()
        console.log('stop');
      }, 7000)
    }
  };





  const stopScan = () => {
    manager.stopDeviceScan();
    setIsScanning(false);
  };




  const handleDiscoverDevice = (error, device) => {
    if (error) {
      console.log('Error scanning devices', error);
      return;
    }




    const { name, rssi, id: mac } = device; // Lấy giá trị name, rssi và id của thiết bị
    // Kiểm tra xem thiết bị đã tồn tại trong mảng devices hay chưa
    const isExist = array.some(d => d.mac === mac);
    // Nếu chưa tồn tại thì thêm mới vào mảng devices
    if (!isExist) {
      array.push({ name: name || '', rssi: rssi || '', mac })
      // console.log('run');
      // setDevices(prevDevices => [...prevDevices, { name: name || '', rssi: rssi || '', mac }]);
    }
    setDevices(array)
    // console.log('scan');

  };
  

  // const connectToDevice = async (device) => {
  //   try {
  //     await manager.connectToDevice(device.mac)
  //     readValue(device)
  //     console.log('Connected to device', device.mac);
     

  //   } catch (error) {
  //     console.log('Error connecting to device', device.mac, error);

  //   }
  // };





// const readValue= async(device) => {
//   device.discoverAllServicesAndCharacteristics()
//   .then((device) => {
//     return device.readCharacteristicForDevice('4fafc201-1b5-459e-8cc-c5c9c331914b', 'beb5483e-36e1-4688-b7f5-ea07361b26a8');
//   })
//   .then((characteristic) => {
//     // Handle read value
//     console.log(characteristic.value);
//   })
//   .catch((error) => {
//    console.log('read', error);
//   });
// }



// const connectToDevice = async(device) => {
//     try {
//       const connectedDevice = await manager.connectToDevice(device.mac)
//       console.log('Connected to device', connectedDevice.name);
//       const services = await connectedDevice.discoverAllServicesAndCharacteristics()
//       const characteristic = await connectedDevice.readCharacteristicForService('4fafc201-1fb5-459e-8fcc-c5c9c331914b', 'beb5483e-36e1-4688-b7f5-ea07361b26a8')
//       const value = await characteristic.read()
//       console.log(value.value);
//       // setData(value);
//     } catch (error) {
//       console.log('Error reading characteristic', error);
//     }
  
// }

// const connectToDevice = async (device) => {
//   try {
//     await manager.connectToDevice(device.mac);
//     console.log('Connected to device', device.mac);
//     const serviceUUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b'; // UUID của service cần đọc
//     const characteristicUUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8'; // UUID của characteristic cần đọc

//     // Lắng nghe sự kiện thay đổi của characteristic
//     manager.monitorCharacteristicForDevice(device.mac, characteristicUUID, 'beb5483e-36e1-4688-b7f5-ea07361b26a8', (error, characteristic) => {
//       if (error) {
//         console.error('Error monitoring characteristic', error);
//         return;
//       }
//       console.log('Received value', characteristic.value);
//     });
//   } catch (error) {
//     console.error('Error connecting to device', device.mac, error);
//   }
// };


const connectToDevice = async (device) => {
  try {
    const deviceConnection = await manager.connectToDevice(device.mac);
    // setConnectedDevice(deviceConnection);
    setDeviceSelected(deviceConnection)
    await deviceConnection.discoverAllServicesAndCharacteristics();
    // bleManager.stopDeviceScan();
    startStreamingData(deviceConnection);
  } catch (e) {
    console.log('FAILED TO CONNECT', e);
  }
};

const startStreamingData = async (device) => {
  if (device) {
    device.monitorCharacteristicForService(
      serviceUUID,
      characteristicUUID,
      (error, characteristic) => {
        const rawData =  atob(characteristic.value);
        // console.log(rawData);
        // console.log(characteristic.value);
        console.log(rawData);
        setWeight(rawData.slice(0,4))
      },
    );
  } else {
    console.log('No Device Connected');
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>BLE DEVICES</Text>
      </View>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        margin:10,


      }}>
        <TouchableOpacity
        style={styles.scanButton}
        onPress={()=>{
          enableBle()
        }}
        >
          <Text
          style={styles.titleButtonScan}
          >Enable Bluetooth</Text>
        </TouchableOpacity>

        <TouchableOpacity
        style={styles.scanButton}
        onPress={()=>{
          deviceSelected.cancelConnection()
        }}
        >
          <Text
          style={styles.titleButtonScan}
          >Disconnect</Text>
        </TouchableOpacity>
       
      </View>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        margin:10,


      }}>
        <TouchableOpacity
          style={styles.scanButton}
          onPress={startScan}
        >
          <Text
          style={styles.titleButtonScan}
          >Start Scan</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.scanButton}
          onPress={stopScan}
        >
          <Text style={styles.titleButtonScan}>Stop Scan </Text>
        </TouchableOpacity>
        
      </View>
      <Text>Weight : {weight}</Text>
        {isScanning ? 
        
        <Text style={{
          textAlign:'center'
        }}>Scanning...</Text>
        
        : 
        <FlatList
        data={devices}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.mac}
      />}
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#F2F2F2'
  },
  header: {
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor:'#FFFFFF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',

  },
  scanButton:{
    backgroundColor:'#2473E1',
    paddingVertical:10,
    borderRadius:8,
    width:'40%',
    alignItems:'center'
  },
  titleButtonScan:{
    color:'white',
    fontSize:15,
  }
});



export default App;
