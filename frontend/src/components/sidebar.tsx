import * as React from "react"
import { useState } from "react";
import { useQueryClient } from "react-query";
import { useParams, useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Icon } from "@iconify/react";

const Sidebar: React.FC = () => {
    const { repoId, fileId } = useParams<{ repoId?: string, fileId: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const response: any = queryClient.getQueryData([repoId ? repoId : fileId])

    const getFileNameFromPath = (path: string) => {
        const parts = path.split('/');
        return parts[parts.length - 1];
    }

    const selectFileHandler = (id: string) => {
        if (fileId !== id) { // file-docs only have 1 file, so it will never enter this condition
            navigate(`/docs/repo/${repoId}/${id}`);
        }
    }

    const createChildrenAndCheckExpansion = (node: any, fileId: string | undefined): [boolean, JSX.Element[]] => {
        let isExpanded = false;
        const children = node.children.map((child: any) => {
            const [childIsSelected, childComponent] = createFileTree(child);
            isExpanded = isExpanded || childIsSelected;
            return childComponent;
        });
    
        // If the selected item is the current folder, expand it
        isExpanded = isExpanded || node.id === fileId;
    
        return [isExpanded, children];
    }

    const createFileTree = (node: any): [boolean, JSX.Element] => {
        const isSelected = node.id === fileId;

        if (node.type === "dir") {
            const [isExpanded, children] = createChildrenAndCheckExpansion(node, fileId);

            return [
                isExpanded,
                <Folder name={getFileNameFromPath(node.path)} id={node.id} clickHandler={selectFileHandler} isSelected={isSelected} isExpanded={isExpanded} key={node.id}>
                    {children}
                </Folder>
            ];
        } else if (node.type === "file") {
            return [
                isSelected,
                <File name={getFileNameFromPath(node.path)} id={node.id} clickHandler={selectFileHandler} isSelected={isSelected} key={node.id}/>
            ];
        }
        return [false, <></>];
    }
    
    // rest of the code...

    return (
        <ScrollArea className="fixed" style={{background: "linear-gradient(270deg, #EBEBF0 0%, rgba(246, 245, 251, 0.33) 37.5%, #F6F5FB 100%)"}}>
            <div className="flex flex-col mt-4 ml-2 mr-4">
                {repoId ?
                    response?.repo.tree[0].children.map((child: any) => {
                        const [_, childComponent] = createFileTree(child);
                        return childComponent;
                    })
                    :
                    (
                        <File name={getFileNameFromPath(response?.relative_path)} id={response?.id} clickHandler={selectFileHandler} isSelected={response.id === fileId}/>
                    )
                }
            </div>
        </ScrollArea>
    )
}

type FileProps = {
    name: string,
    id: string,
    isSelected: boolean,
    clickHandler: (id: string) => void,
};  

const File = ({name, id, clickHandler, isSelected}: FileProps) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={`flex gap-2 rounded-md px-4 ${(!isSelected) ? 'cursor-pointer' : ''} ${(isSelected || isHovered) ? 'bg-light-purple' : ''}`} 
            onClick={() => {clickHandler(id)}}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            data-identifier={id}
        >
            <div className="bg-light-purple" style={{ width: "2px" }}></div>
            <p className="text-gray-500 text-xl py-2 truncate max-w-fit" title={name}>{name}</p>
        </div>
    )
}

type FolderProps = {
    name: string,
    id: string,
    isSelected: boolean,
    isExpanded: boolean,
    clickHandler: (id: string) => void,
    children?: React.ReactNode,
};

const Folder = ({ name, id, isSelected, isExpanded, clickHandler, children }: FolderProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const [closedFolder, setClosedFolder] = useState(false);

    return (
        <>
            <div
                className={`flex gap-2 rounded-md px-4 ${(!isSelected) ? 'cursor-pointer' : ''} ${(isSelected || isHovered) ? 'bg-light-purple' : ''}`} 
                onClick={() => {
                    if (isSelected) {
                        setClosedFolder(!closedFolder);
                    } else {
                        // Display the folder documentation
                        clickHandler(id);
                    }
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                data-identifier={id}
            >
                <div className="bg-light-purple" style={{ width: "2px" }} />
                <div className="flex justify-between w-full">
                    <p className="text-gray-500 text-xl py-2 truncate max-w-fit" title={name}>{name}</p>
                    <div className="flex items-center">
                        {(isExpanded && !closedFolder) ? <Icon icon="mdi:chevron-down" className="text-xl" />: <Icon icon="mdi:chevron-right" className="text-xl" />}
                    </div>
                </div>
            </div>
            {(isExpanded && !closedFolder) && (
                <div className="flex flex-col pl-2">
                    {children}
                </div>
            )}
        </>
    )
}

export default Sidebar;