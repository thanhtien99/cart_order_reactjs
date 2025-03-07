import React, { useState, useEffect } from 'react';
import { View, TextField, Button, Text } from 'react-native-ui-lib';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  // Wait for the router to be ready before navigating
  useEffect(() => {
    if (router.isReady) {
      // Do something when router is ready
    }
  }, [router.isReady]);

  const handleRegister = () => {
    alert('Registration successful');
    if (router.isReady) {
      router.replace('/auth/Login'); // Redirect to Login after successful registration
    }
  };

  return (
    <View flex padding-20>
      <Text text40 center marginB-20>
        Register
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
      <Button label="Register" fullWidth marginT-20 onPress={handleRegister} />
      <Text marginT-20 center>
        Already have an account? <Text link onPress={() => router.push('/auth/Login')}>Login</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    marginBottom: 10,
  },
});

export default Register;
