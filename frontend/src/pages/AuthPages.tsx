import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import rocketdocsLogo from '../assets/Logo_48x48.svg';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast"

import rocketPicture from '../assets/rocket_svg.svg';

type AuthAction = 'login' | 'signup';

type AuthScreenStrings = {
    header: string;
    subheader: string;
    submitButton: string;
    accountPrompt: string;
    accountPromptRedirect: string;
    accountPromptRedirectURL: string;
};

const AuthPage: React.FC<{ authAction: AuthAction, authHandler: (email: string, password: string) => void }> = ({ authAction, authHandler }) => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    // const { toast } = useToast()
    const navigate = useNavigate();
    
    const authScreenStringsMap: Record<AuthAction, AuthScreenStrings> = {
        login: {
            header: 'Welcome Back!',
            subheader: 'Sign in to continue to your account',
            submitButton: 'Log In',
            accountPrompt: 'Don\'t have an account?',
            accountPromptRedirect: 'Sign up',
            accountPromptRedirectURL: '/signup'
        },
        signup: {
            header: 'Get Started',
            subheader: 'Sign up to create an account',
            submitButton: 'Sign Up',
            accountPrompt: 'Already have an account?',
            accountPromptRedirect: 'Log in',
            accountPromptRedirectURL: '/login'
        }
    }
    
    const authScreenStrings = authScreenStringsMap[authAction];
    
    return(
        <div className="h-screen flex">
            <div className="flex flex-col md:border-r-2 md:border md:w-1/2 w-full h-full">
                {/* Logo */}
                <div className="flex justify-between items-center mx-8">
                    <a className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                        <img src={rocketdocsLogo} alt="RocketDocs Logo" className="w-[42px] ml-3 mr-1 p-1" />
                        <span className="text-[32px] font-semibold pb-1" style={{ fontFamily: 'Quicksand', color: '#7553FF' }}>rocketdocs</span>
                    </a>
                </div>

                <div className="flex flex-1 flex-col justify-center">
                    <div className="flex justify-center">
                        <div className="flex flex-col gap-14">
                            {/* Splash Text*/}
                            <div>
                                <h1 className="text-4xl sm:text-6xl md:text-4xl lg:text-6xl font-semibold">{authScreenStrings.header}</h1>
                                <p className="text-xl sm:text-2xl md:text-xl lg:text-2xl tracking-wide">{authScreenStrings.subheader}</p>
                            </div>

                            {/* Login inputs */}
                            <div>
                                <p className="text-2xl">Email</p>
                                <Input
                                    type="text"
                                    className="w-full text-2xl h-12 bg-neutral-100 border-neutral-100 border-0"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <p className="text-2xl mt-4">Password</p>
                                <Input
                                    type="password"
                                    className="w-full text-2xl h-12 bg-neutral-100 border-neutral-100 border-0"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />  
                            </div>

                            {/* Submit button */}
                            <div className="flex flex-col gap-3">
                                <Button  
                                    className="text-md text-2xl w-full 2 h-12"
                                    onClick={() => authHandler(email, password)}
                                >
                                    {authScreenStrings.submitButton}
                                </Button>
                                <div className="flex items-center space-x-4">
                                    <p className='text-lg sm:text-2xl'>{authScreenStrings.accountPrompt}</p>
                                    <a className="text-lg sm:text-2xl text-[#7553FF] cursor-pointer" onClick={() => navigate(authScreenStrings.accountPromptRedirectURL)}>{authScreenStrings.accountPromptRedirect}</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="hidden md:block w-1/2 bg-gradient-to-t from-light-purple via-primary to-dark-purple">
                <img className="w-auto h-full object-cover" src={rocketPicture} alt="Rocket Picture" />
            </div>
        </div>
    )
}

const LoginPage: React.FC = () => {
    const { toast } = useToast()
    const auth = getAuth();
    const navigate = useNavigate();

    const loginHandler = async (email: string, password: string) => {
        const errorMessages = {
            'auth/invalid-email': 'The email address is not valid.',
            'auth/missing-password': 'The password is missing.',
            'auth/invalid-credential': 'The password is invalid for the given email.',
            'auth/too-many-requests': 'Access to this account has been temporarily disabled due to many failed login attempts.',
            'default': 'An unknown error occurred.'
        };
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            // Signed in 
            const user = userCredential.user;
            console.log(user);
            navigate('/dashboard');
        } catch (error: any) {
            console.log(error);
            const message = (error.code in errorMessages) ? errorMessages[error.code as keyof typeof errorMessages] : errorMessages['default'];
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: message,
            });
        }
    }
    return (
        <AuthPage authAction="login" authHandler={loginHandler}/>
    )
}

const SignupPage: React.FC = () => {
    const { toast } = useToast()
    const auth = getAuth();
    const navigate = useNavigate();

    const signupHandler = async (email: string, password: string) => {
        const errorMessages = {
            'auth/email-already-in-use': 'The email address is already in use.',
            'auth/invalid-email': 'The email address is not valid.',
            'auth/missing-password': 'The password is missing.',
            'default': 'An unknown error occurred.'
        };
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // Signed in 
            const user = userCredential.user;
            console.log(user);
            navigate('/dashboard');
        } catch (error: any) {
            console.log(error);
            const message = (error.code in errorMessages) ? errorMessages[error.code as keyof typeof errorMessages] : errorMessages['default'];
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: message,
            });
        }
    }
    return (
        <AuthPage authAction="signup" authHandler={signupHandler}/>
    )
}

export {LoginPage, SignupPage};