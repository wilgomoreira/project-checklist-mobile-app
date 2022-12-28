import React from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import StackRoutes from "./StackRoutes";
import Feather from 'react-native-vector-icons/Feather'
import { NavigationContainer } from '@react-navigation/native';
import Questions from "../pages/Questions";
import Print from '../pages/Print'


export default function Routes() {
    const Tab = createBottomTabNavigator();

    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    tabBarHideOnKeyboard: true,
                    tabBarShowLabel: false,
                    tabBarActiveTintColor: '#FFF',

                    tabBarStyle: {
                        backgroundColor: "#1B2B42"
                    }
                }}
            >
                <Tab.Screen
                    name='Home'
                    component={StackRoutes}
                    options={{
                        tabBarIcon: ({ color, size }) => {
                            return <Feather name='check-circle' color={color} size={size} />
                        }
                    }}
                />
                <Tab.Screen
                    name='Questions'
                    component={Questions}
                    options={{
                        tabBarIcon: ({ color, size }) => {
                            return <Feather name='list' color={color} size={size} />
                        }
                    }}
                />
                <Tab.Screen
                    name='Print'
                    component={Print}
                    options={{
                        tabBarIcon: ({ color, size }) => {
                            return <Feather name='file-text' color={color} size={size} />
                        }
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    )
}