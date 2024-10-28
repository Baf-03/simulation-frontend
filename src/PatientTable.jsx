import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PatientTable = () => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    axios.get('https://simulation-backend.vercel.app/patients').then((response) => {
      setPatients(response.data);
    });
  }, []);

  const startService = (id) => {
    axios.post(`https://simulation-backend.vercel.app/patients/${id}/start`).then(() => {
      window.location.reload();
    });
  };

  const endService = (id) => {
    axios.post(`https://simulation-backend.vercel.app/patients/${id}/end`).then(() => {
      window.location.reload();
    });
  };

  return (
    <table>
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
              <button onClick={() => startService(patient.id)}>Start</button>
              <button onClick={() => endService(patient.id)}>End</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PatientTable;
