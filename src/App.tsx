import React from 'react';
import Calculadora from './components/Calculadora';
import { AppProvider } from './context/AppContext';
import Notifications from './components/Notifications/Notifications';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import './App.css';

function App() {
  return (
    <AppProvider>
      <div className="App">
        <Notifications />
        <LoadingSpinner />
        <Calculadora />
      </div>
    </AppProvider>
  );
}

export default App;