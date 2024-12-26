import { Provider } from 'react-redux';
import store from './redux/store';
import MainApp from './MainApp';
import { BrowserRouter as Router } from 'react-router-dom';
import React from 'react';
import { UserProvider } from './hooks/user/userProvider';

function App() {
    return (
        <Provider store={store}>
            <UserProvider>
                <Router>
                    <MainApp />
                </Router>
            </UserProvider>
        </Provider>
    );
}

export default App;
