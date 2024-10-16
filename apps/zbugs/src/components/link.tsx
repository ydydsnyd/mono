import type {ReactNode} from 'react';
import {useNavigate} from 'react-router-dom';

/**
 * The Link from wouter uses onClick and there's no way to change it.
 * We like mousedown here at Rocicorp.
 */
export function Link({
  children,
  href,
  className,
  title,
}: {
  children: ReactNode;
  href: string;
  className?: string;
  title?: string;
}) {
  const navigate = useNavigate();
  const isPrimary = (e: React.MouseEvent) => {
    if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || e.button !== 0) {
      return false;
    }
    return true;
  };
  const onMouseDown = (e: React.MouseEvent) => {
    if (isPrimary(e)) {
      navigate(href);
    }
  };
  const onClick = (e: React.MouseEvent) => {
    if (isPrimary(e) && !e.defaultPrevented) {
      e.preventDefault();
    }
  };

  return (
    <a
      href={href}
      title={title}
      onMouseDown={onMouseDown}
      onClick={onClick}
      className={className}
    >
      {children}
    </a>
  );
}
