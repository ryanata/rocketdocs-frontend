import React, { useState } from 'react';
import Sidebar from '@/components/sidebar';
import Editor from '@/components/editor';

const DocumentationPage: React.FC = () => {
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [documentation, setDocumentation] = useState<string | null>(null);


    const handleSetSelectedItem = (item: string | null) => {
        setSelectedItem(item);
        // Additional logic or side effects can be added here
        // Side effects can include calling an API to get the documentation for the selected item
        
        // TODO: Call API to get documentation for the selected item. For now, use random text
        const randomDocumentation = "# Test\n**Lorem ipsum dolor sit amet**, \nconsectetur adipiscing elit. Nulla nec nunc euismod, tincidunt libero vitae, aliquet quam. Suspendisse potenti. Nulla facilisi. Sed euismod, neque quis lacinia efficitur, massa nunc aliquet justo, ut luctus metus tortor ut quam. Vivamus euismod, dolor sed tincidunt porta, sapien risus tristique nisl, ut luctus nisi nibh ut libero. Donec id augue sit amet nunc varius luctus. Nulla facilisi. Sed id eros nec sapien lacinia tempus. Nullam auctor, nunc sed ultrices commodo, libero nunc pharetra sem, ut ultricies nisl sem vel tellus. Donec non nunc vel nisl congue ultricies. Nulla facilisi. Sed id eros nec sapien lacinia tempus. Nullam auctor, nunc sed ultrices commodo, libero nunc pharetra sem, ut ultricies nisl sem vel tellus. Donec non nunc vel nisl congue ultricies. ##mydocs";
        setDocumentation(randomDocumentation);
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