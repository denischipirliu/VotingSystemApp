import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Dashboard from './components/Dashboard';
import ProfilePage from './components/ProfilePage';
import AdminDashboard from './components/AdminDashboard';
import ManageElections from './components/ManageElections';
import ManageCandidates from './components/ManageCandidates';
import './App.css'; // Import your CSS file here
import AdminRoute from './components/AdminRoute';
import ManageUsers from './components/ManageUsers';


function App() {
  return (
      <div className="App">
      <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/admin/dashboard" element={<AdminRoute element={<AdminDashboard />} />} />
                <Route path="/admin/manage-elections" element={<AdminRoute element={<ManageElections />} />} />
                <Route path="/admin/manage-candidates" element={<AdminRoute element={<ManageCandidates />} />} />
                <Route path="/admin/manage-users" element={<AdminRoute element={<ManageUsers />} />} />
            </Routes>
      </Router>
      </div>
  );
}

export default App;