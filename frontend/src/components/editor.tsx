import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
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

type LexicalEditorProps = {
  config: Parameters<typeof LexicalComposer>['0']['initialConfig'];
};

const LexicalEditor = (props: LexicalEditorProps) => {
  const [isEditorVisible, setEditorVisible] = useState<boolean>(false);

  return (
    <LexicalComposer initialConfig={props.config}>
        <div className="flex flex-col gap-4">
            <div className="inline-flex justify-end p-4">
                <ToggleEditable isEditorVisible={isEditorVisible} setEditorVisible={setEditorVisible} />
            </div>
            {isEditorVisible && <Toolbar />}
            <RichTextPlugin
            contentEditable={<ContentEditable />}
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
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
        <Button onClick={() => toggleEditing(!isEditorVisible)}>
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

type EditorProps = {
    markdown: string | null;
};

const Editor = ({ markdown }: EditorProps) => {
    console.log(markdown);
    return (
    <div
      id="editor-wrapper"
      className={
        'relative prose prose-slate prose-p:my-0 prose-headings:mb-4 prose-headings:mt-2'
      }
    >
      <LexicalEditor
        key = {markdown}
        config={{
          namespace: 'lexical-editor',
          theme: {
            root: 'p-4 border-slate-500 border-2 rounded h-full min-h-[200px] focus:outline-none focus-visible:border-black',
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
          },
          nodes: [ HorizontalRuleNode, CodeNode, MarkNode, HeadingNode, QuoteNode, LinkNode, ListNode, ListItemNode],
          editorState: () => {
            console.log(markdown);
            if (markdown !== null) {
                return $convertFromMarkdownString(markdown, TRANSFORMERS);
            }
            return null;
          },
          onError: error => {
            console.log(error);
          },
        }}
      />
    </div>
  );
}

export default Editor;