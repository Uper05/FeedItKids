import { Stack } from "expo-router";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Layout() {

  return (
    <SafeAreaProvider>
       <Stack
            screenOptions={{
              // Hide the header for all other routes.
              headerShown: false,
            }}
          >
            
          </Stack>
    </SafeAreaProvider>
  );
}