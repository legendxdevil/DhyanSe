import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TaskProvider } from './context/TaskContext';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TaskProvider>
        <SafeAreaProvider>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: '#4f46e5', // Indigo-600
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              contentStyle: {
                backgroundColor: '#290025', // Zinc-50
              },
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="tasks" />
            <Stack.Screen name="focus" />
          </Stack>
        </SafeAreaProvider>
      </TaskProvider>
    </GestureHandlerRootView>
  );
}
