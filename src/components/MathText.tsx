import katex from 'katex';
import { useMemo } from 'react';

/**
 * Renders text with inline $...$ and display $$...$$ math via KaTeX.
 * Also supports **bold** for mark-distribution keywords. Everything else is escaped.
 */
const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const renderPlain = (s: string) =>
  escape(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-violet-700 dark:text-violet-300">$1</strong>')
    .replace(/\n/g, '<br/>');

export function toHtml(src: string): string {
  const parts: string[] = [];
  // Display math is already a block; surrounding newlines would add empty lines.
  src = src.replace(/\n*(\$\$[\s\S]+?\$\$)\n*/g, '$1');
  const re = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    parts.push(renderPlain(src.slice(last, m.index)));
    const display = m[1] !== undefined;
    parts.push(katex.renderToString(display ? m[1] : m[2], { displayMode: display, throwOnError: false }));
    last = re.lastIndex;
  }
  parts.push(renderPlain(src.slice(last)));
  return parts.join('');
}

export default function MathText({ text, className = '' }: { text: string; className?: string }) {
  const html = useMemo(() => toHtml(text), [text]);
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
