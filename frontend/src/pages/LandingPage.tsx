import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import rocketdocsLogo from '../assets/rocketdocs_logo.svg';
import page from '../assets/page.png';
import { Icon } from '@iconify/react';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();


    return (
        <div className="bg-gradient-to-b from-white via-white via-60% to-violet-300 h-screen overflow-hidden">
            <div className="flex justify-between items-center mx-8">
                <img src={rocketdocsLogo} alt="RocketDocs Logo" />
                <div className="flex items-center space-x-1">
                    <Button className="text-xl" variant="empty" onClick={() => navigate('/signup')}>How It Works <Icon icon="ic:round-keyboard-arrow-down" /></Button> 
                    <Button className="text-xl" variant="empty" onClick={() => navigate('/signup')}>Features <Icon icon="ic:round-keyboard-arrow-down" /></Button> 
                    <Button className="text-xl" variant="empty" onClick={() => navigate('/signup')}>Examples <Icon icon="ic:round-keyboard-arrow-down" /></Button> 
                </div>
                <div className="flex items-center space-x-4">
                    <a onClick={() => navigate('/login')} className="hover:before:scale-x-100 hover:before:origin-left text-2xl relative before:w-full before:h-1 before:origin-right before:transition-transform before:duration-300 before:scale-x-0 before:bg-primary before:absolute before:left-0 before:bottom-0">Login</a>
                    <Button className="text-xl" onClick={() => navigate('/signup')}>Sign Up</Button>
                </div>
            </div>

            <main className="container mx-auto px-4 py-16 ">
                {
                    <div className="flex justify-center items-center w-full">
                         <div className="flex flex-col space-y-8 items-center">
                            <h1 className="text-6xl font-semibold text-center">Documentation <br></br> in rocket speeds</h1>
                            <p className="text-2xl text-center">Create documentation out of the box in <br></br> minutes with the power of AI.</p>
                            <Button className="text-xl w-1/5" onClick={() => navigate('/signup')}>Start Creating</Button>
                            <div className="w-4/6">
                                <img className="bottom-0 flex justify-center" src={page} alt="Page" />
                            </div>
                         </div>
                    </div>
                }
            </main>
        </div>
    );
};

export default LandingPage;
