import React from 'react';
import { useAppContext } from '../../context/AppContext';
import './LoadingSpinner.css';

const LoadingSpinner: React.FC = () => {
  const { isLoading } = useAppContext();

  if (!isLoading) {
    return null;
  }

  return (
    <div className="loading-overlay">
      <div className="spinner-container">
        <div className="spinner"></div>
        <p>Carregando...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
