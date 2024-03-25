import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import rocketdocsLogo from '../assets/Logo_48x48.svg';
import howitworks from '../assets/howitworks.svg';
import { Icon } from '@iconify/react';

const HowItWorksPage: React.FC = () => {
    const navigate = useNavigate();


    return (
        <div className="flex flex-col h-screen overflow-y-auto">
            <div className="flex justify-between items-center mx-8">
                <div className="flex items-center">
                    <img src={rocketdocsLogo} alt="RocketDocs Logo" className="p-1" />
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

            <main className="flex flex-1 flex-col justify-center items-center mx-0 px-0 mt-8">
                <div className="flex flex-row gap-8">
                    <div className="flex flex-col gap-8 items-left mx-32 my-16">
                        <h1 className="text-6xl font-bold">How It Works</h1>
                        <p className="text-2xl text-left font-medium">Learn how to listen and respond to events in Flatfile. <br></br><br></br> You've created a Workbook. <br></br><br></br>
                        This comprehensive guide is designed to help you navigate the exciting world<br></br> 
                        of our software and make the most of its powerful features. Whether you're <br></br> 
                        a seasoned pro or just starting out, this documentation will provide you <br></br> 
                        with the knowledge and tools to become a master of XYZ Software. From<br></br>  
                        basic functionality to advanced tips and tricks, you'll find everything you <br></br> 
                        need to achieve your goals with our software. <br></br><br></br> 
                        In this step of the tutorial, you’ll learn how to set up a listener to receive Events.<br></br><br></br>
                        </p>
                        <h2 className="text-4xl font-bold"> Documenting repositories</h2>
                        <p className="text-2xl text-left font-medium">XYZ Software. From basic functionality to advanced tips and tricks, you'll find everything you need to
                        achieve your goals with our software.<br></br><br></br>In this step of the tutorial, you’ll learn how to set up a listener to receive Events.</p>
                    </div>
                    <img className="mr-72 translate-y-32 border-0 h-72 drop-shadow-lg" src={howitworks} />
                </div>
                <div className="flex justify-center items-center w-11/12 h-2/3  border-0 p- ">
                    <div className="flex justify-center items-center w-full h-full bg-[#ebe7fd] rounded-md">
                        <div className="flex justify-center items-center w-3/12 h-96 border-0 border-black mr-12 rounded-lg bg-white drop-shadow-lg">
                            
                        </div>
                        <div className="flex justify-center items-center w-3/12 h-96 border-0 border-black mr-12 rounded-lg bg-white drop-shadow-lg">

                        </div>
                        <div className="flex justify-center items-center w-3/12 h-96 border-0 border-black rounded-lg bg-white drop-shadow-lg">

                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-8 items-left mx-32 my-16">
                    <h2 className="text-4xl font-bold"> Optimizing file summaries</h2>
                    <p className="text-2xl text-left font-medium">XYZ Software. From basic functionality to advanced tips and tricks, you'll find everything you need to achieve your goals with our software.<br></br><br></br>In this step of the tutorial, you’ll learn how to set up a listener to receive Events.</p>
                </div>
            </main>
        </div>
    );
};

export default HowItWorksPage;
