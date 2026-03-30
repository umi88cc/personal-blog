import React from 'react';
import ReactMarkdown from 'react-markdown';
import { SecretBlock } from './shortcodes/SecretBlock';

interface MarkdownRendererProps {
  content: string;
  hasCommented?: boolean;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, hasCommented }) => {
  // 正则匹配短代码: [login]内容[/login] 或 [reply]内容[/reply]
  const regex = /\[(login|reply)\]([\s\S]*?)\[\/\1\]/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    // 截取短代码之前的普通文本
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: content.slice(lastIndex, match.index) });
    }
    // 提取短代码类型和被包裹的内容
    parts.push({ type: match[1] as 'login' | 'reply', content: match[2] });
    lastIndex = regex.lastIndex;
  }

  // 截取剩余的普通文本
  if (lastIndex < content.length) {
    parts.push({ type: 'text', content: content.slice(lastIndex) });
  }

  return (
    <div className="markdown-body">
      {parts.map((part, index) => {
        if (part.type === 'login' || part.type === 'reply') {
          return (
            <SecretBlock 
              key={index} 
              type={part.type} 
              content={part.content} 
              hasCommented={hasCommented} 
            />
          );
        }
        // 普通文本交给原生的 ReactMarkdown 渲染
        return <ReactMarkdown key={index}>{part.content}</ReactMarkdown>;
      })}
    </div>
  );
};
