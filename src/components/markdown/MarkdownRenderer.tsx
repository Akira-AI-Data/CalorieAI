'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { CodeBlock } from './CodeBlock';
import { Components } from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
}

const components: Components = {
  code: ({ className, children, ...props }) => {
    return <CodeBlock className={className} {...props}>{children}</CodeBlock>;
  },
  table: ({ children }) => (
    <div className="overflow-x-auto my-3">
      <table className="min-w-full border border-border text-sm">
        {children}
      </table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-border px-3 py-2 bg-sidebar-bg text-left font-medium">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-border px-3 py-2">{children}</td>
  ),
};

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose max-w-none text-foreground text-[15px] leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
