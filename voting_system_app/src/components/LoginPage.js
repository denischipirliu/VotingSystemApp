import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    MDBContainer,
    MDBInput,
    MDBBtn,
} from 'mdb-react-ui-kit';
import { getCurrentUser } from './UserService';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            if (!email || !password) {
                setError('Please enter both email and password.');
                return;
            }
            const response = await axios.post('http://localhost:8080/api/auth/signin', { email, password });
            console.log('Login successful:', response.data);
    
            // Store JWT token in localStorage
            localStorage.setItem('token', response.data.jwt);
    
            // Fetch the current user after successful login
            const userResponse = await getCurrentUser(); // Await the user data
            console.log('User:', userResponse);
    
            // Navigate based on user role
            if (userResponse.role === 'ADMIN') {
                navigate('/admin/dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Login failed:', error.response ? error.response.data : error.message);
            setError('Invalid email or password.');
        }
    };
    return (
        <div className="d-flex justify-content-center align-items-start vh-100">
            <div className="border rounded-lg p-4" style={{ maxWidth: '400px', width: '100%' }}>
                <MDBContainer className="p-3">
                    <h2 className="mb-4 text-center">Login</h2>
                    <MDBInput 
                        wrapperClass='mb-4' 
                        placeholder='Email' 
                        id='email' 
                        value={email} 
                        type='email' 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                    <MDBInput 
                        wrapperClass='mb-4' 
                        placeholder='Password' 
                        id='password' 
                        type='password' 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                    {error && <p className="text-danger text-center">{error}</p>}
                    <MDBBtn 
                        className="mb-4 w-100" 
                        color="primary" 
                        size="lg" 
                        onClick={handleLogin}
                    >
                        Sign In
                    </MDBBtn>
                    <div className="text-center">
                        <p>Not a member? <a href="/signup">Register</a></p>
                    </div>
                </MDBContainer>
            </div>
        </div>
    );
}

export default LoginPage;
