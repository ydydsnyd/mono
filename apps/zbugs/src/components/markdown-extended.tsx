import remarkMermaid from 'remark-mermaidjs';
import {useMarkdownAsync} from '../hooks/use-markdown.js';
import {useEffect, useState} from 'react';

const plugins = [remarkMermaid];
export default function MarkdownExtended({
  children,
  fallback,
}: {
  children: string;
  fallback: string;
}) {
  const mdPromise = useMarkdownAsync(children, plugins);

  const [md, setMd] = useState<string>(fallback);
  useEffect(() => {
    let mounted = true;
    mdPromise.then(result => {
      if (!mounted) {
        return;
      }
      setMd(result);
    });
    return () => {
      mounted = false;
    };
  }, [mdPromise]);

  return <div dangerouslySetInnerHTML={{__html: md}}></div>;
}
