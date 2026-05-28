import React from 'react';
import Layout from '../components/Layout'; 
import './Dashboard.css';

const Dashboard = () => {
  // Dummy Data for Recent Transactions Table
  const txData = [
    { id: 1, pnr: 'X8F92A', name: 'Rahul Sharma', type: 'Booking', status: 'Confirmed' },
    { id: 2, pnr: 'P2M45K', name: 'Anita Desai', type: 'Refund', status: 'Pending' },
    { id: 3, pnr: 'L9J88T', name: 'Vikas Singh', type: 'Exchange', status: 'Processing' },
    { id: 4, pnr: 'Q1W2E3', name: 'Pooja Patel', type: 'Booking', status: 'Failed' },
    { id: 5, pnr: 'Z5X6C7', name: 'Amit Kumar', type: 'Booking', status: 'Confirmed' },
  ];

  return (
    <Layout>
      <div className="dashboard-glass-wrapper">
        
        {/* Top Header */}
        <div className="dash-header">
          <h2>Welcome back, Agent!</h2>
          <p>Here is your daily overview. Let's manage those flights.</p>
        </div>

        {/* 4 KPI CARDS (Glass Effect) */}
        <div className="glass-kpi-grid">
          <div className="glass-card">
            <span className="kpi-icon">📋</span>
            <div>
              <h3>12</h3>
              <p>Bookings Today</p>
            </div>
          </div>
          <div className="glass-card">
            <span className="kpi-icon">🔄</span>
            <div>
              <h3>3</h3>
              <p>Exchanges</p>
            </div>
          </div>
          <div className="glass-card">
            <span className="kpi-icon">💵</span>
            <div>
              <h3>5</h3>
              <p>Pending Refunds</p>
            </div>
          </div>
          <div className="glass-card">
            <span className="kpi-icon">💳</span>
            <div>
              <h3>2</h3>
              <p>Future Credits</p>
            </div>
          </div>
        </div>

        {/* BOTTOM SPLIT (Table + Alerts) */}
        <div className="glass-main-split">
          
          {/* LEFT: RECENT TRANSACTIONS TABLE */}
          <div className="glass-panel table-panel">
            <div className="panel-header">
              <h3>Recent Transactions</h3>
              <button className="glass-btn">View All</button>
            </div>
            <table className="glass-table">
              <thead>
                <tr>
                  <th>PNR</th>
                  <th>Customer Name</th>
                  <th>Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {txData.map((tx) => (
                  <tr key={tx.id}>
                    <td className="fw-bold">{tx.pnr}</td>
                    <td>{tx.name}</td>
                    <td>{tx.type}</td>
                    <td>
                      <span className={`status-badge ${tx.status.toLowerCase()}`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* RIGHT: ALERTS QUEUE */}
          <div className="glass-panel alerts-panel">
            <h3>Action Required</h3>
            
            <div className="glass-alert red-alert">
              <strong>🔴 Payment Timeout</strong>
              <p>PNR Q1W2E3 pending verification.</p>
            </div>
            
            <div className="glass-alert orange-alert">
              <strong>🟠 Schedule Change</strong>
              <p>Flight 6E-204 delayed by 2hrs.</p>
            </div>

            <div className="glass-alert blue-alert">
              <strong>🔵 System Update</strong>
              <p>Indigo API downtime at 2 AM.</p>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;