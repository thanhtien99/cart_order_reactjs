import React from 'react';
import { Platform, Text } from 'react-native';
import { Tabs } from 'expo-router';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useRouter } from 'expo-router';
import { Button } from 'react-native-ui-lib';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          // ios: {
          //   position: 'absolute',
          //   height: 70, // Tăng chiều cao tab bar để có thêm không gian
          //   paddingTop: 10, // Thêm khoảng cách trên
          // },
          default: {
            height: 70,
            paddingTop: 10,
          },
        }),
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={30} name="house.fill" color={color} /> // Tăng kích thước icon
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={30} name="person.fill" color={color} /> // Tăng kích thước icon
          ),
        }}
      />
    </Tabs>
  );
}
