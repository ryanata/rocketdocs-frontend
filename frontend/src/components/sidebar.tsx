import * as React from "react"
import { useState, useEffect } from "react";
import rocketdocsLogo from '../assets/rocketdocs_logo.svg';

type SidebarProps = {
    selectedItem: string | null;
    setSelectedItem:(item: string | null) => void;
    className?: string;
};

const Sidebar: React.FC<SidebarProps> = ({ selectedItem, setSelectedItem, className }) => {
    type SidebarItem = {
        heading: string;
        subitems: string[];
    };
    // TODO: Call API to get sidebar items
    const items: SidebarItem[] = [
        { heading: "Getting Started", subitems: ["Introduction", "Installation", "Your first project"] }
    ];

    // Once we have the sidebar items, make the selected item the first subitem of the first heading
    useEffect(() => {
        if (items.length > 0) {
            setSelectedItem(items[0].subitems[0]);
        }
    }, []);

    return (
        <div className={`inline-flex flex-col ${className}`} style={{background: "linear-gradient(270deg, #EBEBF0 0%, rgba(246, 245, 251, 0.33) 37.5%, #F6F5FB 100%)", height: "100vh"}}>
            <img src={rocketdocsLogo} alt="RocketDocs Logo" className="mx-8" />
            <div className="mt-8 ml-6 mr-4">
                {items.map((item) => (
                    <div key={item.heading}>
                        <h1 className="text-2xl font-medium ml-2 text-gray-500">{item.heading}</h1>
                        {item.subitems.map((subitem) => (
                            <SidebarItem key={subitem} label={subitem} isSelected={selectedItem === subitem} onSelected={() => setSelectedItem(subitem)} />
                            ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

const SidebarItem: React.FC<{ label: string, isSelected: boolean, onSelected: () => void }> = ({ label, isSelected, onSelected }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div 
            className={`flex rounded-md px-4 ${(!isSelected) ? 'cursor-pointer' : ''} ${(isSelected || isHovered) ? 'bg-light-purple' : ''}`} 
            onClick={onSelected}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="bg-primary" style={{ width: "2px" }}></div>
            <p className="ml-4 text-gray-500 text-2xl py-2">{label}</p>
        </div>
    )
}

export default Sidebar;