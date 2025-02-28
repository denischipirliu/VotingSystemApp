import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MDBContainer, MDBInput } from 'mdb-react-ui-kit';

function SignupPage() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [mobile, setMobile] = useState(''); // renamed state
    const [role] = useState('VOTER'); // role remains fixed as 'VOTER'
    const [voterIdCode, setVoterIdCode] = useState('');
    const [error, setError] = useState(''); // State to manage error messages
    const history = useNavigate(); // Navigation hook

    const handleSignup = async () => {
        try {
            // Check for empty fields
            if (!fullName || !email || !password || !confirmPassword || !mobile || !voterIdCode) {
                setError('Please fill in all fields.');
                return;
            }

            if (password !== confirmPassword) {
                setError("Passwords do not match");
                return;
            }

            // Send data to the backend to create both user and voter
            const response = await axios.post('http://localhost:8080/api/voter/register', {
                fullName,
                email,
                password,
                mobile,
                role,
                voterIdCode
            });

            console.log("Voter and user registered successfully:", response.data);

            localStorage.setItem('token', response.data.jwt);

            //Show success message
            alert('Signup successful!');

            // Redirect to login page after successful signup
            history('/'); // Redirect after successful signup

        } catch (error) {
            // Handle signup error
            console.error('Signup failed:', error.response ? error.response.data : error.message);
            setError(error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="border rounded-lg p-4" style={{ width: '600px', height: 'auto' }}>
                <MDBContainer className="p-3">
                    <h2 className="mb-4 text-center">Sign Up as a Voter</h2>
                    {error && <p className="text-danger">{error}</p>}
                    <MDBInput 
                        wrapperClass="mb-3" 
                        id="fullName" 
                        placeholder="Full Name" 
                        value={fullName} 
                        type="text"
                        onChange={(e) => setFullName(e.target.value)} 
                    />
                    <MDBInput 
                        wrapperClass="mb-3" 
                        placeholder="Email Address" 
                        id="email" 
                        value={email} 
                        type="email"
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                    <MDBInput 
                        wrapperClass="mb-3" 
                        placeholder="Password" 
                        id="password" 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                    <MDBInput 
                        wrapperClass="mb-3" 
                        placeholder="Confirm Password" 
                        id="confirmPassword" 
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                    />
                    <MDBInput 
                        wrapperClass="mb-2" 
                        placeholder="Mobile Number" 
                        id="mobile" 
                        value={mobile}
                        type="text"  // Changed to 'tel' type for better validation
                        onChange={(e) => setMobile(e.target.value)} 
                    />
                    <MDBInput 
                        wrapperClass="mb-2" 
                        placeholder="Voter ID Code" 
                        id="voterIdCode" 
                        value={voterIdCode}
                        type="text"
                        onChange={(e) => setVoterIdCode(e.target.value)} 
                    />
                    <button 
                        className="mb-4 d-block mx-auto fixed-action-btn btn-primary" 
                        style={{ height: '40px', width: '100%' }}
                        onClick={handleSignup}
                    >
                        Sign Up
                    </button>
                    <div className="text-center">
                        <p>Already registered? <a href="/">Login</a></p>
                    </div>
                </MDBContainer>
            </div>
        </div>
    );
}

export default SignupPage;
