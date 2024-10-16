import classNames from 'classnames';
import style from './shimmer-list.module.css';

export default function ShimmerList({
  itemSize,
  width,
  height,
}: {
  itemSize: number;
  width: number;
  height: number;
}) {
  const numRows = Math.floor(height / itemSize);
  const rows = Array.from({length: numRows}, (_, i) => i);
  return (
    <div
      style={{
        width,
        height,
      }}
    >
      {rows.map(row => (
        <div
          className={classNames('row', 'shimmerBG', style.shimmerLine)}
          key={row}
          style={{
            height: itemSize,
          }}
        ></div>
      ))}
    </div>
  );
}
