import {useMemo} from 'react';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import {unified, type Plugin} from 'unified';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type P = Plugin<any, any, any>;

const emptyArray: P[] = [];
export function useMarkdown(text: string, plugins: P[] = emptyArray) {
  return useMemo(
    () => configureUnified(plugins).processSync(text).value.toString(),
    [text, plugins],
  );
}

export function useMarkdownAsync(text: string, plugins: P[] = emptyArray) {
  return useMemo(
    () =>
      configureUnified(plugins)
        .process(text)
        .then(result => result.value.toString()),
    [text, plugins],
  );
}

function configureUnified(plugins: P[]) {
  let u = unified().use(remarkParse);
  for (const plugin of plugins) {
    u = u.use(plugin);
  }
  return u.use(remarkGfm).use(remarkRehype).use(rehypeStringify);
}
