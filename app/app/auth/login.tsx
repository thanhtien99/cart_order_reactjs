import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useAuth } from '../../context/authContext';
import { login } from '@/services/account';

function Login() {
  const [user, setUser] = useState<{ email: string; password: string }>({
    email: '',
    password: '',
  });

  const authContext = useAuth();
  const router = useRouter();

  const onChange = (key: 'email' | 'password', value: string) => {
    setUser((prev) => ({ ...prev, [key]: value }));
  };

  const handleLogin = async () => {
    try {
      const data = await login(user);
      const { isAuthenticated, user: loggedInUser, message } = data;

      if (isAuthenticated) {
        authContext.setUser(loggedInUser);
        authContext.setIsAuthenticated(isAuthenticated);
        router.push('/(tabs)/account');
      } else {
        Alert.alert('Login Error', message.msgBody, [{ text: 'OK' }]);
      }
    } catch (error) {
      Alert.alert('An error occurred, please try again.');
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Image
            source={require('../../assets/shopee-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Đăng Nhập</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={user.email}
              onChangeText={(text) => onChange('email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="Mật khẩu"
              value={user.password}
              onChangeText={(text) => onChange('password', text)}
              secureTextEntry
            />

            <TouchableOpacity onPress={() => router.push('/auth/forgot_password')}>
              <Text style={styles.forgotPassword}>Quên mật khẩu</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Đăng nhập</Text>
          </TouchableOpacity>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Bạn chưa có tài khoản? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/signup')}>
              <Text style={styles.signupLink}>Đăng ký</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  logo: {
    width: 175,
    height: 125,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
    alignSelf: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    marginBottom: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
  },
  forgotPassword: {
    color: '#666',
    fontSize: 14,
    textAlign: 'right',
    marginTop: -8,
    marginBottom: 24,
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#ff4500',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  signupText: {
    color: '#666',
    fontSize: 14,
  },
  signupLink: {
    color: '#ff4500',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default Login;
