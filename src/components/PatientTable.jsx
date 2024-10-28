import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import styles from '../styles/PatientTable.module.css';
import { useLoading } from '../LoadingContext';

const PatientTable = () => {
  const [patients, setPatients] = useState([]);
  const { startLoading, stopLoading } = useLoading();
  const [adding, setAdding] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(null);

  const fetchPatients = async () => {
    startLoading();
    try {
      const response = await axios.get('https://simulation-backend.vercel.app/patients');
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const addPatient = async () => {
    setAdding(true);
    try {
      await axios.post('https://simulation-backend.vercel.app/patients');
      await fetchPatients();
    } catch (error) {
      console.error('Error adding patient:', error);
    } finally {
      setAdding(false);
    }
  };

  const startService = async (id) => {
    setButtonLoading(id);
    try {
      await axios.post(`https://simulation-backend.vercel.app/patients/${id}/start`);
      await fetchPatients();
    } catch (error) {
      console.error('Error starting service:', error);
    } finally {
      setButtonLoading(null);
    }
  };

  const endService = async (id) => {
    setButtonLoading(id);
    try {
      await axios.post(`https://simulation-backend.vercel.app/patients/${id}/end`);
      await fetchPatients();
    } catch (error) {
      console.error('Error ending service:', error);
    } finally {
      setButtonLoading(null);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Patient List</h2>
      <button onClick={addPatient} className={styles.addButton} disabled={adding}>
        {adding ? <ClipLoader size={15} color="#fff" /> : 'Add New Patient'}
      </button>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Arrival Time</th>
              <th>Service Start</th>
              <th>Service End</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.id}</td>
                <td>{new Date(patient.arrivalTime).toLocaleString()}</td>
                <td>{patient.serviceStartTime ? new Date(patient.serviceStartTime).toLocaleString() : '-'}</td>
                <td>{patient.serviceEndTime ? new Date(patient.serviceEndTime).toLocaleString() : '-'}</td>
                <td>
                  {!patient.serviceStartTime && (
                    <button
                      onClick={() => startService(patient.id)}
                      className={styles.startButton}
                      disabled={buttonLoading === patient.id}
                    >
                      {buttonLoading === patient.id ? <ClipLoader size={15} color="#fff" /> : 'Start'}
                    </button>
                  )}
                  {patient.serviceStartTime && !patient.serviceEndTime && (
                    <button
                      onClick={() => endService(patient.id)}
                      className={styles.endButton}
                      disabled={buttonLoading === patient.id}
                    >
                      {buttonLoading === patient.id ? <ClipLoader size={15} color="#fff" /> : 'End'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientTable;
