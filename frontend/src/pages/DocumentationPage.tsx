import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { getAuth } from "firebase/auth";
import Sidebar from '@/components/sidebar';
import Editor from '@/components/editor';

const DocumentationPage: React.FC = () => {
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [documentation, setDocumentation] = useState<string | null>(null);
    const { id } = useParams<{ id: string }>(); // Get the id from the URL
    const auth = getAuth();
    const user = auth.currentUser;

    const fetchDocs = async (id: string) => {
        const token = await user?.getIdToken();
        const response = await fetch(`${process.env.NODE_ENV === 'development' ? '/file-docs/' : 'https://notebites.app/file-docs/'}${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        return response.json();
    };

    const { data: doc, error, isLoading, refetch } = useQuery(['fileDocs', id], () => fetchDocs(id || ''), { enabled: !!id, staleTime: Infinity });    
    useEffect(() => {
        const intervalId = setInterval(() => {
            if (doc?.status === "STARTED") {
                refetch();
            }
        }, 2000);

        return () => clearInterval(intervalId); // Clean up on unmount
    }, [doc, refetch]);
    
    if (error) {
        return <div>Something went wrong...</div>;
    }

    if (isLoading || doc?.status === "STARTED") {
        return <div>Loading...</div>;
    }

    const handleSetSelectedItem = (item: string | null) => {
        setSelectedItem(item);
        setDocumentation(doc?.markdown_content);
    };
    
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '20% 80%' }}>
            <Sidebar selectedItem={selectedItem} setSelectedItem={handleSetSelectedItem} fileUrl={doc?.github_url}/>
            <div>
                <Editor markdown={documentation}/>
            </div>
        </div>
    );
};

export default DocumentationPage;