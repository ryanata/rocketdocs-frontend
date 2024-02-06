import React, { createContext, useState } from "react"

interface IDocumentationContext {
    token: string;
    selectedFile: string;
    documentation: string;
    setToken: (token: string) => void;
    setSelectedFile: (file: string) => void;
    setDocumentation: (doc: string) => void;
}
export const DocumentationContext = createContext<IDocumentationContext>({
    token: '',
    selectedFile: '',
    documentation: '',
    setToken: () => {},
    setSelectedFile: () => {},
    setDocumentation: () => {},
});

export const DocumentationProvider = ({ children }: {children: React.ReactElement}) => {
    const [selectedFile, setSelectedFile] = useState<string>('');
    const [documentation, setDocumentation] = useState<string>('');
    const [token, setToken] = useState<string>('');

    const contextValue = {
        token,
        selectedFile,
        documentation,
        setToken,
        setSelectedFile,
        setDocumentation
    };
    return (
        <DocumentationContext.Provider value={contextValue}>
            {children}
        </DocumentationContext.Provider>
    );
};