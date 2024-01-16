import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { eventTypes } from './useToolbarIconsList';
import {
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
} from 'lexical';

const useOnClickListener = () => {
  const [editor] = useLexicalComposerContext();

  const onClick = (e: string) => {
    if (e === eventTypes.formatBold)
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');

    if (e === eventTypes.formatItalic)
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');

    if (e === eventTypes.formatUnderline)
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');

    if (e === eventTypes.formatAlignLeft)
      editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');

    if (e === eventTypes.formatAlignCenter)
      editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');

    if (e === eventTypes.formatAlignRight)
      editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');

    if (e === eventTypes.formatUndo)
      editor.dispatchCommand(UNDO_COMMAND, undefined);

    if (e === eventTypes.formatRedo)
      editor.dispatchCommand(REDO_COMMAND, undefined);
  };

  return { onClick };
};

export default useOnClickListener;