import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PatientTable from './components/PatientTable';
import Statistics from './components/Statistics';
import Header from './components/Header';
import { LoadingProvider, useLoading } from './LoadingContext';
import ClipLoader from 'react-spinners/ClipLoader';
import styles from './styles/App.module.css';

const AppContent = () => {
  const { loading } = useLoading();

  return (
    <div className={styles.appContainer}>
      <Header />
      {loading && (
        <div className={styles.loaderContainer}>
          <ClipLoader size={50} color="#3498db" />
        </div>
      )}
      <Routes>
        <Route path="/" element={<PatientTable />} />
        <Route path="/statistics" element={<Statistics />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <LoadingProvider>
      <AppContent />
  </LoadingProvider>
);

export default App;
