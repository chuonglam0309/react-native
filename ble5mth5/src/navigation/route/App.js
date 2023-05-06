import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View, Button } from 'react-native';
import { createNativeStackNavigator} from '@react-navigation/native-stack';
import { NavigationContainer} from '@react-navigation/native';
import Home from '../../screens/home';
import Po from '../../screens/createPO';

const Stack = createNativeStackNavigator();
export default function App() {



    return(
       <NavigationContainer>
        <Stack.Navigator
            screenOptions={{
                headerShown: false,               
            }}
        >
            <Stack.Screen name='home' component={Home}/>
            <Stack.Screen name='po' component={Po}/>
        </Stack.Navigator>
       </NavigationContainer>     
    )
}