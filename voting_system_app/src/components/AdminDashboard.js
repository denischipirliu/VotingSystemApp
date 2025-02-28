import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
    const [elections, setElections] = useState([]);
    const [selectedElectionResults, setSelectedElectionResults] = useState([]);
    const [selectedElectionId, setSelectedElectionId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch all elections
        fetchElections();
    }, []);

    const fetchElections = async () => {
        try {
            const token = localStorage.getItem('token'); // Retrieve the token from local storage
            const response = await axios.get("http://localhost:8080/api/admin/elections", {
                headers: {
                    'Authorization': `Bearer ${token}`  // Pass JWT token
                }
            });
            setElections(response.data);
        } catch (error) {
            console.error("Error fetching elections:", error);
        }
    };

    const fetchElectionResults = async (electionId) => {
        try {
            const token = localStorage.getItem('token'); // Retrieve the token from local storage
            const response = await axios.get(`http://localhost:8080/api/admin/elections/${electionId}/vote-counts`, {
                headers: {
                    'Authorization': `Bearer ${token}`  // Pass JWT token
                }
            });
            console.log("Election results fetched:", response.data);
            const results = Object.entries(response.data).map(([candidate, voteCount]) => ({
                candidate,
                voteCount
            }));
            setSelectedElectionResults(results);
        } catch (error) {
            console.error("Error fetching election results:", error);
            setSelectedElectionResults([]); // Ensure selectedElectionResults is an array even if there's an error
        }
    };

    const handleElectionClick = (electionId) => {
        setSelectedElectionId(electionId);
        fetchElectionResults(electionId);
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">Admin Dashboard</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <button className="btn btn-link nav-link" onClick={() => navigate('/admin/manage-users')}>Manage Users</button>
                            </li>  
                            <li className="nav-item">
                                <button className="btn btn-link nav-link" onClick={() => navigate('/admin/manage-elections')}>Manage Elections</button>
                            </li>
                            <li className="nav-item">
                                <button className="btn btn-link nav-link" onClick={() => navigate('/admin/manage-candidates')}>Manage Candidates</button>
                            </li>
                            <li className="nav-item">
                                <button className="btn btn-link nav-link" onClick={() => {
                                    localStorage.removeItem('token');
                                    navigate('/');
                                }}>Logout</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div className="container mt-5">
                <h1>Welcome to the Admin Dashboard</h1>
                <p>Here you can manage elections, users, and view reports.</p>
                <div className="mt-5">
                    <h2>All Elections</h2>
                    <ul className="list-group">
                        {elections.map((election) => (
                            <li key={election.id} className="list-group-item" onClick={() => handleElectionClick(election.id)}>
                                {election.name} (from {election.startDate} to {election.endDate})
                                {election.id === selectedElectionId && selectedElectionResults.length > 0 && (
                                    <ul>
                                        {selectedElectionResults.map((result, index) => (
                                            <li key={index}>
                                                {result.candidate} - {result.voteCount} votes
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;