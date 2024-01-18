import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import Sidebar from '@/components/sidebar';
import Editor from '@/components/editor';

// Define a fetch function
const fetchDocs = async (id: string) => {
    console.log(id);
    const response = await fetch(`/file-docs/${id}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
};

const DocumentationPage: React.FC = () => {
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [documentation, setDocumentation] = useState<string | null>(null);
    const { id } = useParams<{ id: string }>(); // Get the id from the URL
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
        // Remove starting space
        const docsNoStartingSpace = doc?.content.replace(/^\s+/, '');
        // Remove starting spaces before headings
        const docNoSpacesBeforeHeadings = docsNoStartingSpace.replace(/\n\s*#/g, '\n#');
        setDocumentation(docNoSpacesBeforeHeadings);
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