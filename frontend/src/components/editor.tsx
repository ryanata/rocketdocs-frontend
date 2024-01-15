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
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';

type LexicalEditorProps = {
  config: Parameters<typeof LexicalComposer>['0']['initialConfig'];
};

const LexicalEditor = (props: LexicalEditorProps) => {
  return (
    <LexicalComposer initialConfig={props.config}>
        <div className="flex flex-col gap-4">
            <div className="inline-flex justify-end p-4">
                <ToggleEditable />
            </div>
            <RichTextPlugin
            contentEditable={<ContentEditable />}
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
            />
        </div>
    </LexicalComposer>
  );
}

const ToggleEditable = () => {
    const [isEditorVisible, setEditorVisible] = useState<boolean>(true);
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
          },
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