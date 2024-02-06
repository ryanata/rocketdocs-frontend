import { useState, useContext, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Icon } from '@iconify/react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
    $convertFromMarkdownString,
    TRANSFORMERS,
} from '@lexical/markdown';
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { LinkNode } from '@lexical/link'
import { ListItemNode, ListNode } from '@lexical/list'
import { MarkNode } from '@lexical/mark'
import {HorizontalRuleNode} from '@lexical/react/LexicalHorizontalRuleNode';
import { CodeNode } from '@lexical/code';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import Toolbar from '@/plugins/toolbar/Toolbar';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { DocumentationContext } from '@/utils/Context';
import { useParams } from 'react-router-dom';
import { DocType } from '@/pages/DocumentationPage';
import { fetchDoc, fetchRepoDoc } from '@/utils/apiUtils';
import { useQuery } from 'react-query';

type LexicalEditorProps = {
  config: Parameters<typeof LexicalComposer>['0']['initialConfig'];
  isEditorVisible: boolean;
  setEditorVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const LexicalEditor = (props: LexicalEditorProps) => {
  return (
    <LexicalComposer initialConfig={props.config}>
        <div className="flex flex-col gap-4">
            <div className="inline-flex justify-end p-4">
                <ToggleEditable isEditorVisible={props.isEditorVisible} setEditorVisible={props.setEditorVisible} />
            </div>
            {props.isEditorVisible && <Toolbar />}
            <div className={`${props.isEditorVisible ? "border-stone-300 border-2 rounded" : ""}`}>
              <RichTextPlugin
                contentEditable={<ContentEditable />}
                placeholder={<Placeholder />}
                ErrorBoundary={LexicalErrorBoundary}
              />
              <ListPlugin />
              <HistoryPlugin />
              <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
            </div>
        </div>
    </LexicalComposer>
  );
}

const ToggleEditable = ({ isEditorVisible, setEditorVisible }: { isEditorVisible: boolean, setEditorVisible: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const [editor] = useLexicalComposerContext();

    const toggleEditing = (status: boolean) => {
        setEditorVisible(status);
        editor.setEditable(status);
    }

    return (
        <Button 
          className={`${isEditorVisible ? 'bg-red-200 hover:bg-red-100' : ''}`} 
          variant={isEditorVisible ? 'empty' : 'default'}
          onClick={() => toggleEditing(!isEditorVisible)}
        >
            <div className='mr-2'>
              {isEditorVisible ? <Icon icon="bx:hide" /> : <Icon icon="bx:edit" />}
            </div>
            {isEditorVisible ? 'Hide' : 'Show'} Editor
        </Button>
    );
}

const Placeholder = () => {
  return (
    <div className="absolute top-[1.125rem] left-[1.125rem] opacity-50">
      Start writing...
    </div>
  );
};

const Editor = () => {
  const [isEditorVisible, setEditorVisible] = useState<boolean>(false);
  const { docType, id } = useParams<{ docType: DocType, id: string }>();
  const { documentation, selectedFile, token, setDocumentation } = useContext(DocumentationContext);
  
  const { data: doc, error, isLoading, refetch } = useQuery(
    [selectedFile], 
    () => {
      if (docType === 'file') {
        return fetchDoc(selectedFile, token);
      }
      return fetchRepoDoc(id || '', selectedFile, token);
    },
    { enabled: !!selectedFile, staleTime: Infinity }
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (doc?.status !== 'COMPLETED') {
        refetch();
      }
    }, 2000);

    return () => clearInterval(intervalId); // Clean up on unmount
  }, [doc, refetch]);

  useEffect(() => {
    if (doc?.status === 'COMPLETED') {
      setDocumentation(doc?.markdown_content);
    }
  }, [doc]);

  if (error) {
    return <div>Something went wrong...</div>;
  }

  if (isLoading || doc?.status !== 'COMPLETED') {
    return <div>Loading...</div>;
  }

  return (
    <div
      id="editor-wrapper"
      className={
        'relative mx-4 prose prose-slate prose-p:my-0 prose-headings:mb-4 prose-headings:mt-2'
      }
    >
      <LexicalEditor
        key = {documentation}
        config={{
          namespace: 'lexical-editor',
          theme: {
            root: `p-4 h-full min-h-[200px] focus:outline-none`,
            link: 'cursor-pointer',
            text: {
              bold: 'font-semibold',
              underline: 'underline',
              italic: 'italic',
              strikethrough: 'line-through',
              underlineStrikethrough: 'underlined-line-through',
            },
            heading: {
              h1: 'text-4xl font-bold',
              h2: 'text-3xl font-bold',
              h3: 'text-2xl font-bold',
              h4: 'text-xl font-bold',
              h5: 'text-lg font-bold',
              h6: 'text-base font-bold',
            },
            quote: 'border-l-4 border-slate-500 pl-4',
            list: {
              listitem: 'ml-6',
              listitemChecked: 'pl-2',
              listitemUnchecked: 'pl-2 text-orange-600',
              nested: {
                listitem: 'pl-2',
              },
              olDepth: [
                'list-decimal pl-2',
                'list-decimal',
                'list-decimal',
                'list-decimal',
                'list-decimal',
              ],
              ul: 'list-disc pl-2',
            },
          },
          nodes: [ HorizontalRuleNode, CodeNode, MarkNode, HeadingNode, QuoteNode, LinkNode, ListNode, ListItemNode],
          editorState: () => {
            console.log(documentation);
            if (documentation !== null) {
                return $convertFromMarkdownString(documentation, TRANSFORMERS);
            }
            return null;
          },
          onError: error => {
            console.log(error);
          },
        }}
        isEditorVisible={isEditorVisible}
        setEditorVisible={setEditorVisible}
      />
    </div>
  );
}

export default Editor;