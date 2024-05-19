import './App.css';

import {Zero} from 'zero-client';
import {User} from './user.ts';
import {useQuery} from './hooks/use-zql.ts';
import {Item} from './item.ts';

const z = new Zero({
  server: import.meta.env.VITE_ZERO_URL,
  userID: 'anon',
  kvStore: 'idb',
  queries: {
    user: v => v as User,
    item: v => v as Item,
  },
});

function App() {
  const items = useQuery(
    z.query.item
      .select('id', 'title', 'text', 'created_at', 'score')
      .where('score', '>', 100)
      .desc('created_at')
      .limit(100),
  );

  return (
    <>
      <div>
        {items.map(item => (
          <div key={item.id}>
            <h2>{item.title}</h2>
            <p>{item.text}</p>
            <p>Score: {item.score}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
