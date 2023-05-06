
import React from 'react';
import { TouchableOpacity, Image, StyleSheet,Text } from 'react-native';

const ButtonC = ({ title,onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.titleButton}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor:'#2473E1',
    paddingVertical:10,
    borderRadius:8,
    width:'40%',
    alignItems:'center',
    marginVertical:10,
  },
  titleButton:{
    color:'white',
    fontSize:15,
  }
});

export default ButtonC;
