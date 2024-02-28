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
    ElementTransformer,
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
import { fetchDoc, fetchRepoDoc } from '@/utils/apiUtils';
import { useQuery } from 'react-query';
import { ParagraphNode, $createParagraphNode } from 'lexical';
import { LoadingSpinner } from './ui/loading-spinner';

type LexicalEditorProps = {
  config: Parameters<typeof LexicalComposer>['0']['initialConfig'];
  editable: boolean;
  setEditable: React.Dispatch<React.SetStateAction<boolean>>;
};

// Empty lines are converted to <br> tags
const EMPTY_LINE_BREAKS: ElementTransformer = {
  dependencies: [ParagraphNode],
  export: () => { return null; },
  regExp: /^[\n]*$/,
  replace: (_: any, nodes: any, __: any, isImport: any) => {
      if (isImport && nodes.length === 1) {
          nodes[0].replace($createParagraphNode());
      }
  },
  type: "element",
};

const CustomTransformers = [...TRANSFORMERS, EMPTY_LINE_BREAKS];

const LexicalEditor = (props: LexicalEditorProps) => {
  return (
    <LexicalComposer 
      initialConfig={{
      ...props.config,
      editable: props.editable,
    }}>
        <div className="flex flex-col gap-4">
            <div className="inline-flex justify-end p-4">
                <ToggleEditable isEditorVisible={props.editable} setEditorVisible={props.setEditable} />
            </div>
            {props.editable && <Toolbar />}
            <div className={`${props.editable ? "border-stone-300 border-2 rounded" : ""}`}>
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
  const [editable, setEditable] = useState<boolean>(false);
  const { repoId, fileId } = useParams<{ repoId?: string, fileId: string }>();
  const { documentation, token, setDocumentation } = useContext(DocumentationContext);
  
  const { data: doc, error, isLoading } = useQuery(
    [fileId], 
    () => {
      if (repoId) {
        return fetchRepoDoc(repoId, fileId || '', token);
      }
      return fetchDoc(fileId || '', token);
    },
    { enabled: !!repoId || !!fileId, staleTime: Infinity }
  );

  useEffect(() => {
    if (doc?.status === 'COMPLETED') {
      setDocumentation(doc?.markdown_content);
    } else {
      setDocumentation('Could not generate documentation for this file.');
    }
  }, [doc]);

  if (error) {
    return <div>Something went wrong...</div>;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className='flex flex-col justify-center items-center gap-3'>
          <LoadingSpinner />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      id="editor-wrapper"
      className={
        'relative mx-4 prose prose-slate prose-p:my-0 prose-headings:mb-4 prose-headings:mt-2'
      }
    >
      <LexicalEditor
        key={`${fileId}-${documentation}`}
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
            if (documentation !== null) {
                return $convertFromMarkdownString(documentation, CustomTransformers);
            }
            return null;
          },
          onError: error => {
            console.log(error);
          },
        }}
        editable={editable}
        setEditable={setEditable}
      />
    </div>
  );
}

export default Editor;