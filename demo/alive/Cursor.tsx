import classNames from 'classnames';
import type {ClientModel} from './client-model';

export function Cursor({client}: {client: ClientModel}) {
  return (
    <div
      className={classNames('cursor', {local: false})}
      style={{
        transform: `translate(${client.x}px, ${client.y}px)`,
      }}
    >
      <div className="pointer">
        <svg
          version="1.1"
          viewBox="0 0 20 22"
          x="0px"
          y="0px"
          width="20px"
          height="22px"
        >
          <path
            id="pointer-fill"
            fill={client.color}
            d="M2.6,0.7C2.6,0.3,3,0,3.4,0.2l14.3,8.2C18,8.6,18,9.2,17.6,9.3l-14.3,8.2C3,17.5,2.6,17.2,2.6,16.8V0.7z"
          />
          <path
            fill="none"
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
          <div className="location-name">Kailua, HI</div>
        </div>
      </div>
    </div>
  );
}
