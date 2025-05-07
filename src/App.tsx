import React from 'react';
import CalculadoraPage from './components/calculadora-page/CalculadoraPage';
import { AppProvider } from './context/AppContext';
import Notifications from './components/notification/Notifications';
import LoadingSpinner from './components/loading-spinner/LoadingSpinner';
import './App.css';

function App() {
  return (
    <AppProvider>
      <div className="App">
        <Notifications />
        <LoadingSpinner />
        <CalculadoraPage />
      </div>
    </AppProvider>
  );
}

export default App;