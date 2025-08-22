import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { fetchDashboardData } from './firebase';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Clients from './pages/Clients';
import Batches from './pages/Batches';
import Assignments from './pages/Assignments';
import Assessments from './pages/Assessments';
import Questions from './pages/Questions';
import UserDetail from './pages/UserDetail';
import FirebaseTest from './components/FirebaseTest';
import './styles.css';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClientId, setSelectedClientId] = useState('all');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Starting to load dashboard data...');
        const result = await fetchDashboardData();
        console.log('Dashboard data loaded successfully:', result);
        setData(result.data.__collections__);
      } catch (err) {
        console.error('Failed to load data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
          Error loading data
        </div>
        <div style={{ marginBottom: '15px' }}>{error}</div>
        <div style={{ fontSize: '14px', color: '#666' }}>
          <p>This could be due to:</p>
          <ul style={{ textAlign: 'left', maxWidth: '500px', margin: '10px auto' }}>
            <li>Firebase connection issues</li>
            <li>Authentication problems</li>
            <li>Firestore rules restrictions</li>
            <li>Network connectivity issues</li>
          </ul>
          <p>Check the browser console for more details.</p>
          <p>You can also visit <a href="/test" style={{ color: '#4f7cff' }}>/test</a> to run Firebase diagnostics.</p>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          style={{
            padding: '10px 20px',
            background: '#4f7cff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            marginTop: '15px'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Header 
          selectedClientId={selectedClientId} 
          onClientChange={setSelectedClientId}
          clients={data?.clients || {}}
        />
        <div className="layout">
          <Sidebar />
          <main className="content">
            <Routes>
              <Route 
                path="/" 
                element={
                  <Dashboard 
                    data={data} 
                    selectedClientId={selectedClientId}
                  />
                } 
              />
              <Route 
                path="/users" 
                element={
                  <Users 
                    data={data} 
                    selectedClientId={selectedClientId}
                  />
                } 
              />
              <Route 
                path="/clients" 
                element={
                  <Clients 
                    data={data} 
                    selectedClientId={selectedClientId}
                  />
                } 
              />
              <Route 
                path="/batches" 
                element={
                  <Batches 
                    data={data} 
                    selectedClientId={selectedClientId}
                  />
                } 
              />
              <Route 
                path="/assignments" 
                element={
                  <Assignments 
                    data={data} 
                    selectedClientId={selectedClientId}
                  />
                } 
              />
              <Route 
                path="/assessments" 
                element={
                  <Assessments 
                    data={data} 
                    selectedClientId={selectedClientId}
                  />
                } 
              />
              <Route 
                path="/questions" 
                element={
                  <Questions 
                    data={data} 
                    selectedClientId={selectedClientId}
                  />
                } 
              />
              <Route 
                path="/user/:userId" 
                element={
                  <UserDetail 
                    data={data} 
                    selectedClientId={selectedClientId}
                  />
                } 
              />
              <Route 
                path="/test" 
                element={<FirebaseTest />} 
              />
            </Routes>
          </main>
        </div>
        <footer className="app-footer">
          © {new Date().getFullYear()} One Wiseman
        </footer>
      </div>
    </Router>
  );
}

export default App;
