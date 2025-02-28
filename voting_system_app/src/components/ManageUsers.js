import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [editUserId, setEditUserId] = useState(null);
    const [editUserFullName, setEditUserFullName] = useState('');
    const [editUserEmail, setEditUserEmail] = useState('');
    const [editUserMobile, setEditUserMobile] = useState('');
    const [editUserRole, setEditUserRole] = useState('VOTER');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token'); // Retrieve the token from local storage
            const response = await axios.get("http://localhost:8080/api/admin/users", {
                headers: {
                    'Authorization': `Bearer ${token}`  // Pass JWT token
                }
            });
            console.log("Users fetched:", response.data);
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            const token = localStorage.getItem('token'); // Retrieve the token from local storage
            await axios.delete(`http://localhost:8080/api/admin/users/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`  // Pass JWT token
                }
            });
            setUsers(users.filter(user => user.id !== userId));
        } catch (error) {
            console.error("Error deleting user:", error);
            setError("Failed to delete user.");
        }
    };

    const handleEditUser = async () => {
        if (!editUserFullName || !editUserEmail || !editUserRole) {
            setError("All fields are required.");
            return;
        }
        try {
            const token = localStorage.getItem('token'); // Retrieve the token from local storage
            const userData = {
                fullName: editUserFullName,
                email: editUserEmail,
                mobile: editUserMobile,
                role: editUserRole
            };
            console.log("Editing user:", userData);
            const response = await axios.put(`http://localhost:8080/api/admin/users/${editUserId}`, userData, {
                headers: {
                    'Authorization': `Bearer ${token}`  // Pass JWT token
                }
            });
            console.log("User edited successfully:", response.data);
            setUsers(users.map(user => user.id === editUserId ? response.data : user));
            setEditUserId(null);
            setEditUserFullName("");
            setEditUserEmail("");
            setEditUserRole("VOTER");
            setError("");
        } catch (error) {
            console.error("Error editing user:", error);
            setError("Failed to edit user.");
        }
    };

    const startEditUser = (user) => {
        setEditUserId(user.id);
        setEditUserFullName(user.fullName);
        setEditUserEmail(user.email);
        setEditUserMobile(user.mobile);
        setEditUserRole(user.role);
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">Manage Users</a>
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
                <h1>Manage Users</h1>
                <div className="mt-5">
                    <h2>All Users</h2>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <ul className="list-group">
                        {users.map((user) => (
                            <li key={user.id} className="list-group-item d-flex justify-content-between align-items-center">
                                <span>{user.fullName} ({user.email}) - {user.role}</span>
                                <div>
                                    <button className="btn btn-secondary btn-sm me-2" onClick={() => startEditUser(user)}>Edit</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(user.id)}>Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                {editUserId && (
                    <div className="mt-5">
                        <h2>Edit User</h2>
                        <form onSubmit={(e) => { e.preventDefault(); handleEditUser(); }}>
                            <div className="mb-3">
                                <label className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={editUserFullName}
                                    onChange={(e) => setEditUserFullName(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={editUserEmail}
                                    onChange={(e) => setEditUserEmail(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Mobile</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={editUserMobile}
                                    onChange={(e) => setEditUserMobile(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Role</label>
                                <select
                                    className="form-control"
                                    value={editUserRole}
                                    onChange={(e) => setEditUserRole(e.target.value)}
                                >
                                    <option value="VOTER">VOTER</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>
                            </div>
                            <button type="submit" className="btn btn-primary">Save</button>
                            <button type="button" className="btn btn-secondary ms-2" onClick={() => setEditUserId(null)}>Cancel</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ManageUsers;