import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { signInAnonymously } from 'firebase/auth';
import { collection, getDocs, limit, query } from 'firebase/firestore';

const FirebaseTest = () => {
  const [status, setStatus] = useState('Testing...');
  const [details, setDetails] = useState([]);

  useEffect(() => {
    const testFirebase = async () => {
      const results = [];
      
      try {
        // Test 1: Check if Firebase is initialized
        results.push('✅ Firebase initialized');
        
        // Test 2: Check authentication
        try {
          if (!auth.currentUser) {
            await signInAnonymously(auth);
          }
          results.push(`✅ Authentication successful - User: ${auth.currentUser?.uid || 'None'}`);
        } catch (authError) {
          results.push(`❌ Authentication failed: ${authError.message}`);
        }
        
        // Test 3: Test Firestore connection
        try {
          const testQuery = query(collection(db, '__ping__'), limit(1));
          await getDocs(testQuery);
          results.push('✅ Firestore connection successful');
        } catch (firestoreError) {
          results.push(`❌ Firestore connection failed: ${firestoreError.message}`);
        }
        
        // Test 4: Test sample data availability
        try {
          const response = await fetch('/data.json');
          if (response.ok) {
            results.push('✅ Sample data available');
          } else {
            results.push('❌ Sample data not available');
          }
        } catch (fetchError) {
          results.push(`❌ Sample data fetch failed: ${fetchError.message}`);
        }
        
        setStatus('Tests completed');
      } catch (error) {
        results.push(`❌ General error: ${error.message}`);
        setStatus('Tests failed');
      }
      
      setDetails(results);
    };

    testFirebase();
  }, []);

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '600px', 
      margin: '50px auto',
      background: 'white',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <h2>Firebase Connection Test</h2>
      <p><strong>Status:</strong> {status}</p>
      <div style={{ marginTop: '20px' }}>
        <h3>Test Results:</h3>
        <ul style={{ textAlign: 'left' }}>
          {details.map((detail, index) => (
            <li key={index} style={{ margin: '5px 0' }}>{detail}</li>
          ))}
        </ul>
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
        Run Tests Again
      </button>
    </div>
  );
};

export default FirebaseTest;
