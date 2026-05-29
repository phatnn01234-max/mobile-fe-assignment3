// src/redux/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thay bằng IP mạng LAN của máy bạn (Vẫn giữ nguyên cổng 8000 của Gateway)
const API_URL = 'http://10.106.45.206:8000'; 

// 1. Dùng thunk để xử lý gọi API Login bất đồng bộ
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/login`, credentials);
            // Trả về token và thông báo nếu thành công
            return response.data; 
        } catch (error) {
            // Log lỗi chi tiết ra console
            console.error(`[API Error] POST /login thất bại:`, {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            // Trả về lỗi nếu sai mật khẩu hoặc lỗi mạng
            return rejectWithValue(error.response?.data?.message || 'Lỗi kết nối đến server');
        }
    }
);

// 2. Khởi tạo State ban đầu
const initialState = {
    token: null,
    isLoading: false,
    error: null,
};

// 3. Tạo Slice quản lý trạng thái
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Hàm đăng xuất (xóa token)
        logout: (state) => {
            state.token = null;
            state.error = null;
        },
    },
    // Xử lý các trạng thái của Thunk (Pending, Fulfilled, Rejected)
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.token = action.payload.token; // Lưu token vào Redux
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload; // Lưu thông báo lỗi để hiện lên UI
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;