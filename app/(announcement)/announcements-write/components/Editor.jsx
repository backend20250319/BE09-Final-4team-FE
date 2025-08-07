import { useState, useEffect } from "react";
import { $getRoot, $createParagraphNode, $createTextNode, EditorState } from "lexical";
import ExampleTheme from "./themes/ExampleTheme";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin";
import "./style.css";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";

function Placeholder() {
  return (
    <div className="editor-placeholder">
      내용을 입력하세요
    </div>
  );
}

function EditorInitializer({ json }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (json) {
      try {
        const editorState = editor.parseEditorState(json);
        editor.setEditorState(editorState);
      } catch (error) {
        console.error('Failed to parse editor state:', error);
        // Fallback to empty state
        editor.update(() => {
          const root = $getRoot();
          root.clear();
          const paragraph = $createParagraphNode();
          root.append(paragraph);
        });
      }
    }  else {
      // Create empty state more simply
      editor.update(() => {
        const root = $getRoot();
        root.clear();
        const paragraph = $createParagraphNode();
        root.append(paragraph);
        paragraph.select(); // 첫번째 block 선택
      });
    }
  }, [json, editor]);

  return null; // 실제로 렌더링되는 UI는 없음
}

const editorConfigBase = {
  theme: ExampleTheme,
  onError(error) {
    throw error;
  },
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode,
  ],
};

export default function Editor({ jsonData: json, onChange, readOnly = false, showToolbar = true }) {
  const [mounted, setMounted] = useState(false);
  function handleChange(editorState) {
    const jsonString = JSON.stringify(editorState.toJSON());
    onChange?.(jsonString);  // 상위에서 내려온 콜백에 전달
  }
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center p-8 gap-2">
        <div className="w-5 h-5 border-2 border-gray-100 border-t-blue-500 rounded-full animate-spin"></div>
        <span>에디터 로딩 중...</span>
      </div>
    );
  }

  return (
    <LexicalComposer
      initialConfig={{
        ...editorConfigBase,
        editable: !readOnly,
      }}
    >
      <div className="editor-container">
        {showToolbar && <ToolbarPlugin />}
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className={`editor-input bg-transparent ${readOnly ? 'pointer-events-none' : ''}`} />}
            placeholder={<Placeholder />}
          />
          {!readOnly && <AutoFocusPlugin />}
          <ListPlugin />
          <LinkPlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <CodeHighlightPlugin />
          <EditorInitializer json={json} />
        </div>
        {!readOnly && <OnChangePlugin onChange={handleChange} />}
      </div>
    </LexicalComposer>
  );
}