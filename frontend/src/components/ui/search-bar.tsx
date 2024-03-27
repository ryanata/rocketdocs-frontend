import { useContext, useState, useEffect, useRef, forwardRef } from 'react';
import {useDebounced} from '../../utils/useDebounce';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import { searchRepo } from "../../utils/apiUtils";
import { DocumentationContext } from '@/utils/Context';
import { Icon } from '@iconify/react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

type SearchResultType = {
    doc_id: string;
    score: number;
    chunk_content: string;
};

type FlattenedTreeType = Record<string, { path: string, type: "file" | "dir" }>;
type SearchResultCacheType = Record<string, SearchResultType[]>;

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [open, setOpen] = useState(false);
    const [flattenedTree, setFlattenedTree] = useState<FlattenedTreeType>({});
    const [searchResults, setSearchResults] = useState<SearchResultType[]>([]);
    const [cachedResults, setCachedResults] = useState<SearchResultCacheType>({});
    const [events, setEvents] = useState<any[]>([]);
    const resultRefs = useRef<HTMLElement[]>([]);
    const debouncedSearchTerm = useDebounced(searchTerm, 750);
    const { repoId } = useParams<{ repoId?: string }>();
    const { token } = useContext(DocumentationContext);
    const queryClient = useQueryClient();

    const handleTooltipTriggerClick = () => {
        const baseUrl = process.env.NODE_ENV === 'development' ? window.location.origin : 'https://notebites.app';
        const url = new URL(`${baseUrl}/repos/${repoId}/chat`);
        url.searchParams.append('query', searchTerm);
    
        const eventSource = new EventSource(url.toString());
    
        eventSource.onmessage = (event) => {
            setEvents(prevEvents => [...prevEvents, JSON.parse(event.data)]);
        };
    
        eventSource.onerror = (error) => {
            console.error("EventSource failed:", error);
            eventSource.close();
        };
    };

    // Function to add a new ref to the array
    const addToRefs = (el: HTMLElement | null, index: number) => {
        if (el && !resultRefs.current.includes(el)) {
            el.setAttribute('tabindex', '0');
            el.setAttribute('data-search-index', index.toString());
            resultRefs.current.push(el);
        }
    };

    // Helper function to flatten the tree
    const flattenTree = (node: any, result: FlattenedTreeType = {}): FlattenedTreeType => {
        if (node.type === 'file' || node.type === 'dir') {
            result[node.id] = { path: node.path, type: node.type };
        }
        if (node.children) {
            node.children.forEach((child: any) => flattenTree(child, result));
        }
        return result;
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Check if 'Command' (or 'Control' for Windows) and 'K' keys were pressed
            if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
                // Prevent the default action to avoid unwanted behavior
                event.preventDefault();
                // Toggle the 'open' state
                setOpen(prevOpen => !prevOpen);
            }
        };
    
        // Add event listener
        window.addEventListener('keydown', handleKeyDown);
    
        // Cleanup
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(() => {
        if (searchResults.length === 0) return;
        // Function to handle keydown events
        const handleKeyDown = (event: KeyboardEvent) => {
            // Get the currently focused element
            const focusedElement = document.activeElement;
            const index = parseInt(focusedElement?.getAttribute('data-search-index') || '-1');
            
            // Handle 'ArrowDown' key
            if (event.key === 'ArrowDown') {
                event.preventDefault();
                const nextIndex = (index + 1) % searchResults.length;
                const nextElement = document.querySelector(`[data-search-index="${nextIndex}"]`);
                if (nextElement) {
                    (nextElement as HTMLElement).focus();
                }
                
            }

            // Handle 'ArrowUp' key
            else if (event.key === 'ArrowUp') {
                event.preventDefault();
                const previousIndex = (index - 1 + searchResults.length) % searchResults.length;
                const previousElement = document.querySelector(`[data-search-index="${previousIndex}"]`);
                if (previousElement) {
                    (previousElement as HTMLElement).focus();
                }
            }
        };

        // Add event listener
        window.addEventListener('keydown', handleKeyDown);

        // Cleanup
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [searchResults]);


    useEffect(() => {
        if (debouncedSearchTerm && repoId) {
            // Check if the results are already cached
            const cached = cachedResults[debouncedSearchTerm];
            if (cached) {
                setSearchResults(cached);
            } else {
                // Perform the search operation here with debouncedSearchTerm
                console.log("Searching for " + debouncedSearchTerm);
                searchRepo(token, repoId, debouncedSearchTerm)
                    .then(response => {
                        setSearchResults(response);
                        // Cache the results
                        setCachedResults({ ...cachedResults, [debouncedSearchTerm]: response });
                    })
                    .catch(error => {
                        console.error(error);
                    });
            }
        }
    }, [debouncedSearchTerm, repoId, token, cachedResults]);

    useEffect(() => {
        const response: any = queryClient.getQueryData([repoId]);
        if (response && response.repo && Array.isArray(response.repo.tree)) {
            const newFlattenedTree: FlattenedTreeType = {};
            response.repo.tree.forEach((node: any) => flattenTree(node, newFlattenedTree));
            setFlattenedTree(newFlattenedTree);
        }
    }, [repoId]);
    
    console.log(events)
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="relative border border-slate-300 px-2 py-1 rounded-sm w-72 text-left text-slate-500" onClick={() => setSearchTerm("")}>
                <div className="flex justify-between items-center">
                    <span>Search documentation...</span>
                    <kbd className="pointer-events-none w-7 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                        <span className="text-xs">⌘</span>
                        K
                    </kbd>
                </div>
            </DialogTrigger>
            <DialogContent className="top-[30%] p-0">
                <div 
                    className="flex items-center justify-center border-b border-gray-300" 
                    style={{ 
                        maxWidth: 'inherit'
                    }}
                >
                    <textarea 
                        className="resize-none w-[88%] px-3 pt-2 text-gray-700 focus:outline-none h-10" 
                        placeholder="Search docs" 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)}
                    ></textarea>
                    <TooltipProvider delayDuration={100}>
                        <Tooltip>
                            <TooltipTrigger onClick={handleTooltipTriggerClick}>
                                <div className="flex justify-center items-center w-10 h-10 rounded-full hover:bg-gray-200">
                                    <Icon icon="fluent:bot-sparkle-24-regular" width={28} height={28}/>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p >Ask AI</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                <div className="flex flex-col gap-3 mb-2" style={{ maxWidth: 'inherit' }}>
                    {searchResults.length === 0 ? (
                        <div className="flex justify-center items-center py-8">
                            <p className="text-gray-500 font-light">Start typing to search across your repo's documentation</p>
                            {/* Add more default content here */}
                        </div>
                    ) : (
                        searchResults.map((result, index) => (
                            <SearchResult 
                                key={index}
                                ref={(el) => addToRefs(el, index)}
                                header={flattenedTree[result.doc_id].path || "/"}
                                previewText={result.chunk_content}
                                closeSearchBar={() => setOpen(false)}
                                redirectFileType={flattenedTree[result.doc_id].type}
                                redirectUrl={`/docs/repo/${repoId}/${result.doc_id}`}
                            />
                        ))
                    )}
                </div>
                <div className="py-3 px-3 border-t border-gray-300">
                    <div className="flex items-center gap-5">
                        <div className="flex">
                            <kbd className="border border-gray-400 bg-gradient-to-r from-gray-50 to-gray-300 rounded-sm p-[2px]"><Icon icon="fluent:arrow-enter-left-24-filled" /></kbd>
                            <span className="text-gray-500 font-light text-sm">&nbsp;to select</span>
                        </div>
                        <div className="flex">
                            <div className="flex gap-1">
                                <kbd className="border border-gray-400 bg-gradient-to-r from-gray-50 to-gray-300 rounded-sm p-[2px]"><Icon icon="fluent:arrow-up-24-filled"/></kbd>
                                <kbd className="border border-gray-400 bg-gradient-to-r from-gray-50 to-gray-300 rounded-sm p-[2px]"><Icon icon="fluent:arrow-down-24-filled" /></kbd>
                            </div>
                            <span className="text-gray-500 font-light text-sm">&nbsp;to navigate</span>
                        </div>
                        <div className="flex">
                            <kbd className="border border-gray-400 bg-gradient-to-r from-gray-50 to-gray-300 rounded-sm p-[2px]"><Icon icon="mdi:keyboard-esc" /></kbd>
                            <span className="text-gray-500 font-light text-sm">&nbsp;to close</span>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

interface SearchResultsProps {
    header: string;
    previewText: string;
    closeSearchBar: () => void;
    redirectFileType: "file" | "dir";
    redirectUrl: string;
}

const SearchResult = forwardRef<HTMLDivElement, SearchResultsProps>(({ header, previewText, closeSearchBar, redirectFileType, redirectUrl }, ref) => {    
    const navigate = useNavigate();
    const handleClick = (event: React.MouseEvent | React.KeyboardEvent) => {
        event.preventDefault();
        navigate(redirectUrl);
        closeSearchBar();
    }

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            handleClick(event);
        }
    }

    const iconElement = () => {
        if (redirectFileType == "file") {
            return <Icon icon="solar:document-text-linear" />
        }
        if (redirectFileType == "dir") {
            return <Icon icon="solar:folder-outline" />
        }
    }

    return (
        <div className='rounded-lg px-3 py-1 hover:bg-slate-100 focus:bg-slate-100' ref={ref} onKeyDown={handleKeyDown} tabIndex={0}>
            <a href={redirectUrl} onClick={handleClick}>
                <div className="flex items-center gap-4" style={{ minWidth: '0' }}>
                    <div className="w-8 h-8 border border-slate-500 rounded-md flex justify-center items-center shrink-0">
                        {iconElement()}
                    </div>
                    <div style={{ minWidth: '0' }}>
                        <h2 className="text-lg">{header}</h2>
                        <div>
                            <p className="text-slate-500 tracking-wide truncate" style={{ overflowWrap: 'break-word' }}>{previewText}</p>
                        </div>
                    </div>
                </div>
            </a>
        </div>
    )
});

export {SearchBar};