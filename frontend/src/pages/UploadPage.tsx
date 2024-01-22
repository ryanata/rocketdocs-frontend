import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from '@iconify/react';
import rocketdocsLogo from '../assets/rocketdocs_logo.svg';

const UploadPage: React.FC = () => {
    const [githubFileUrl, setGithubFileUrl] = useState<string>("");
    const navigate = useNavigate();

    const mutation = useMutation(async () => {
        try {
            const response = await fetch(`${process.env.NODE_ENV === 'development' ? '/file-docs' : 'https://notebites.app/file-docs'}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        "github_url": githubFileUrl
                    }
                ),
            });
            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
            }
            const data = await response.json();
            
            // Extract the id from the response data
            const { id } = data;

            // Redirect to /docs/{id}
            navigate(`/docs/${id}`);
        } catch (error) {
            console.error(error);
            throw error;
        }
    });

    return (
        <div className="h-screen">
            {/* Top half */}
            <div className="border-b-2 border-primary" style={{ height: '50%'}}>
                {/* Header */}
                <div className="flex justify-between items-center mx-8">
                    <img src={rocketdocsLogo} alt="RocketDocs Logo" />
                    <div className="flex items-center space-x-4">
                        <a href="#" onClick={() => navigate('/login')} className="hover:before:scale-x-100 hover:before:origin-left text-2xl relative before:w-full before:h-1 before:origin-right before:transition-transform before:duration-300 before:scale-x-0 before:bg-primary before:absolute before:left-0 before:bottom-0">Login</a>
                        <Button className="text-xl" onClick={() => navigate('/signup')}>Sign Up</Button>
                    </div>
                </div>

                {/* Splash Text*/}
                <h1 className="text-5xl font-semibold mt-32 pl-16">Start creating documentation.</h1>
                <p className="text-2xl mt-1 pl-16 tracking-wide">Import an existing Git repository or start from scratch</p>
            </div>
            {/* Bottom half */}
            <div className="bg-light-purple" style={{ height: '50%' }}>
            </div>

            {/* Import Container */}
            <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-3/5 bg-white rounded-t-lg border-2 border-primary pb-8">
                <div className="flex justify-center h-full">
                    <div style={{ width: '80%', height: '100%', display: 'flex', flexDirection: "column" }}>
                        <div className="flex flex-col gap-24">
                            <h1 className="text-4xl font-semibold mt-8">Import a Git <span className="line-through">repository</span> file</h1>

                            <div className="relative">
                            <Input
                                type="url"
                                placeholder="Github file URL"
                                className="pl-12 text-2xl h-12"
                                value={githubFileUrl}
                                onChange={(e) => setGithubFileUrl(e.target.value)}
                            />                                
                            <Icon icon="devicon:github" width={32} height={32} className="absolute left-3 top-1/2 transform -translate-y-1/2" />
                            </div>
                        </div>

                        <div className="flex flex-col justify-end flex-grow">
                            <div className='flex justify-between gap-4'>
                                <Button variant="outline" size="lg" className="text-md w-full">Start From Scratch</Button>
                                <Button 
                                    size="lg" 
                                    className="text-md w-full"
                                    onClick={() => mutation.mutate()}
                                >
                                    Create Documentation
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default UploadPage;
