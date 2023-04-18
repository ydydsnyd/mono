import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {vscDarkPlus} from 'react-syntax-highlighter/dist/cjs/styles/prism';

const Demo1b = () => {
  const codeString = `import {Reflect} from "@rocicorp/reflect";
import mutators from "./mutators";
const roomID = "myFirstRoom";

const reflect = new Reflect({
  reflectKey,
  roomID,
  mutators,
});

reflect.subscribe(tx => tx.get("foo"), val => {
  console.log(\`Key "foo" changed to: \${val}\`);
});

button.onclick = () => reflect.mutate.increment({key: "foo", delta: 2});`;
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

export default Demo1b;
