import React, { useContext, useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { getAuth } from "firebase/auth";
import Sidebar from '@/components/sidebar';
import Editor from '@/components/editor';
import { DocumentationContext } from '@/utils/Context';
import { fetchDoc, fetchRepo } from '@/utils/apiUtils';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const DocumentationPage: React.FC = () => {
    const { repoId, fileId } = useParams<{ repoId?: string, fileId: string }>();
    const { setSelectedFile, setDocumentation, setToken } = useContext(DocumentationContext);
    const [stillFetching, setStillFetching] = useState(true);
    const auth = getAuth();
    const user = auth.currentUser;

    // const getDocumentation = async (docType: string, id: string) => {
    //     const token = await user?.getIdToken();
    //     setToken(token || '');
    //     const response = (docType === 'file') ? await fetchDoc(id, token || '') : await fetchRepo(id, token || '');
    //     return response;
    // };
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
        if (isReady() && stillFetching) {
            setStillFetching(false);
            if (repoId) {
                setSelectedFile(doc?.repo.tree[0].id); // high-level repo root directory
            }
            else {
                setSelectedFile(doc?.id);
                setDocumentation(doc?.markdown_content);
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
        <div style={{ display: 'grid', gridTemplateColumns: '20% 80%' }}>
            <Sidebar />
            <div>
                <Editor/>
            </div>
        </div>
    );
};

export default DocumentationPage;