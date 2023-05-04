import BleManager from 'react-native-ble-manager';

export const enableBluetooth = () => {
  BleManager.enableBluetooth()
    .then(() => {
      console.log('Bluetooth is enabled');
    })
    .catch((error) => {
      console.log('Error enabling Bluetooth:', error);
    });
};

export const disableBluetooth = () => {
  BleManager.disableBluetooth()
    .then(() => {
      console.log('Bluetooth is disabled');
    })
    .catch((error) => {
      console.log('Error disabling Bluetooth:', error);
    });
};