import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getAuth, User } from "firebase/auth";

const ProtectedRoute = ({ component: Component }: { component: React.ComponentType<any> }) => {
    const auth = getAuth();
    const [user, setUser] = useState<User | null | undefined>(
        auth.currentUser ?? undefined,
    );
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        return auth.onAuthStateChanged((user) => {
          setUser(user);
          setLoading(false);
        });
      }, []);
    
    if (loading) {
    return <div>Loading...</div>; // Or your loading component
    }

    if (!user) {
        return <Navigate to="/" />;
    }

    return <Component />;
};

export default ProtectedRoute;