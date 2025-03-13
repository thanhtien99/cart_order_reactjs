import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { register } from '@/services/account';

function SignUp() {
  const [user, setUser] = useState({
    email: "",
    username: "",
    phone: "",
    address: "",
    password: "",
    passwordConfig: ""
  });

  const router = useRouter();

  const onChange = (key: keyof typeof user, value: string) => {
    setUser((prev) => ({ ...prev, [key]: value }));
  };

  const handleSignUp = async () => {
    // Validation check for matching passwords
    if (user.password !== user.passwordConfig) {
      Alert.alert("Passwords do not match.");
      return;
    }

    const requestData = {
      email: user.email,
      username: user.username,
      password: user.password,
      phone: user.phone,
      address: user.address
    };

    try {
      // Call api
      const data = await register(requestData);
      const { message } = data;

      if (message.msgError) {
          Alert.alert('Sign Up Error', message.msgBody, [{ text: 'OK' }]);
      } else{
          // Show success alert
          Alert.alert('Success', message.msgBody);
        
          setTimeout(() => {
            router.replace('/components/auth/login');
          }, 1000);
      }
    } catch (error) {
      Alert.alert('Sign Up Error', 'An error occurred, please try again.', [{ text: 'OK' }]);
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Image
            source={require('../../../assets/shopee-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.title}>Đăng Ký</Text>

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
              placeholder="Tên người dùng"
              value={user.username}
              onChangeText={(text) => onChange('username', text)}
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="Số điện thoại"
              value={user.phone}
              onChangeText={(text) => onChange('phone', text)}
              keyboardType="numeric"
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="Địa chỉ"
              value={user.address}
              onChangeText={(text) => onChange('address', text)}
              autoCapitalize="none"
            />    
            
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu"
              value={user.password}
              onChangeText={(text) => onChange('password', text)}
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              placeholder="Nhập lại mật khẩu"
              value={user.passwordConfig}
              onChangeText={(text) => onChange('passwordConfig', text)}
              secureTextEntry
            />

          </View>

          <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
            <Text style={styles.signUpButtonText}>Đăng ký</Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Bạn đã có tài khoản? </Text>
            <TouchableOpacity onPress={() => router.replace('/components/auth/login')}>
              <Text style={styles.loginLink}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>
          </View>
      </SafeAreaView>
    </>
  );
}


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
  signUpButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#ff4500',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  loginText: {
    color: '#666',
    fontSize: 14,
  },
  loginLink: {
    color: '#ff4500',
    fontSize: 14,
    fontWeight: '600',
  },
}); 

export default SignUp;