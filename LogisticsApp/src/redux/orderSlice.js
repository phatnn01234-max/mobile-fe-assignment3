// src/redux/orderSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Đường dẫn chọc thẳng vào API Gateway
const API_URL = 'http://10.106.45.206:8000/api/orders';

// 1. VIEW ALL & SEARCH: Lấy danh sách đơn hàng
export const fetchOrders = createAsyncThunk(
    'orders/fetchOrders',
    async (keyword, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token; // Lấy token từ authSlice
            const url = keyword ? `${API_URL}/search?keyword=${keyword}` : API_URL;
            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data; // Trả về mảng đơn hàng
        } catch (error) {
            return rejectWithValue('Lỗi tải danh sách đơn hàng');
        }
    }
);

// 2. CREATE: Thêm đơn hàng
export const addOrder = createAsyncThunk(
    'orders/addOrder',
    async (orderData, { getState, rejectWithValue, dispatch }) => {
        try {
            const token = getState().auth.token;
            await axios.post(API_URL, orderData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            dispatch(fetchOrders()); // Thêm xong thì tự động gọi API tải lại danh sách
            return true;
        } catch (error) {
            return rejectWithValue('Lỗi thêm đơn hàng');
        }
    }
);

// 3. DELETE: Xóa đơn hàng
export const deleteOrder = createAsyncThunk(
    'orders/deleteOrder',
    async (id, { getState, rejectWithValue, dispatch }) => {
        try {
            const token = getState().auth.token;
            await axios.delete(`${API_URL}/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            dispatch(fetchOrders()); // Xóa xong tải lại danh sách
            return true;
        } catch (error) {
            return rejectWithValue('Lỗi xóa đơn hàng');
        }
    }
);

// 4. UPDATE: Cập nhật trạng thái
export const updateOrder = createAsyncThunk(
    'orders/updateOrder',
    async ({ id, orderData }, { getState, rejectWithValue, dispatch }) => {
        try {
            const token = getState().auth.token;
            await axios.put(`${API_URL}/${id}`, orderData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            dispatch(fetchOrders()); // Sửa xong tải lại danh sách
            return true;
        } catch (error) {
            return rejectWithValue('Lỗi cập nhật đơn hàng');
        }
    }
);

const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        items: [],
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Chỉ cần xử lý state cho fetchOrders, các hành động khác đã có dispatch(fetchOrders()) lo
            .addCase(fetchOrders.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload; // Lưu mảng dữ liệu vào state
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export default orderSlice.reducer;