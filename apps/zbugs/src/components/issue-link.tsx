import {Link, type Props as LinkProps} from './link.js';

export default function IssueLink({
  issue,
  title,
  children,
  className,
  searchParams,
}: {
  issue: {id: string; shortID?: number | undefined};
  searchParams: URLSearchParams;
} & Omit<LinkProps, 'href'>) {
  return (
    <Link
      href={issueUrl(issue, searchParams)}
      title={title}
      className={className}
    >
      {children}
    </Link>
  );
}

export function issueUrl(
  issue: {id: string; shortID?: number | undefined},
  search: URLSearchParams | string,
) {
  const searchStr = search.toString();
  return (
    `/issue/${issue.shortID ?? issue.id}` +
    (searchStr.length > 0 ? '?' + searchStr : '')
  );
}
