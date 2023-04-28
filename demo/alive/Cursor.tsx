import classNames from 'classnames';
import type {Reflect} from '@rocicorp/reflect';
import type {M} from '../shared/mutators';
import {getClient} from './client-model';
import {useSubscribe} from 'replicache-react';
import {Rect, coordinateToPosition} from './util';
import {useEffect} from 'react';

export function Cursor({
  r,
  clientID,
  home,
  stage,
  isSelf,
}: {
  r: Reflect<M>;
  clientID: string;
  home: Rect;
  stage: Rect;
  isSelf: boolean;
}) {
  const client = useSubscribe(r, async tx => getClient(tx, clientID), null);
  const pos = client && coordinateToPosition(client, home, stage);
  const active =
    !isSelf || (pos && pos.y >= stage.top() && pos.y <= stage.bottom());

  useEffect(() => {
    if (isSelf && typeof active === 'boolean') {
      document.body.classList.toggle('custom-cursor', active);
    }
  }, [isSelf, active]);

  if (!client || !pos) {
    return null;
  }

  return (
    <div
      className={classNames('cursor', {active})}
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`,
      }}
    >
      <svg
        version="1.1"
        viewBox="0 0 20 22"
        x="0px"
        y="0px"
        width="20px"
        height="22px"
      >
        <path
          fill={client.color}
          stroke="#fff"
          d="M6.5,16.7l-3.3-16l14.2,8.2L10.5,11c-0.2,0.1-0.4,0.2-0.5,0.4L6.5,16.7z"
        />
      </svg>
      <div
        className="location"
        style={{
          backgroundColor: client.color,
        }}
      >
        <div className="location-name">{client.location ?? `You 👋`}</div>
      </div>
    </div>
  );
}
