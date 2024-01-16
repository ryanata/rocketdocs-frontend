import { Icon } from '@iconify/react';
import { useCallback, useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { mergeRegister } from '@lexical/utils';

export const eventTypes = {
  formatUndo: 'formatUndo',
  formatRedo: 'formatRedo',
  formatBold: 'formatBold',
  formatItalic: 'formatItalic',
  formatUnderline: 'formatUnderline',
  formatAlignLeft: 'formatAlignLeft',
  formatAlignCenter: 'formatAlignCenter',
  formatAlignRight: 'formatAlignRight',
  formatHeadingOne: 'formatHeadingOne',
  formatHeadingTwo: 'formatHeadingTwo',
};

type IconItem = {
    id: number;
    Icon: JSX.Element;
    event: string;
};

const iconsList: IconItem[] = [
    {
        id: 1,
        Icon: <Icon icon="ic:outline-undo" />,
        event: eventTypes.formatUndo,
    },
    {
        id: 2,
        Icon: <Icon icon="ic:outline-redo" />,
        event: eventTypes.formatRedo,
    },
    {
        id: 3,
        Icon: <Icon icon="ic:outline-format-bold" />,
        event: eventTypes.formatBold,
    },
    {
        id: 4,
        Icon: <Icon icon="ic:outline-format-italic" />,
        event: eventTypes.formatItalic,
    },
    {
        id: 5,
        Icon: <Icon icon="ic:outline-format-underlined" />,
        event: eventTypes.formatUnderline,
    },
    {
        id: 6,
        Icon: <Icon icon="ic:outline-format-align-left" />,
        event: eventTypes.formatAlignLeft,
    },
    {
        id: 7,
        Icon: <Icon icon="ic:outline-format-align-justify" />,
        event: eventTypes.formatAlignCenter,
    },
    {
        id: 8,
        Icon: <Icon icon="ic:outline-format-align-right" />,
        event: eventTypes.formatAlignRight,
    },
];

const useIconsList = () => {
  const [icons, setIcons] = useState(
    iconsList.map(i => ({ ...i, active: false })),
  );

  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor); // Borrowed from lexical-playgroun source code: Without activeEditor, icon won't activate when pressed when no text is selected

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return;

    const activeIcons: { id: number; active: boolean }[] = [];

    const appendActiveIcons = (event: string, active: boolean) => {
      const icon = iconsList.find(i => i.event === event);
      if (!icon) return;
      activeIcons.push({ id: icon.id, active });
    };

    appendActiveIcons(
      eventTypes.formatBold,
      selection.hasFormat('bold'),
    );

    appendActiveIcons(
      eventTypes.formatItalic,
      selection.hasFormat('italic'),
    );

    appendActiveIcons(
      eventTypes.formatUnderline,
      selection.hasFormat('underline'),
    );

    setIcons(icons =>
      icons.map(i => {
        const activeIcon = activeIcons.find(a => a.id === i.id);
        const active = activeIcon ? activeIcon.active : i.active;
        return {
          ...i,
          active,
        };
      }),
    );
  }, [activeEditor, setIcons]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        updateToolbar();
        setActiveEditor(newEditor);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );
  }, [editor, updateToolbar]);

  useEffect(() => {
    return mergeRegister(
      // Borrowed from lexical-playgroun source code: Without this, icon won't activate when pressed when no text is selected
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      activeEditor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        payload => {
          setIcons(icons =>
            icons.map(i => ({
              ...i,
              active:
                i.event === eventTypes.formatUndo
                  ? payload
                  : i.active,
            })),
          );
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
      activeEditor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        payload => {
          setIcons(icons =>
            icons.map(i => ({
              ...i,
              active:
                i.event === eventTypes.formatRedo
                  ? payload
                  : i.active,
            })),
          );
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
    );
  }, [updateToolbar, activeEditor, editor]);

  return { icons };
};

export default useIconsList;