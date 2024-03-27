import React, { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from '@iconify/react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getAuth } from "firebase/auth";
import { fetchRepos, postDoc, postIdentify, postConfirm, deleteRepo } from '@/utils/apiUtils';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import rocketdocsLogo from '../assets/Logo_48x48.svg';

type URLType = "repo" | "file" | "invalid";

const DashboardPage: React.FC = () => {
    const [githubFileUrl, setGithubFileUrl] = useState<string>("");
    const [confirmRepo, setConfirmRepo] = useState<{ id: string, length: number } | null>(null);
    const [createDocumentationLoading, setCreateDocumentationLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const auth = getAuth();
    const user = auth.currentUser;

    const isRepoUrl = (url: string): URLType => {
        const repoRegex = /^https:\/\/github\.com\/[^\/]+\/[^\/]+\/?$/;
        const fileRegex = /^https:\/\/github\.com\/[^\/]+\/[^\/]+\/blob\/.+$/;

        if (repoRegex.test(url)) {
            console.log("This is a repo");
            return "repo";
        } else if (fileRegex.test(url)) {
            console.log("This is a file");
            return "file";
        } else {
            console.log("Invalid URL");
            return "invalid";
        }
    }

    const { data: repoInfo, error, isLoading, refetch } = useQuery(
        ["allRepos"], 
        async () => {
            const token = await user?.getIdToken() ?? "";
            return await fetchRepos(token);
        },
        { staleTime: 180, refetchOnWindowFocus: false}
    );

    const fileMutation = useMutation(async () => {
        try {
            const token = await user?.getIdToken() ?? "";
            const id = await postDoc(token, githubFileUrl);
            navigate(`/docs/file/${id}`);
            setCreateDocumentationLoading(false);
        } catch (error) {
            console.error(error);
            setCreateDocumentationLoading(false);
            throw error;
        }
    });

    // Prompt user that the backend has identified N items to document
    // and ask for confirmation
    const identifierMutation = useMutation(async () => {
        try {
            const token = await user?.getIdToken() ?? "";
            const {id, items_to_document} = await postIdentify(token, githubFileUrl);
            setConfirmRepo({id, length: items_to_document.length});
            setCreateDocumentationLoading(false);
        } catch (error) {
            console.error(error);
            setCreateDocumentationLoading(false);
            throw error;
        }
    });

    // Continue the process of creating a documentation after the user has confirmed
    const confirmRepoMutation = useMutation(async () => {
        if (!confirmRepo) {
            throw new Error("No repo to confirm");
        }
        try {
            const token = await user?.getIdToken() ?? "";
            const id = await postConfirm(token, confirmRepo?.id);
            navigate(`/docs/repo/${id}`);
        } catch (error) {
            console.error(error);
            throw error;
        }
    });

    const deleteRepoMutation = useMutation(async (id: string) => {
        try {
            const token = await user?.getIdToken() ?? "";
            const response = await deleteRepo(id, token);
            console.log(response);
            refetch();
        } catch (error) {
            console.error(error);
            throw error;
        }
    });

    const myDocsHandler = () => {
        if (isLoading) {
            return (
                <div className="flex flex-1 justify-center items-center">
                    <LoadingSpinner />
                </div>
            )
        }
        if (error) {
            return <div>Something went wrong...</div>;
        }
        return repoInfo.repos.map((repo: any) => 
            <MyDocsCard 
                name={repo.name} 
                id={repo.id} 
                status={repo.status} 
                deleteHandler={() => {
                    deleteRepoMutation.mutate(repo.id);
                }} 
                key={repo.id} 
            />
        );
    }


    return (
        <div className="h-screen flex flex-col">
            {/* Navbar */}
            <div className="flex justify-between items-center px-8 bg-light-purple">
                <div className="flex items-center">
                    <img src={rocketdocsLogo} alt="RocketDocs Logo" className="w-10 p-1" />
                    <span className="text-[32px] font-semibold pb-1" style={{ fontFamily: 'Quicksand', color: '#7553FF' }}>rocketdocs</span>
                </div>
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </div>
            {/* Upload Section */}
            <div className="flex border-y-2 border-primary">
                {/* Left Section */}
                <div className="flex px-8 mt-2" style={{flex: 5}}>
                    <div className="flex flex-1 flex-col">
                        {/* Text container*/}
                        <div className="flex flex-col gap-2 mb-2">
                            <h1 className="text-3xl tracking-wide font-semibold">Create new documentation</h1>
                            <p className="text-2xl mt-1 font-light">Import an existing GitHub repo or file</p>
                        </div>
                        {/* Input/Button container*/}
                        <div className="flex flex-col gap-6 w-5/6">
                            <div className="relative">
                                <Input
                                    type="url"
                                    placeholder="GitHub file or repo URL"
                                    className="pl-12 text-2xl h-12 bg-slate-100"
                                    value={githubFileUrl}
                                    onChange={(e) => setGithubFileUrl(e.target.value)}
                                />                                
                                <Icon icon="devicon:github" width={32} height={32} className="absolute left-3 top-1/2 transform -translate-y-1/2" />
                            </div>
                            <div className="flex justify-center">
                                <Button
                                    size="lg" 
                                    className="text-lg w-1/2 mb-10"
                                    onClick={() => {
                                        const urlType = isRepoUrl(githubFileUrl);
                                        if (urlType === "repo") {
                                            setCreateDocumentationLoading(true);
                                            identifierMutation.mutate();
                                        } else if (urlType === "file") {
                                            setCreateDocumentationLoading(true);
                                            fileMutation.mutate();
                                        } else {
                                            alert("Invalid URL");
                                        }
                                    }}
                                    disabled={createDocumentationLoading}
                                >
                                    {createDocumentationLoading ? (
                                        <div className="flex justify-center items-center">
                                            <LoadingSpinner />
                                        </div>
                                    ) : (
                                        "Create Documentation"
                                    )}
                                </Button>
                                <AlertDialog
                                    open={confirmRepo !== null}
                                    onOpenChange={(open) => {
                                        if (!open) {
                                            setConfirmRepo(null);
                                        }
                                    }}
                                >
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            We have identified {confirmRepo?.length} files to document. Do you want to continue?
                                        </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel onClick={() => {
                                            if (confirmRepo) {
                                                deleteRepoMutation.mutate(confirmRepo.id);
                                            }
                                        }}>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => {
                                            confirmRepoMutation.mutate();
                                            setConfirmRepo(null);
                                        }}>Continue</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Line seperator */}
                <div className="flex flex-col">
                    <div style={{flex: 1}}/>
                    <div className="w-[2px] bg-slate-300" style={{flex: 7}}></div>
                    <div style={{flex: 1}}/>
                </div>
                {/* Right Section */}
                <div className="flex justify-center" style={{flex: 4}}>
                    <div className="flex flex-col w-9/12">
                        <div style={{flex: 1}}/>
                        <div className="flex flex-col items-center justify-between" style={{flex: 7}}>
                            <p className="text-xl font-light mt-2">
                                Want to write your own documentation? You can start from scratch with our powerful documentation 
                            </p>
                            <Button variant="outline" size="lg" className="text-lg w-1/2 mb-[9px] overflow-hidden whitespace-nowrap overflow-ellipsis">Start From Scratch</Button>
                        </div>
                        <div style={{flex: 1}}/>
                    </div>
                </div>
            </div>
            {/* My Docs */}
            <div className="bg-light-purple flex flex-col flex-1 py-3 px-8">
                <h1 className="text-3xl tracking-wide font-semibold mb-4">My docs</h1>
                <div className='flex flex-wrap gap-10 justify-start'>
                    {myDocsHandler()}
                </div>
            </div>

        </div>
    );
};

const MyDocsCard = ({name, id, status, deleteHandler}: {name: string, id: string, status: string, deleteHandler: () => void}) => {
    const navigate = useNavigate();
    const generateUrl = () => {
        // Get current url
        const url = window.location.href;
        // Remove the trailing "/dashboard"
        const urlArray = url.split("/");
        urlArray.pop();
        // Join the "id" to the url in the format "docs/repo/id"
        return urlArray.join("/") + `/docs/repo/${id}`;
    }
    return (
        <ContextMenu>
            <ContextMenuTrigger>
                <div 
                    className="flex flex-col w-[25rem] h-40 p-2 bg-slate-100 border-2 border-slate-800 rounded-lg hover:bg-light-purple"
                    onClick={() => navigate(`/docs/repo/${id}`)}
                >
                    <div className="flex justify-between gap-2">
                        <Icon icon="devicon:github" width={32} height={32} />
                        <div className="flex flex-col gap-2">
                            <h1 className='text-2xl font-light'>{name}</h1>
                            <p className='text-sm font-light'>{generateUrl()}</p>
                        </div>
                    </div>
                    <div className='flex flex-col flex-1 justify-center'>
                        <h2 className='text-sm font-light text-slate-600'>Status</h2>
                        <div className="flex gap-2 items-center">
                            <div className={`w-4 h-4 rounded-full ${status === 'FAILED' ? 'bg-red-500' : status === 'COMPLETED' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                            <p className="text-sm font-light capitalize">{status.toLowerCase()}</p>
                        </div>
                    </div>
                </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem onClick={deleteHandler}>Delete</ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    );
}

export default DashboardPage;