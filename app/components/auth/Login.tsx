import React, { useState } from 'react';
import { View, TextField, Button, Text } from 'react-native-ui-lib';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();  // Sử dụng expo-router thay vì @react-navigation

  const handleLogin = () => {
    // Giả lập đăng nhập thành công
    if (email === 'user@example.com' && password === 'password') {
      router.replace('/(tabs)/index');  // Điều hướng đến Home sau khi login
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <View flex padding-20>
      <Text text40 center marginB-20>
        Login
      </Text>
      <TextField
        floatingPlaceholder
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <TextField
        floatingPlaceholder
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button label="Login" fullWidth marginT-20 onPress={handleLogin} />
      <Text marginT-20 center>
        Don't have an account? <Text link onPress={() => router.push('/auth/Register')}>Register</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    marginBottom: 10,
  },
});

export default Login;
