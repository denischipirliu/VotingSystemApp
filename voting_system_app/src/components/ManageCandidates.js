import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ManageCandidates() {
    const [candidates, setCandidates] = useState([]);
    const [newCandidateName, setNewCandidateName] = useState("");
    const [newCandidateParty, setNewCandidateParty] = useState("");
    const [editCandidateId, setEditCandidateId] = useState(null);
    const [editCandidateName, setEditCandidateName] = useState("");
    const [editCandidateParty, setEditCandidateParty] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch all candidates
        fetchCandidates();
    }, []);

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

    const handleCreateCandidate = async () => {
        if (!newCandidateName || !newCandidateParty) {
            setError("All fields are required.");
            return;
        }
        try {
            const token = localStorage.getItem('token'); // Retrieve the token from local storage
            const candidateData = {
                name: newCandidateName,
                party: newCandidateParty
            };
            console.log("Creating candidate:", candidateData);
            const response = await axios.post("http://localhost:8080/api/admin/candidates/create", candidateData, {
                headers: {
                    'Authorization': `Bearer ${token}`  // Pass JWT token
                }
            });
            console.log("Candidate created successfully:", response.data);
            setCandidates([...candidates, response.data]);
            setNewCandidateName("");
            setNewCandidateParty("");
            setError("");
        } catch (error) {
            console.error("Error creating candidate:", error);
            setError("Failed to create candidate.");
        }
    };

    const handleDeleteCandidate = async (candidateId) => {
        try {
            const token = localStorage.getItem('token'); // Retrieve the token from local storage
            await axios.delete(`http://localhost:8080/api/admin/candidates/delete/${candidateId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`  // Pass JWT token
                }
            });
            setCandidates(candidates.filter(candidate => candidate.id !== candidateId));
        } catch (error) {
            console.error("Error deleting candidate:", error);
            alert("Failed to delete candidate. ");
            setError("Failed to delete candidate.");
        }
    };

    const handleEditCandidate = async () => {
        if (!editCandidateName || !editCandidateParty) {
            setError("All fields are required.");
            return;
        }
        try {
            const token = localStorage.getItem('token'); // Retrieve the token from local storage
            const candidateData = {
                name: editCandidateName,
                party: editCandidateParty
            };
            console.log("Editing candidate:", candidateData);
            const response = await axios.put(`http://localhost:8080/api/admin/candidates/update/${editCandidateId}`, candidateData, {
                headers: {
                    'Authorization': `Bearer ${token}`  // Pass JWT token
                }
            });
            console.log("Candidate edited successfully:", response.data);
            setCandidates(candidates.map(candidate => candidate.id === editCandidateId ? response.data : candidate));
            setEditCandidateId(null);
            setEditCandidateName("");
            setEditCandidateParty("");
            setError("");
        } catch (error) {
            console.error("Error editing candidate:", error);
            setError("Failed to edit candidate.");
        }
    };

    const startEditCandidate = (candidate) => {
        setEditCandidateId(candidate.id);
        setEditCandidateName(candidate.name);
        setEditCandidateParty(candidate.party);
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">Manage Candidates</a>
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
            <div className="container mt-5">
                <h1>Manage Candidates</h1>
                <div className="mt-4">
                    <h2>Add New Candidate</h2>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <form onSubmit={(e) => { e.preventDefault(); handleCreateCandidate(); }}>
                        <div className="mb-3">
                            <label className="form-label">Candidate Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={newCandidateName}
                                onChange={(e) => setNewCandidateName(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Party</label>
                            <input
                                type="text"
                                className="form-control"
                                value={newCandidateParty}
                                onChange={(e) => setNewCandidateParty(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Add Candidate</button>
                    </form>
                </div>
                <div className="mt-5">
                    <h2>All Candidates</h2>
                    <ul className="list-group">
                        {candidates.map((candidate) => (
                            <li key={candidate.id} className="list-group-item d-flex justify-content-between align-items-center">
                                <span>{candidate.name} ({candidate.party})</span>
                                <div>
                                    <button className="btn btn-secondary btn-sm me-2" onClick={() => startEditCandidate(candidate)}>Edit</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteCandidate(candidate.id)}>Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                {editCandidateId && (
                    <div className="mt-5">
                        <h2>Edit Candidate</h2>
                        <form onSubmit={(e) => { e.preventDefault(); handleEditCandidate(); }}>
                            <div className="mb-3">
                                <label className="form-label">Candidate Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={editCandidateName}
                                    onChange={(e) => setEditCandidateName(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Party</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={editCandidateParty}
                                    onChange={(e) => setEditCandidateParty(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">Save</button>
                            <button type="button" className="btn btn-secondary ms-2" onClick={() => setEditCandidateId(null)}>Cancel</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ManageCandidates;