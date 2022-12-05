import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from '../pages/Home';
import Camera from '../Components/Camera'

export default function Routes() {
    const Stack = createNativeStackNavigator();

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name='Home' component={Home}
                    options={{
                        title: 'Tela Inicio',
                        headerShown: false
                    }}
                />
                <Stack.Screen
                    name='Camera' component={Camera}
                    options={{
                        title: 'Back',
                        headerShown: true
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}