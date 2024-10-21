import {lazy, Suspense} from 'react';
import {useMarkdown} from '../hooks/use-markdown.js';

// Mermaid is a pretty huge library so we're going to lazy load it
const MarkdownExtended = lazy(() => import('./markdown-extended.js'));

export default function Markdown({children}: {children: string}) {
  const text = useMarkdown(children);

  if (children.includes('```mermaid')) {
    return (
      <Suspense fallback={<div dangerouslySetInnerHTML={{__html: text}}></div>}>
        <MarkdownExtended fallback={text}>{children}</MarkdownExtended>
      </Suspense>
    );
  }

  return <div dangerouslySetInnerHTML={{__html: text}}></div>;
}
