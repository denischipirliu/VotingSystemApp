import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const [activeElections, setActiveElections] = useState([]);
    const [filter, setFilter] = useState('all'); // 'all' or 'notVoted'
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch active elections
        fetchActiveElections();
    }, [filter]);

    const fetchActiveElections = async () => {
        try {
            const token = localStorage.getItem('token'); // Retrieve the token from local storage
            const endpoint = filter === 'all' ? "http://localhost:8080/api/voter/active-elections" : "http://localhost:8080/api/voter/active-elections-not-voted";
            const response = await axios.get(endpoint, {
                headers: {
                    'Authorization': `Bearer ${token}`  // Pass JWT token
                }
            });
            console.log("Active elections fetched:", response.data);
            const electionsWithVoteStatus = await Promise.all(response.data.map(async (election) => {
                const electionDetails = await axios.get(`http://localhost:8080/api/voter/active-elections/${election.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`  // Pass JWT token
                    }
                });
                return { ...election, hasVoted: electionDetails.data };
            }));
            setActiveElections(electionsWithVoteStatus);
            console.log("Active elections with vote status:", electionsWithVoteStatus);
        } catch (error) {
            console.error("Error fetching active elections:", error);
            setActiveElections([]); // Ensure activeElections is an array even if there's an error
        }
    };

    const handleVote = async (electionId, candidateId) => {
        try {
            const token = localStorage.getItem('token'); // Retrieve the token from local storage
            const response = await axios.post(`http://localhost:8080/api/voter/generate-token/${electionId}`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`  // Pass JWT token
                }
            });
            alert(response.data);
            const voteToken = prompt("Enter the vote token:");
            const voteResponse = await axios.post(`http://localhost:8080/api/voter/vote/${voteToken}/${candidateId}`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`  // Pass JWT token
                }
            });
            console.log("Vote successful:", voteResponse.data);
            setError("");
            alert(voteResponse.data);
            fetchActiveElections(); // Refresh the elections after voting
        } catch (error) {
            console.error("Error casting vote:", error);
            setError("Failed to cast vote.");
        }
    };

    const toggleFilter = () => {
        setFilter(filter === 'all' ? 'notVoted' : 'all');
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">Voter Dashboard</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <button className="btn btn-link nav-link" onClick={() => navigate('/profile')}>Profile</button>
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
                <h1>Active Elections</h1>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button className="btn btn-secondary mb-3" onClick={toggleFilter}>
                    {filter === 'all' ? 'Show Elections Not Voted' : 'Show All Elections'}
                </button>
                <ul className="list-group">
                    {activeElections.map((election) => (
                        <li key={election.id} className="list-group-item">
                            <h3>{election.name} (from {election.startDate} to {election.endDate})</h3>
                            <ul>
                                {election.candidates.map((candidate) => (
                                    <li key={candidate.id}>
                                        {candidate.name} ({candidate.party})
                                        {!election.hasVoted && (
                                            <button className="btn btn-primary ml-3" onClick={() => handleVote(election.id, candidate.id)}>Vote</button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Dashboard;