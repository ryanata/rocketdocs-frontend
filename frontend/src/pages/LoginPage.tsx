import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAuth, signInWithEmailAndPassword, GithubAuthProvider, signInWithPopup  } from "firebase/auth";
import rocketdocsLogo from '../assets/Logo_48x48.svg';
import { useNavigate } from 'react-router-dom';
import rocketPicture from '../assets/image-1000x1000.png';

const LoginPage: React.FC = () =>
{
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const navigate = useNavigate();
    const auth = getAuth();
    const provider = new GithubAuthProvider();
    provider.addScope('repo');

    const signIn = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            // Signed in 
            const user = userCredential.user;
            console.log(user);
            navigate('/dashboard');
        } catch (error) {
            console.log(error);
        }
    }

    
    const signInGithub = async () => {
        try {
            const result = await signInWithPopup(auth, provider);

            if (result) {
                // Extract GitHub credential from the result
                const credential = GithubAuthProvider.credentialFromResult(result);

                if (credential) {
                    // This gives you a GitHub Access Token. You can use it to access the GitHub API.
                    const github_token = credential.accessToken;
                    // Now you can use this token to access GitHub API or perform other tasks
                    if (github_token) {
                        sessionStorage.setItem("githubAccessToken", github_token);
                    }
                }
                
                
                // The signed-in user info.
                const user = result.user;
                console.log(user);
                navigate('/dashboard');
            } else {
                console.error("Redirect result is null.");
            }
        } catch (error) {
            console.log(error);
        }
    }

    return(
        <div className="h-screen flex flex-row">
            <div className="border-r-2 border" style={{ width: '50%', height: "100%"}}>
                {/* Header */}
                <div className="flex justify-between items-center mx-8">
                    <div className="flex items-center">
                        <img src={rocketdocsLogo} alt="RocketDocs Logo" className="p-1" />
                        <span className="text-[32px] font-semibold pb-1" style={{ fontFamily: 'Quicksand', color: '#7553FF' }}>rocketdocs</span>
                    </div>
                </div>

                {/* Splash Text*/}
                <h1 className="text-6xl font-semibold mt-48 pl-56">Welcome Back!</h1>
                <p className="text-2xl mt-1 pl-56 tracking-wide">Lorem ipsum dolor sit amet consectetur</p>
                <div>
                    <p className="text-2xl pl-56 mt-16">Email</p>
                    <Input
                        type="text"
                        className="ml-56 pl-2 text-2xl h-12 w-1/2 bg-neutral-100 border-neutral-100 border-0"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />  
                    <p className="text-2xl pl-56 mt-8">Password</p>
                    <Input
                        type="password"
                        className="ml-56 pl-2 text-2xl h-12 w-1/2 bg-neutral-100 border-neutral-100 border-0"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />  
                </div>
                <Button  
                    className="text-md text-2xl w-1/2 mt-12 ml-56 h-12"
                    onClick={signIn}
                >
                    Log In
                </Button>
                <Button  
                    className="text-md text-2xl w-1/2 mt-12 ml-56 h-12"
                    style={{ backgroundColor: 'black' }}
                    onClick={signInGithub}
                >
                    Sign in with Github
                </Button>
                <div className="flex items-center space-x-4">
                    <p className='mt-4 text-2xl pl-64'>Don't have an account?</p>
                    <a className="mt-4 text-2xl text-[#7553FF]" onClick={() => navigate('/signup')}>Sign up</a>
                </div>
                
            </div>
            <div className="w-1/2 border-">
                <img className= "" style={{ height: '920px', width: '1000px', objectFit: 'cover'}} src = {rocketPicture}></img>
            </div>
        </div>
    )
}

export default LoginPage;