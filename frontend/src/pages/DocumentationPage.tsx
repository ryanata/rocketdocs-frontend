import React, { useContext, useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { getAuth } from "firebase/auth";
import Sidebar from '@/components/sidebar';
import Editor from '@/components/editor';
import { DocumentationContext } from '@/utils/Context';
import { fetchDoc, fetchRepo } from '@/utils/apiUtils';
import { DocType } from '@/utils/typeUtils';

const DocumentationPage: React.FC = () => {
    const { docType, id } = useParams<{ docType: DocType, id: string }>(); // Get the id from the URL
    const { setSelectedFile, setDocumentation, setToken } = useContext(DocumentationContext);
    const [stillFetching, setStillFetching] = useState(true);
    const auth = getAuth();
    const user = auth.currentUser;

    const getDocumentation = async (docType: string, id: string) => {
        const token = await user?.getIdToken();
        setToken(token || '');
        const response = (docType === 'file') ? await fetchDoc(id, token || '') : await fetchRepo(id, token || '');
        return response;
    };

    const { data: doc, error, isLoading, refetch } = useQuery(
        [id], 
        () => getDocumentation(docType || '', id || ''),
        { enabled: !!id, staleTime: Infinity }
    );

    const isReady = () => {
        const documentStatus = docType === 'file' ? doc?.status : doc?.repo?.status;
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
            if (docType === 'file') {
                setSelectedFile(doc?.id);
                setDocumentation(doc?.markdown_content);
            }
            else {
                setSelectedFile(doc?.repo.tree[0].id); // high-level repo root directory
            }
        }
    }, [doc]);
    
    if (error) {
        return <div>Something went wrong...</div>;
    }

    if (isLoading || !isReady()) {
        return <div>Loading...</div>;
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