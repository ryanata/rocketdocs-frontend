import React, { useState, useContext, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { getAuth } from "firebase/auth";
import { DocumentationContext } from '@/utils/Context';
import { fetchDoc, fetchRepo } from '@/utils/apiUtils';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { SearchBar } from "@/components/ui/search-bar";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Icon } from '@iconify/react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Sidebar from '@/components/sidebar';
import Editor from '@/components/editor';
import rocketdocsLogo from '../assets/Logo_48x48.svg';
import { Outlet } from 'react-router-dom';

const DocumentationPageContainer: React.FC = () => {
    const { repoId, fileId } = useParams<{ repoId?: string, fileId: string }>();
    const { setToken } = useContext(DocumentationContext);
    const navigate = useNavigate();
    const auth = getAuth();
    const user = auth.currentUser;

    const getDocumentation = async () => {
        const token = await user?.getIdToken();
        setToken(token || '');

        if (repoId) {
            // Fetch repo documentation
            const response = await fetchRepo(repoId, token || '');
            return response;
        } else {
            // Fetch file documentation
            const response = await fetchDoc(fileId || '', token || '');
            return response;
        }
    };

    const { data: doc, error, isLoading, refetch } = useQuery(
        [repoId ? repoId : fileId], 
        () => getDocumentation(),
        { enabled: !!repoId || !!fileId, staleTime: Infinity }
    );

    const isReady = () => {
        const documentStatus = repoId ? doc?.repo?.status : doc?.status;
        return documentStatus === 'COMPLETED' || documentStatus === 'FAILED';
    }
    
    
    useEffect(() => {
        const intervalId = setInterval(() => {
            if (!isReady()) {
                refetch();
            }
        }, 2000);

        return () => clearInterval(intervalId); // Clean up on unmount
    }, [doc, refetch]);
    
    useEffect(() => {
        if (isReady()) {
            if (repoId && !fileId) {
                const rootFile = doc?.repo.tree[0].id;
                navigate(`/docs/repo/${repoId}/${rootFile}`);
            }
        }
    }, [doc]);
    
    if (error) {
        return <div>Something went wrong...</div>;
    }

    if (isLoading || !isReady()) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className='flex flex-col justify-center items-center gap-3'>
                    <LoadingSpinner />
                    <p>{isLoading ? "Loading..." : "Generating documentation..."}</p>
                </div>
            </div>
        )
    }

    return (
        <Outlet />
    );
};

const Navbar: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div id="navbar" className="flex justify-between items-center border">
            <div className="flex items-center">
                <img src={rocketdocsLogo} alt="RocketDocs Logo" className="p-1" />
                <span className="text-[32px] font-semibold pb-1" style={{ fontFamily: 'Quicksand', color: '#7553FF' }}>rocketdocs</span>
            </div>
            <div>
                <SearchBar/>
            </div>
            <div className="px-8">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <a className="cursor-pointer">
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </a>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                            <Icon icon="mage:dashboard-2" className="mr-2"/>
                            <span>Dashboard</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}

const RepoDocumentationPage: React.FC = () => {
    const [remainingHeight, setRemainingHeight] = useState(0);

    useEffect(() => {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            const totalHeight = window.innerHeight;
            const navbarHeight = navbar.offsetHeight;
            setRemainingHeight(totalHeight - navbarHeight);
            
            // navbar's state changes after this component mount which affects its height, we need to listen to navbar changes
            // Create a new observer
            const observer = new MutationObserver(() => {
                const updatedNavbarHeight = navbar.offsetHeight;
                setRemainingHeight(totalHeight - updatedNavbarHeight);
            });
    
            // Start observing the target node for configured mutations
            observer.observe(navbar, { attributes: true, childList: true, subtree: true });
    
            // Later, you can stop observing
            return () => observer.disconnect();
        }
    }, []);

    console.log(remainingHeight);
    return (
        <>
            <Navbar/>
            <div style={{ display: 'grid', gridTemplateColumns: '20% 80%', height: remainingHeight }}>
                <Sidebar />
                <ScrollArea>
                    <Editor/>
                </ScrollArea>
            </div>
        </>
    )
};

const FileDocumentationPage: React.FC = () => {
    return (
        <>
            <Sidebar />
            <Editor/>
        </>
    )
}
export {DocumentationPageContainer, RepoDocumentationPage, FileDocumentationPage};