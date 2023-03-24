import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {vscDarkPlus} from 'react-syntax-highlighter/dist/cjs/styles/prism';

const Demo2a = () => {
  const codeString = `export default {
  async increment(tx: WriteTransaction, args: {key: string, delta: number}) {
    console.log(\`Running mutation \${tx.mutationID} from \` +
                \`\${tx.clientID} on \${tx.environment}\`);
    const {key, delta} = args;
    const prev = (await tx.get(key) ?? 0);
    const next = Math.floor(prev + delta, 360);
    tx.put(key, next);
  };
};`;

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

export default Demo2a;
