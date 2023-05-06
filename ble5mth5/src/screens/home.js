import React, { useEffect, useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    FlatList,
    LogBox,

} from 'react-native'
import {atob} from 'react-native-quick-base64';
import { BleManager } from 'react-native-ble-plx';
import { BLEDevice, enableBluetooth } from '../components/bleManager';
import ButtonC from '../components/button'

const manager = new BleManager();



const serviceUUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b'; // UUID của service cần đọc
const characteristicUUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8'; // UUID của characteristic cần đọc

LogBox.ignoreAllLogs();//Ignore all log notifications




function Home(props){
  const [isBLE, setIsBLE] = useState(false)

  useEffect(()=>{
    isBleEnable()
  },[isBLE])

  

  const isBleEnable = async () => {
    const isBleState = await manager.state()
    if (isBleState === 'PoweredOn') {
      setIsBLE(true)
    } else {
      setIsBLE(false)
    }
  }

  const enableBLE = () => {
    enableBluetooth()
      .then(result => {
        setIsBLE(result)
      })
      .catch(error => {
        console.log('Error enabling Bluetooth:', error);
        setIsBLE(false);
      });
  };











  return(
    <View>
      <Text>Home</Text>
      {isBLE ? (
       undefined
      ) : 
      (
        <ButtonC title='Enable Bluetooth' onPress={enableBLE}/>
      )}
      
    </View>
  )
}

export default Home;