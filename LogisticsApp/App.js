// App.js
import React from 'react';
import { Text } from 'react-native';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/redux/store';
import LoginScreen from './src/screens/LoginScreen';
import OrderListScreen from './src/screens/OrderListScreen'; // Import màn hình mới

const RootNavigation = () => {
    const { token } = useSelector((state) => state.auth);

    // Nếu có token thì hiện OrderList, ngược lại hiện Login
    return token ? <OrderListScreen /> : <LoginScreen />;
};

const App = () => {
    return (
        <Provider store={store}>
            <PersistGate loading={<Text>Đang tải dữ liệu...</Text>} persistor={persistor}>
                <RootNavigation />
            </PersistGate>
        </Provider>
    );
};

export default App;