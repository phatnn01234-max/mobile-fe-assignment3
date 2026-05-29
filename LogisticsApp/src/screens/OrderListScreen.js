// src/screens/OrderListScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, addOrder, deleteOrder, updateOrder } from '../redux/orderSlice';
import { logout } from '../redux/authSlice';
import OrderItem from '../components/OrderItem'; // IMPORT COMPONENT VÀO ĐÂY

const OrderListScreen = () => {
    const dispatch = useDispatch();
    const { items, isLoading, error } = useSelector((state) => state.orders);
    
    // State cho Search và Form thêm đơn hàng
    const [searchKey, setSearchKey] = useState('');
    const [newName, setNewName] = useState('');
    const [newAddress, setNewAddress] = useState('');

    // Lần đầu vào màn hình: Tải danh sách đơn hàng (ViewAll)
    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]); // Thêm dispatch vào dependency array cho chuẩn React hook

    // Hiển thị Alert khi xảy ra lỗi tải danh sách (GET /api/orders)
    useEffect(() => {
        if (error) {
            Alert.alert("Lỗi Hệ Thống", error);
        }
    }, [error]);

    // 1. Thao tác Search
    const handleSearch = () => {
        dispatch(fetchOrders(searchKey));
    };

    // 2. Thao tác Create
    const handleAdd = () => {
        if (!newName || !newAddress) return Alert.alert("Lỗi", "Vui lòng nhập tên và địa chỉ");
        dispatch(addOrder({ customerName: newName, address: newAddress, total: 200000 }))
            .unwrap()
            .then(() => {
                setNewName(''); setNewAddress(''); // Xóa form sau khi thêm thành công
            })
            .catch((err) => {
                Alert.alert("Lỗi Thêm Mới", err);
            });
    };

    // 3. Thao tác Update (Chuyển sang trạng thái Đã giao)
    const handleUpdateStatus = (item) => {
        dispatch(updateOrder({ 
            id: item.id, 
            orderData: { ...item, status: 'Delivered' } 
        }))
            .unwrap()
            .catch((err) => {
                Alert.alert("Lỗi Cập Nhật", err);
            });
    };

    // 4. Thao tác Delete
    const handleDelete = (id) => {
        Alert.alert("Xác nhận", "Bạn có chắc muốn xóa đơn này?", [
            { text: "Hủy", style: "cancel" },
            { text: "Xóa", onPress: () => {
                dispatch(deleteOrder(id))
                    .unwrap()
                    .catch((err) => {
                        Alert.alert("Lỗi Xóa Đơn", err);
                    });
            }, style: 'destructive' }
        ]);
    };

    // Dùng Component OrderItem đã tách
    const renderItem = ({ item }) => (
        <OrderItem 
            item={item} 
            onUpdate={handleUpdateStatus} 
            onDelete={handleDelete} 
        />
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>QUẢN LÝ ĐƠN HÀNG</Text>
                <Button title="Thoát" color="red" onPress={() => dispatch(logout())} />
            </View>

            {/* Khu vực Search */}
            <View style={styles.row}>
                <TextInput 
                    style={[styles.input, { flex: 1 }]} 
                    placeholder="Tìm tên khách..." 
                    value={searchKey}
                    onChangeText={setSearchKey}
                />
                <Button title="Tìm" onPress={handleSearch} />
            </View>

            {/* Khu vực Create */}
            <View style={styles.addForm}>
                <TextInput style={styles.input} placeholder="Tên khách mới" value={newName} onChangeText={setNewName} />
                <TextInput style={styles.input} placeholder="Địa chỉ" value={newAddress} onChangeText={setNewAddress} />
                <Button title="+ Thêm đơn hàng" color="green" onPress={handleAdd} />
            </View>

            {/* Khu vực ViewAll */}
            {isLoading ? (
                <ActivityIndicator size="large" color="blue" />
            ) : (
                <FlatList
                    data={items}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
        </View>
    );
};

// Đã xóa các style của OrderItem đi cho file nhẹ gọn
const styles = StyleSheet.create({
    container: { flex: 1, padding: 15, backgroundColor: '#fff' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, marginTop: 30 },
    title: { fontSize: 20, fontWeight: 'bold' },
    row: { flexDirection: 'row', marginBottom: 15, gap: 10 },
    input: { borderWidth: 1, borderColor: '#ddd', padding: 8, borderRadius: 5, backgroundColor: '#f9f9f9', marginBottom: 10 }, // Thêm marginBottom nhẹ cho input addForm
    addForm: { marginBottom: 20, padding: 10, backgroundColor: '#f0f0f0', borderRadius: 8 },
});

export default OrderListScreen;