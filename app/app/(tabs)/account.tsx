import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';

export default function AccountScreen() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/auth/Login'); // Điều hướng đến Login nếu chưa đăng nhập
  }, []);

  return (
    <View>
      <Text>Redirecting to Login...</Text>
    </View>
  );
}
