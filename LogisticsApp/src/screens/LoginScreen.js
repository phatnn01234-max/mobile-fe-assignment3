// src/screens/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/authSlice';

const LoginScreen = () => {
    // Đã điền sẵn tài khoản test để bạn đỡ phải gõ lại nhiều lần
    const [username, setUsername] = useState('shipper');
    const [password, setPassword] = useState('123456');
    
    const dispatch = useDispatch();
    // Lấy trạng thái loading và error từ Redux Store
    const { isLoading, error } = useSelector((state) => state.auth);

    const handleLogin = () => {
        if (!username || !password) {
            Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
            return;
        }
        // Gọi action loginUser thông qua Redux Thunk
        dispatch(loginUser({ username, password }));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>ĐĂNG NHẬP GIAO HÀNG</Text>
            
            <TextInput
                style={styles.input}
                placeholder="Tài khoản"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
            />
            
            <TextInput
                style={styles.input}
                placeholder="Mật khẩu"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            {/* Hiển thị lỗi nếu sai tài khoản */}
            {error && <Text style={styles.errorText}>{error}</Text>}

            {/* Hiển thị vòng quay loading khi đang gọi API */}
            {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <Button title="Đăng nhập" onPress={handleLogin} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5, backgroundColor: '#fff' },
    errorText: { color: 'red', marginBottom: 15, textAlign: 'center' }
});

export default LoginScreen;