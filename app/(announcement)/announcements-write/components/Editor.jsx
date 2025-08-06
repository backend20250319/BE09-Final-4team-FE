import { useState, useEffect } from "react";
import { $getRoot, $createParagraphNode, $createTextNode, EditorState } from "lexical";
import ExampleTheme from "./themes/ExampleTheme";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
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

import ActionsPlugin from "./plugins/ActionsPlugin";
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin";
import "./style.css";

function Placeholder() {
  return (
    <div className="editor-placeholder">
      내용을 입력하세요
    </div>
  );
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

export default function Editor() {
  const [initialEditorState, setInitialEditorState] = useState(null);

  useEffect(() => {
    async function fetchInitialContent() {
      const res = await fetch("/api/editor-content");
      // const res = {
      //   content: "여기에 초기 에디터 텍스트가 들어갑니다. 더미 데이터예요!",
      // };
  
      
      // const data = await res.json();
      const data = res.json();
      // API에서 받은 텍스트(예: 마크다운 혹은 HTML, 또는 JSON 포맷 등)를 Lexical 에디터 상태로 변환 필요
      // 간단 예시: 기본 텍스트를 paragraph 노드로 생성
      // 더미 데이터를 Lexical 상태로 변환
      const editorState = EditorState.createEmpty();
      editorState.read(() => {
        const root = $getRoot();
        root.clear();
        const paragraph = $createParagraphNode();
        paragraph.append($createTextNode(data.content)); // data.content 는 API로부터 온 텍스트
        root.append(paragraph);
      });
      setInitialEditorState(editorState);
    }
    fetchInitialContent();
  }, []);

  // if (!initialEditorState) {
  //   return <div>로딩 중...</div>;
  // }

  return (
    <LexicalComposer
      initialConfig={{
        ...editorConfigBase,
        editorState: initialEditorState,
      }}
    >
      <div className="editor-container">
        <ToolbarPlugin />
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={<Placeholder />}
          />
          <AutoFocusPlugin />
          <ListPlugin />
          <LinkPlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <CodeHighlightPlugin />
        </div>
      </div>
    </LexicalComposer>
  );
}