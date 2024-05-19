export function Header() {
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
      <div>
        <a href="/user?id=aboodman">aboodman</a> (2094)
      </div>
      <div>|</div>
      <div>
        <a href="/logout">logout</a>
      </div>
    </div>
  );
}
