import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack> 
      <Stack.Screen
        name="login"
        options={{
          headerShown: true,
          title: 'Đăng Nhập',
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          headerShown: true,
          title: 'Đăng Ký',
        }}
      />
      <Stack.Screen
        name="forgot-password"
        options={{
          headerShown: true,
          title: 'Quên Mật Khẩu',
        }}
      />
    </Stack>
  );
} 