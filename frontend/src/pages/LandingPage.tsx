import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import rocketdocsLogo from '../assets/Logo_48x48.svg';
import page from '../assets/page.png';
import { Icon } from '@iconify/react';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();


    return (
        <div className="flex flex-col bg-gradient-to-b from-white via-white via-60% to-violet-300 h-screen overflow-hidden">
            <div className="flex justify-between items-center mx-8">
                <div className="flex items-center">
                    <img src={rocketdocsLogo} alt="RocketDocs Logo" className="w-[42px] ml-3 mr-1 p-1" />
                    <span className="text-[32px] font-semibold pb-1" style={{ fontFamily: 'Quicksand', color: '#7553FF' }}>rocketdocs</span>
                </div>
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

            <main className="flex flex-1 flex-col items-center justify-between mx-auto px-4 mt-8">
                <div className="flex flex-col gap-8 items-center">
                    <h1 className="text-6xl font-semibold text-center">Documentation <br></br> in rocket speeds</h1>
                    <p className="text-2xl text-center">Create documentation out of the box in <br></br> minutes with the power of AI.</p>
                    <Button className="text-xl" size="lg" onClick={() => navigate('/signup')}>Start Creating</Button>
                </div>

                <div className="flex w-4/6 justify-end">
                    <img className="" src={page} alt="Page" />
                </div>
            </main>
        </div>
    );
};

export default LandingPage;
