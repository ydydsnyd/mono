import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {vscDarkPlus} from 'react-syntax-highlighter/dist/cjs/styles/prism';

const Demo1a = () => {
  const codeString = `export default {
  // _Mutators_ are functions you define to change the datastore.
  //
  // The UI updates *instantly* (in the same frame) when mutators
  // are called. Milliseconds later, Reflect replays the mutator
  // on the server to sync the change.
  //
  // Because of server replay, mutators handle many conflicts
  // naturally. If two client simultaneously increment a counter,
  // the mutator will naturally sum the changes rather than
  // overwrite one.
  async increment(tx, args: {key: string, delta: number}) {
    const {key, delta} = args;
    const prev = (await tx.get(key) ?? 0);
    const next = prev + delta;
    console.log(\`Running mutation \${tx.mutationID} from \` +
                \`\${tx.clientID} on \${tx.environment}: \` +
                \`\${prev} -> \${next}\`);
    await tx.put(key, next);
  },
}`;
  const codeBlock = {
    background: 'transparent',
    paddingLeft: 0,
    paddingRight: 0,
  };

  return (
    <SyntaxHighlighter
      language="typescript"
      showLineNumbers
      customStyle={codeBlock}
      style={vscDarkPlus}
    >
      {codeString}
    </SyntaxHighlighter>
  );
};

export default Demo1a;
