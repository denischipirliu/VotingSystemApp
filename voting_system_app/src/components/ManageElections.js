import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBBtn, MDBInput } from 'mdb-react-ui-kit';

function ManageElections() {
    const [elections, setElections] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [electionCandidates, setElectionCandidates] = useState([]);
    const [newElectionName, setNewElectionName] = useState('');
    const [newElectionStartDate, setNewElectionStartDate] = useState('');
    const [newElectionEndDate, setNewElectionEndDate] = useState('');
    const [selectedElectionId, setSelectedElectionId] = useState('');
    const [selectedCandidateId, setSelectedCandidateId] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchElections();
        fetchCandidates();
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
            console.log("Elections:", response.data);
        } catch (error) {
            console.error("Error fetching elections:", error);
        }
    };

    const fetchCandidates = async () => {
        try {
            const token = localStorage.getItem('token'); // Retrieve the token from local storage
            const response = await axios.get("http://localhost:8080/api/admin/candidates", {
                headers: {
                    'Authorization': `Bearer ${token}`  // Pass JWT token
                }
            });
            setCandidates(response.data);
        } catch (error) {
            console.error("Error fetching candidates:", error);
        }
    };

    const fetchElectionCandidates = async (electionId) => {
        try {
            const token = localStorage.getItem('token'); // Retrieve the token from local storage
            const response = await axios.get(`http://localhost:8080/api/admin/elections/${electionId}/candidates`, {
                headers: {
                    'Authorization': `Bearer ${token}`  // Pass JWT token
                }
            });
            setElectionCandidates(response.data);
        } catch (error) {
            console.error("Error fetching election candidates:", error);
        }
    };

    const handleCreateElection = async () => {
        if (!newElectionName || !newElectionStartDate || !newElectionEndDate) {
            setError("All fields are required.");
            return;
        }
        try {
            const token = localStorage.getItem('token'); // Retrieve the token from local storage
            const electionData = {
                name: newElectionName,
                startDate: newElectionStartDate,
                endDate: newElectionEndDate
            };
            console.log("Creating election:", electionData);
            const response = await axios.post("http://localhost:8080/api/admin/elections/create", electionData, {
                headers: {
                    'Authorization': `Bearer ${token}`  // Pass JWT token
                }
            });
            console.log("Election created successfully:", response.data);
            setElections([...elections, response.data]);
            setNewElectionName("");
            setNewElectionStartDate("");
            setNewElectionEndDate("");
            setError("");
        } catch (error) {
            console.error("Error creating election:", error);
            setError("Failed to create election.");
        }
    };

    const handleAddCandidateToElection = async () => {
        if (!selectedElectionId || !selectedCandidateId) {
            setError("All fields are required.");
            return;
        }
        try {
            const token = localStorage.getItem('token'); // Retrieve the token from local storage
            const response = await axios.post(`http://localhost:8080/api/admin/elections/${selectedElectionId}/add-candidate/${selectedCandidateId}`,{}, {
                headers: {
                    'Authorization': `Bearer ${token}`  // Pass JWT token
                }
            });
            console.log("Candidate added to election successfully:", response.data);
            fetchElections();
            fetchElectionCandidates(selectedElectionId);
            setSelectedCandidateId("");
            setError("");
        } catch (error) {
            console.error("Error adding candidate to election:", error);
            setError("Failed to add candidate to election.");
        }
    };

    const handleRemoveCandidateFromElection = async (electionId, candidateId) => {
        try {
            const token = localStorage.getItem('token'); // Retrieve the token from local storage
            await axios.delete(`http://localhost:8080/api/admin/elections/${electionId}/remove-candidate/${candidateId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`  // Pass JWT token
                }
            });
            console.log("Candidate removed from election successfully");
            fetchElections();
            fetchElectionCandidates(electionId);
        } catch (error) {
            console.error("Error removing candidate from election:", error);
            setError("Failed to remove candidate from election.");
        }
    };

    const handleStartElection = async (electionId) => {
        try {
            const token = localStorage.getItem('token'); // Retrieve the token from local storage
            await axios.put(`http://localhost:8080/api/admin/elections/${electionId}/start`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`  // Pass JWT token
                }
            });
            console.log("Election started successfully");
            fetchElections();
        } catch (error) {
            console.error("Error starting election:", error);
            setError("Failed to start election.");
        }
    };

    const handleEndElection = async (electionId) => {
        try {
            const token = localStorage.getItem('token'); // Retrieve the token from local storage
            await axios.put(`http://localhost:8080/api/admin/elections/${electionId}/end`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`  // Pass JWT token
                }
            });
            console.log("Election ended successfully");
            fetchElections();
        } catch (error) {
            console.error("Error ending election:", error);
            setError("Failed to end election.");
        }
    };

    const getAvailableCandidates = () => {
        return candidates.filter(candidate => !electionCandidates.some(ec => ec.id === candidate.id));
    };

    return (
        <MDBContainer>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">Manage Elections</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <button className="btn btn-link nav-link" onClick={() => navigate('/admin/dashboard')}>Back to Dashboard</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <MDBContainer className="mt-5">
                <h1>Manage Elections</h1>
                <div className="mt-4">
                    <h2>Create New Election</h2>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <form onSubmit={(e) => { e.preventDefault(); handleCreateElection(); }}>
                        <MDBInput
                            label="Election Name"
                            type="text"
                            value={newElectionName}
                            onChange={(e) => setNewElectionName(e.target.value)}
                            className="mb-3"
                        />
                        <MDBInput
                            label="Start Date"
                            type="date"
                            value={newElectionStartDate}
                            onChange={(e) => setNewElectionStartDate(e.target.value)}
                            className="mb-3"
                        />
                        <MDBInput
                            label="End Date"
                            type="date"
                            value={newElectionEndDate}
                            onChange={(e) => setNewElectionEndDate(e.target.value)}
                            className="mb-3"
                        />
                        <MDBBtn type="submit">Create Election</MDBBtn>
                    </form>
                </div>
                <div className="mt-5">
                    <h2>Add Candidate to Election</h2>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <form onSubmit={(e) => { e.preventDefault(); handleAddCandidateToElection(); }}>
                        <div className="mb-3">
                            <label className="form-label">Select Election</label>
                            <select
                                className="form-control"
                                value={selectedElectionId}
                                onChange={(e) => {
                                    setSelectedElectionId(e.target.value);
                                    fetchElectionCandidates(e.target.value);
                                }}
                            >
                                <option value="">Select an election</option>
                                {Array.isArray(elections) && elections.map((election) => (
                                    <option key={election.id} value={election.id}>
                                        {election.name} (from {election.startDate} to {election.endDate})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Select Candidate</label>
                            <select
                                className="form-control"
                                value={selectedCandidateId}
                                onChange={(e) => setSelectedCandidateId(e.target.value)}
                            >
                                <option value="">Select a candidate</option>
                                {Array.isArray(getAvailableCandidates()) && getAvailableCandidates().map((candidate) => (
                                    <option key={candidate.id} value={candidate.id}>
                                        {candidate.name} ({candidate.party})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <MDBBtn type="submit">Add Candidate</MDBBtn>
                    </form>
                </div>
                <div className="mt-5">
                    <h2>Manage Elections</h2>
                    <ul className="list-group">
                        {elections.map((election) => (
                            <li key={election.id} className="list-group-item">
                                <h3>{election.name} (from {election.startDate} to {election.endDate})</h3>
                                {election.active ? (
                                    <MDBBtn color="danger" className="me-2" onClick={() => handleEndElection(election.id)}>End Election</MDBBtn>
                                ) : (
                                    <MDBBtn color="success" className="me-2" onClick={() => handleStartElection(election.id)}>Start Election</MDBBtn>
                                )}
                                <h4>Candidates</h4>
                                <ul className="list-group">
                                    {election.candidates.map((candidate) => (
                                        <li key={candidate.id} className="list-group-item d-flex justify-content-between align-items-center">
                                            <span>{candidate.name} ({candidate.party})</span>
                                            <MDBBtn color="danger" size="sm" onClick={() => handleRemoveCandidateFromElection(election.id, candidate.id)}>Remove</MDBBtn>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
            </MDBContainer>
        </MDBContainer>
    );
}

export default ManageElections;