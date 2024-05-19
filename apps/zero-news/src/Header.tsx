import {useUser} from './hooks/use-user';

export function Header() {
  const user = useUser();
  const score = Math.floor(Math.random() * 10000);

  return (
    <div className="bg-orange-500 flex space-x-2 items-center p-1 pr-2">
      <img
        src="/y18.svg"
        className="h-6 w-6 border-white border"
        alt="Hacker News"
      />
      <a href="/news" className="font-bold grow">
        Zero News
      </a>
      {user ? (
        <>
          <div>
            <a href={`/user?id=${user.id}`}>{user.name}</a> ({score})
          </div>
          <div>|</div>
          <div>
            <a href="/logout">logout</a>
          </div>
        </>
      ) : null}
    </div>
  );
}
