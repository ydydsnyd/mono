import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {vscDarkPlus} from 'react-syntax-highlighter/dist/cjs/styles/prism';

const Demo2b = () => {
  const codeString = `// Subscribe to changes in Reflect and render your UI reactively.
//
// There’s no need to interpolate. You receive updates at 60fps,
// just as if the collaborator was local.

import {Reflect} from "@rocicorp/reflect";
import mutators from "./mutators";
const authToken = "$your-auth-token";
const roomID = "myFirstRoom";

const r = new Reflect({
  reflectKey,
  authToken,
  roomID,
  mutators, 
});

r.subscribe(tx => tx.get("rotation"), {
  onChange: val => {
    document.querySelector("cube").rotation = val;
  }
});

button.onclick = () => reflect.mutate.increment({key: "rotation", delta: 2});`;

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

export default Demo2b;
