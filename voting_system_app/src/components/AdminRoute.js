import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser } from './UserService';

function AdminRoute({ element: Component, ...rest }) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUserRole = async () => {
            try {
                const user = await getCurrentUser();
                setIsAdmin(user.role === 'ADMIN');
            } catch (error) {
                setIsAdmin(false);
            } finally {
                setLoading(false);
            }
        };

        checkUserRole();
    }, []);

    if (loading) {
        return <div>Loading...</div>; // or a loading spinner
    }

    return isAdmin ? Component : <Navigate to="/dashboard" />;
}

export default AdminRoute;