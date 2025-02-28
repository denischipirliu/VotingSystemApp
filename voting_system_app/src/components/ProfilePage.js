import React, { useState, useEffect } from 'react';
import { getCurrentUser } from './UserService';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        id: '',
        fullName: '',
        email: '',
        mobile: '',
        voterIdCode: '',
    });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const data = await getCurrentUser();
            console.log('User data:', data);
            const token = localStorage.getItem('token'); // Retrieve the token from local storage
            const response = await axios.get(`http://localhost:8080/api/voter/voterIdCode/${data.id}`, {
                
                    headers: {
                    'Authorization': `Bearer ${token}`  // Pass JWT token
                }});
    
            console.log('Voter ID Code:', response.data);
            data.voterIdCode = response.data;
            setUserData(data);
    
        } catch (err) {
            console.error(err);
            setError('Failed to fetch profile');
        }
    };
    
    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };

    return (
        <div>
            <h1>Profile Page</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
                <p><strong>Full Name:</strong> {userData.fullName}</p>
                <p><strong>Email:</strong> {userData.email}</p>
                <p><strong>Mobile:</strong> {userData.mobile}</p>
                <p><strong>Voter ID Code:</strong> {userData.voterIdCode}</p>
                <button onClick={handleBackToDashboard}>Back to Dashboard</button>
            </div>
        </div>
    );
}

export default ProfilePage;