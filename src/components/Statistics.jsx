import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import ClipLoader from 'react-spinners/ClipLoader';
import styles from '../styles/Statistics.module.css';
import { useLoading } from '../LoadingContext';

// Register all necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Statistics = () => {
  const [waitingChartType, setWaitingChartType] = useState('bar');
  const [serviceChartType, setServiceChartType] = useState('bar');
  const [patientsOverTimeChartType, setPatientsOverTimeChartType] = useState('line');

  const [chartData, setChartData] = useState(null);
  const [averageWaitingTime, setAverageWaitingTime] = useState(0);
  const [averageServiceTime, setAverageServiceTime] = useState(0);
  const { startLoading, stopLoading } = useLoading();
  const [loading, setLoading] = useState(true);

  const generateColors = (count) =>
    Array.from({ length: count }, () =>
      `rgba(${Math.floor(Math.random() * 255)}, 
             ${Math.floor(Math.random() * 255)}, 
             ${Math.floor(Math.random() * 255)}, 0.7)`
    );

  const fetchStatistics = async () => {
    startLoading();
    setLoading(true);
    try {
      const response = await axios.get('https://simulation-backend.vercel.app/patients');
      const patients = response.data;

      const waitingTimes = patients.map((p) =>
        p.serviceStartTime
          ? (new Date(p.serviceStartTime) - new Date(p.arrivalTime)) / 60000
          : 0
      );

      const serviceTimes = patients.map((p) =>
        p.serviceEndTime && p.serviceStartTime
          ? (new Date(p.serviceEndTime) - new Date(p.serviceStartTime)) / 60000
          : 0
      );

      const averageWT = (
        waitingTimes.reduce((acc, time) => acc + time, 0) / waitingTimes.length
      ).toFixed(2);

      const averageST = (
        serviceTimes.reduce((acc, time) => acc + time, 0) / serviceTimes.length
      ).toFixed(2);

      setAverageWaitingTime(averageWT);
      setAverageServiceTime(averageST);

      const colors = generateColors(patients.length);

      setChartData({
        waitingTimes: {
          labels: patients.map((p) => `Patient ${p.id}`),
          datasets: [
            {
              label: 'Waiting Time (Minutes)',
              data: waitingTimes,
              backgroundColor: colors,
            },
          ],
        },
        serviceTimes: {
          labels: patients.map((p) => `Patient ${p.id}`),
          datasets: [
            {
              label: 'Service Time (Minutes)',
              data: serviceTimes,
              backgroundColor: colors,
            },
          ],
        },
        patientsOverTime: {
          labels: Object.keys(
            patients.reduce((acc, p) => {
              if (p.serviceEndTime) {
                const date = new Date(p.serviceEndTime).toLocaleDateString();
                acc[date] = (acc[date] || 0) + 1;
              }
              return acc;
            }, {})
          ),
          datasets: [
            {
              label: 'Patients Served',
              data: Object.values(
                patients.reduce((acc, p) => {
                  if (p.serviceEndTime) {
                    const date = new Date(p.serviceEndTime).toLocaleDateString();
                    acc[date] = (acc[date] || 0) + 1;
                  }
                  return acc;
                }, {})
              ),
              backgroundColor: colors,
            },
          ],
        },
      });
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
      stopLoading();
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  const renderChart = (type, data) => {
    switch (type) {
      case 'line':
        return <Line data={data} className={styles.chart} />;
      case 'pie':
        return (
          <div className={styles.pieChartContainer}>
            <Pie data={data} />
          </div>
        );
      default:
        return <Bar data={data} className={styles.chart} />;
    }
  };

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <ClipLoader size={50} color="#3498db" />
      </div>
    );
  }

  return (
    <div className={styles.statisticsContainer}>
      <h2>Patient Statistics</h2>

      <div className={styles.averages}>
        <div>
          <h3>Average Waiting Time</h3>
          <p>{averageWaitingTime} minutes</p>
        </div>
        <div>
          <h3>Average Service Time</h3>
          <p>{averageServiceTime} minutes</p>
        </div>
      </div>

      <div className={styles.chartContainer}>
        <h3>Waiting Time Per Patient</h3>
        <div className={styles.chartTypeSelector}>
          <button onClick={() => setWaitingChartType('bar')}>Bar</button>
          <button onClick={() => setWaitingChartType('line')}>Line</button>
          <button onClick={() => setWaitingChartType('pie')}>Pie</button>
        </div>
        {renderChart(waitingChartType, chartData.waitingTimes)}
      </div>

      <div className={styles.chartContainer}>
        <h3>Service Time Per Patient</h3>
        <div className={styles.chartTypeSelector}>
          <button onClick={() => setServiceChartType('bar')}>Bar</button>
          <button onClick={() => setServiceChartType('line')}>Line</button>
          <button onClick={() => setServiceChartType('pie')}>Pie</button>
        </div>
        {renderChart(serviceChartType, chartData.serviceTimes)}
      </div>

      <div className={styles.chartContainer}>
        <h3>Patients Served Over Time</h3>
        <div className={styles.chartTypeSelector}>
          <button onClick={() => setPatientsOverTimeChartType('bar')}>Bar</button>
          <button onClick={() => setPatientsOverTimeChartType('line')}>Line</button>
          <button onClick={() => setPatientsOverTimeChartType('pie')}>Pie</button>
        </div>
        {renderChart(patientsOverTimeChartType, chartData.patientsOverTime)}
      </div>
    </div>
  );
};

export default Statistics;
