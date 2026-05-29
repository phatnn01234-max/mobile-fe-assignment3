// src/components/OrderItem.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const OrderItem = ({ item, onUpdate, onDelete }) => {
    return (
        <View style={styles.orderCard}>
            <View style={{ flex: 1 }}>
                <Text style={styles.customerName}>📦 {item.customerName}</Text>
                <Text>📍 {item.address}</Text>
                <Text style={{ color: item.status === 'Pending' ? 'orange' : 'green' }}>
                    Trạng thái: {item.status}
                </Text>
                <Text style={styles.total}>Tổng: {item.total} VNĐ</Text>
            </View>
            <View style={styles.actionButtons}>
                <TouchableOpacity onPress={() => onUpdate(item)} style={styles.btnUpdate}>
                    <Text style={{ color: '#fff' }}>Giao</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.btnDelete}>
                    <Text style={{ color: '#fff' }}>Xóa</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    orderCard: { flexDirection: 'row', padding: 15, marginBottom: 10, borderRadius: 10, backgroundColor: '#fff', elevation: 3, borderLeftWidth: 5, borderLeftColor: '#2196F3' },
    customerName: { fontSize: 16, fontWeight: 'bold' },
    total: { fontWeight: 'bold', marginTop: 5 },
    actionButtons: { justifyContent: 'space-around', gap: 10 },
    btnUpdate: { backgroundColor: 'green', padding: 8, borderRadius: 5 },
    btnDelete: { backgroundColor: 'red', padding: 8, borderRadius: 5 },
});

export default OrderItem;