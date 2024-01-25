import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-gray-100">
            <header className="bg-white shadow">
                <nav className="container mx-auto px-4 py-6">
                    <div className="flex justify-end gap-4">
                        <Button onClick={() => navigate('/login')}>
                            Log in
                        </Button>
                        <Button onClick={() => navigate('/signup')}>
                            Sign up
                        </Button>
                    </div>
                </nav>
            </header>

            <main className="container mx-auto px-4 py-8">
                {/* Your main content goes here */}
            </main>

            <footer className="bg-gray-200">
                <div className="container mx-auto px-4 py-6">
                    {/* Your footer content goes here */}
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
