import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#121212',
                    borderTopWidth: 0,
                    elevation: 0,
                    height: Platform.OS === 'ios' ? 85 : 60,
                    paddingBottom: Platform.OS === 'ios' ? 30 : 10,
                },
                tabBarActiveTintColor: '#BB86FC',
                tabBarInactiveTintColor: '#666',
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Now',
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? "time" : "time-outline"}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="mess"
                options={{
                    title: 'Mess',
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? "restaurant" : "restaurant-outline"}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
