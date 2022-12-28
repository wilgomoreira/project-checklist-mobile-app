import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from '../pages/Home';
import Camera from '../Components/Camera'

export default function StackRoutes() {
    const Stack = createNativeStackNavigator();

    return (
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
    );
}