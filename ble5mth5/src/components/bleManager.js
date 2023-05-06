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
import BleManager from 'react-native-ble-manager';





export const enableBluetooth = async () => {
    try {
      await BleManager.enableBluetooth();
      return true;
    } catch (error) {
      console.log('Error enabling Bluetooth:', error);
      return false;
    }
  };
  

  export const BLEDevice = ({ device, onPress }) => (
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