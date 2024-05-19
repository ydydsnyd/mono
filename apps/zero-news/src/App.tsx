import {Zero} from 'zero-client';
import {User} from './user.ts';
import {useQuery} from './hooks/use-zql.ts';
import {Item} from './item.ts';
import {Header} from './Header.tsx';

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
  console.log({items});

  return (
    <div className="w-5/6 mx-auto my-3 bg-stone-200">
      <Header />
      <div>foo bar</div>
    </div>
  );
}

export default App;
