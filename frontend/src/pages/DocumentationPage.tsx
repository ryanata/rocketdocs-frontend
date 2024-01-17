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

    console.log(doc);


    const handleSetSelectedItem = (item: string | null) => {
        setSelectedItem(item);
        // Additional logic or side effects can be added here
        // Side effects can include calling an API to get the documentation for the selected item
        
        // TODO: Call API to get documentation for the selected item. For now, use random text
        const randomDocumentation = `## Description:
        This python script is a part of pygame library which provides camera functionality using different backends like OpenCV, VideoCapture etc. It has an AbstractCamera class defining the basic camera operations and different backends implementing these operations.`;
        // setDocumentation(randomDocumentation);
        console.log(randomDocumentation);
        
        // Remove starting space
        const docsNoStartingSpace = doc?.content.replace(/^\s+/, '');
        // Remove starting spaces before headings
        const docNoSpacesBeforeHeadings = docsNoStartingSpace.replace(/\n\s*#/g, '\n#');
        setDocumentation(docNoSpacesBeforeHeadings);
    };
    
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '20% 80%' }}>
            <Sidebar selectedItem={selectedItem} setSelectedItem={handleSetSelectedItem}/>
            <div>
                <Editor markdown={documentation}/>
            </div>
        </div>
    );
};

export default DocumentationPage;