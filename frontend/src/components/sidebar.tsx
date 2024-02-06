import * as React from "react"
import { useState, useContext } from "react";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { DocumentationContext } from "@/utils/Context";
import { ScrollArea } from "@/components/ui/scroll-area"
import { DocType } from "@/utils/typeUtils";
import rocketdocsLogo from '../assets/rocketdocs_logo.svg';

const Sidebar: React.FC = () => {
    const { docType, id } = useParams<{ docType: DocType, id: string }>();
    const { setSelectedFile, selectedFile} = useContext(DocumentationContext);
    const queryClient = useQueryClient();
    const response: any = queryClient.getQueryData([id])

    const getFileNameFromPath = (path: string) => {
        const parts = path.split('/');
        return parts[parts.length - 1];
    }

    const selectFileHandler = (id: string) => {
        if (selectedFile !== id) {
            setSelectedFile(id);
        }
    }

    const isSelected = (id: string) => {
        return selectedFile === id;
    }

    const createFileTree = (node: any) => {
        if (node.type === "dir") {
            return (
                // TODO: Give folder a unique folder handler
                <Folder name={getFileNameFromPath(node.path)} id={node.id} clickHandler={selectFileHandler} isSelected={isSelected}>
                    {node.children.map(createFileTree)}
                </Folder>
            );
        } else if (node.type === "file") {
            return <File name={getFileNameFromPath(node.path)} id={node.id} clickHandler={selectFileHandler} isSelected={isSelected}/>;
        }
    }

    return (
        <div className={`inline-flex flex-col`} style={{background: "linear-gradient(270deg, #EBEBF0 0%, rgba(246, 245, 251, 0.33) 37.5%, #F6F5FB 100%)", height: "100vh"}}>
            <img src={rocketdocsLogo} alt="RocketDocs Logo" className="mx-8" />
            <ScrollArea>
                <div className="flex flex-col mt-8 ml-2 mr-4">
                    {docType === "file" ? (
                        <File name={getFileNameFromPath(response?.relative_path)} id={response?.id} clickHandler={selectFileHandler} isSelected={isSelected}/>
                    ):
                        response?.repo.tree[0].children.map(createFileTree)
                    }
                </div>
            </ScrollArea>
        </div>
    )
}

type FileProps = {
    name: string,
    id: string,
    clickHandler: (id: string) => void,
    isSelected: (id: string) => boolean
};  

const File = ({name, id, clickHandler, isSelected}: FileProps) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={`flex rounded-md px-4 ${(!isSelected(id)) ? 'cursor-pointer' : ''} ${(isSelected(id) || isHovered) ? 'bg-light-purple' : ''}`} 
            onClick={() => {clickHandler(id)}}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            data-identifier={id}
        >
            <div className="bg-light-purple" style={{ width: "2px" }}></div>
            <p className="ml-4 text-gray-500 text-2xl py-2 truncate max-w-fit" title={name}>{name}</p>
        </div>
    )
}

type FolderProps = {
    name: string,
    id: string,
    clickHandler: (id: string) => void,
    isSelected: (id: string) => boolean,
    children?: React.ReactNode,
};

const Folder = ({ name, id, clickHandler, isSelected, children }: FolderProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <>
            <div
                className={`flex rounded-md px-4 ${(!isSelected(id)) ? 'cursor-pointer' : ''} ${(isSelected(id) || isHovered) ? 'bg-light-purple' : ''}`} 
                onClick={() => {
                    // Display the folder documentation
                    clickHandler(id);
                    // Toggle expansion
                    setIsExpanded(!isExpanded);
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                data-identifier={id}
            >
                <div className="bg-light-purple" style={{ width: "2px" }}></div>
                <p className="ml-4 text-gray-500 text-2xl py-2 truncate max-w-fit" title={name}>{name}</p>
            </div>
            {isExpanded && (
                <div className="flex flex-col pl-4">
                    {children}
                </div>
            )}
        </>
    )
}

export default Sidebar;