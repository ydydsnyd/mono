import type {UndoManager} from '@rocicorp/undo';
import {memo, useCallback, useMemo, useState, type CSSProperties} from 'react';
import {FixedSizeList, ListOnItemsRenderedProps} from 'react-window';
import {Zero, and, exp, or} from 'zero-client';
import type {Collections} from './app.js';
import {useQuery} from './hooks/use-query.js';
import {useZero} from './hooks/use-zero.js';
import type {Issue} from './issue.js';

interface ListData {
  getItem(index: number): Issue | undefined;
}

function simplifyDate(date: number | undefined): number | undefined {
  if (date === undefined) {
    return undefined;
  }
  return date / 100_000;
}

function RawRow({
  index,
  style,
  data,
}: {
  index: number;
  style: CSSProperties;
  data: ListData;
}) {
  const item = data.getItem(index);
  if (!item) {
    return <div style={style}>Loading... {index}</div>;
  }
  return (
    <div
      className="ListItem"
      style={{...style, display: 'flex', alignItems: 'center'}}
    >
      <span
        style={{
          padding: 3,
          flex: '0 0 30px',
          justifyContent: 'end',
        }}
      >
        {index}
      </span>
      <span
        style={{
          padding: 3,
          flex: '0 0 100px',
        }}
      >
        {simplifyDate(item.created)}
      </span>
      <span
        style={{
          padding: 3,
          flex: '0 0 100px',
          width: 150,
          whiteSpace: 'nowrap',
        }}
      >
        {item.id}
      </span>
      <span
        style={{
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          flex: 1,
          padding: 3,
        }}
      >
        {item.title}
      </span>
    </div>
  );
}

const Row = memo(RawRow);

const issueFields = [
  'issue.id',
  'issue.title',
  'issue.priority',
  'issue.status',
  'issue.modified',
  'issue.created',
  'issue.creatorID',
  'issue.kanbanOrder',
  'issue.description',
] as const;

export function App2(_props: {undoManager: UndoManager}) {
  const itemCount = 10_000;
  const height = 600;
  const itemSize = 30;
  // const itemsInViewport = height / itemSize;
  const pageSize = 100; //itemsInViewport * 5;

  const zero = useZero<Collections>();

  const qAsc = useMemo(
    () => zero.query.issue.select(...issueFields).asc('issue.created'),
    [zero],
  );
  const qDesc = useMemo(
    () => zero.query.issue.select(...issueFields).desc('issue.created'),
    [zero],
  );

  const min = useMin(zero);
  const max = useMax(zero);

  const [pageBoundaryVirtualIndex, setPageBoundaryVirtualIndex] = useState(0);
  const [pageBoundaryDate, setPageBoundaryDate] = useState(0);
  const [pageBoundaryItem, setPageBoundaryItem] = useState<Issue>();

  const page0 = useQuery(
    pageBoundaryItem
      ? qDesc
          .where(
            or(
              exp('issue.created', '<', pageBoundaryItem.created),
              and(
                exp('issue.created', '<=', pageBoundaryItem.created),
                exp('issue.id', '<', pageBoundaryItem.id),
              ),
            ),
          )
          .limit(pageSize)
      : qAsc.where('issue.created', '<', pageBoundaryDate).limit(pageSize),
    [pageBoundaryItem, pageBoundaryDate, pageSize, qAsc],
  ).toReversed();
  const page1 = useQuery(
    pageBoundaryItem
      ? qAsc
          .where(
            or(
              exp('issue.created', '>', pageBoundaryItem.created),
              and(
                exp('issue.created', '=', pageBoundaryItem.created),
                exp('issue.id', '>=', pageBoundaryItem.id),
              ),
            ),
          )
          .limit(pageSize + 1)
      : qAsc.where('issue.created', '>=', pageBoundaryDate).limit(pageSize + 1),
    [pageBoundaryItem, pageBoundaryDate, pageSize, qAsc],
  );

  const reprItem = (item: Issue | undefined) => {
    if (!item) {
      return undefined;
    }
    return [simplifyDate(item.created), item.id, item.title];
  };

  console.log('states', {
    'min': simplifyDate(min),
    'max': simplifyDate(max),
    pageBoundaryVirtualIndex,
    'pageBoundaryDate': simplifyDate(pageBoundaryDate),
    'page0.length': page0.length,
    'page0.at(0).[created, id, title]': reprItem(page0.at(0)),
    'page0.at(-2).[created, id]': reprItem(page0.at(-2)),
    'page0.at(-1).[created, id]': reprItem(page0.at(-1)),
    'page1.length': page1.length,
    'page1.at(0).[created, id]': reprItem(page1.at(0)),
    'page1.at(-2).[created, id]': reprItem(page1.at(-2)),
    'page1.at(-1).[created, id]': reprItem(page1.at(-1)),
  });

  // const allItems = useQuery(q);

  const itemData = {
    getItem(virtualIndex: number) {
      if (virtualIndex >= pageBoundaryVirtualIndex) {
        return page1[virtualIndex - pageBoundaryVirtualIndex];
      }
      // page0 starts at pageBoundaryVirtualIndex - pageSize
      // index into page0
      return page0[virtualIndex - (pageBoundaryVirtualIndex - pageSize)];
    },
  };

  const allItems = useQuery(qAsc, [qAsc]);
  const allItemData = useMemo(
    () => ({
      getItem(virtualIndex: number) {
        return allItems[virtualIndex];
      },
    }),
    [allItems],
  );

  const onItemsRendered = useCallback(
    (props: ListOnItemsRenderedProps) => {
      const {visibleStartIndex} = props;
      const virtualIndex = visibleStartIndex;
      const ratio = virtualIndex / itemCount;
      if (visibleStartIndex > pageBoundaryVirtualIndex + pageSize) {
        // outside existing pages
        // reset pages using proportional method
        const boundaryDate = (max - min) * ratio + min;
        console.log(
          'outside existing pages - reset pages using proportional method',
          boundaryDate,
          virtualIndex,
        );
        setPageBoundaryItem(undefined);
        setPageBoundaryDate(boundaryDate);
        setPageBoundaryVirtualIndex(virtualIndex);
      } else if (visibleStartIndex < pageBoundaryVirtualIndex - pageSize) {
        // outside existing pages
        // reset pages using proportional method
        const boundaryDate = (max - min) * ratio + min;
        console.log(
          'outside existing pages - reset pages using proportional method',
          boundaryDate,
          virtualIndex,
        );
        setPageBoundaryItem(undefined);
        setPageBoundaryDate(boundaryDate);
        setPageBoundaryVirtualIndex(virtualIndex);
      } else if (visibleStartIndex > pageBoundaryVirtualIndex + pageSize / 2) {
        // load next page starting from pageBoundary + pagesize
        if (page1.length === 0) {
          return;
        }
        const boundaryDate = page1[page1.length - 1].created;
        console.log(
          'load next page starting from pageBoundary + pagesize',
          boundaryDate,
          virtualIndex,
        );
        setPageBoundaryItem(page1[page1.length - 1]);
        setPageBoundaryDate(boundaryDate);
        setPageBoundaryVirtualIndex(virtualIndex + pageSize / 2 - 1);
      } else if (visibleStartIndex < pageBoundaryVirtualIndex - pageSize / 2) {
        // load previous page starting from pageBoundary - pagesize
        if (page0.length === 0) {
          return;
        }
        const boundaryDate = page0[0].created;
        console.log(
          'load previous page starting from pageBoundary - pagesize',
          boundaryDate,
          virtualIndex,
        );
        setPageBoundaryItem(page0[0]);
        setPageBoundaryDate(boundaryDate);
        setPageBoundaryVirtualIndex(virtualIndex - pageSize / 2);
      }
    },
    [max, min, page0, page1, pageBoundaryVirtualIndex, pageSize],
  );

  const width = 400;

  return (
    <div style={{display: 'flex', flexDirection: 'row'}}>
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <h2 style={{fontSize: '20px', textAlign: 'center', padding: '10px'}}>
          New Virtual Scroll
        </h2>
        <FixedSizeList
          className="List"
          height={height}
          width={width}
          itemCount={itemCount}
          itemSize={itemSize}
          itemData={itemData}
          onItemsRendered={onItemsRendered}
          // ref={ref}
          overscanCount={0}
        >
          {Row}
        </FixedSizeList>
      </div>
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <h2 style={{fontSize: '20px', textAlign: 'center', padding: '10px'}}>
          Old Reference List
        </h2>
        <FixedSizeList
          className="List"
          height={height}
          width={width}
          itemCount={allItems.length}
          itemSize={itemSize}
          itemData={allItemData}
          // onItemsRendered={onItemsRendered}
          // ref={ref}
          overscanCount={0}
        >
          {Row}
        </FixedSizeList>
      </div>
    </div>
  );
}

function useMin(zero: Zero<Collections>): number {
  const rows = useQuery(
    zero.query.issue
      .select(...issueFields)
      .asc('issue.created')
      .limit(1),
  );
  if (rows.length === 0) {
    return 0;
  }
  return rows[0].created;
}

function useMax(zero: Zero<Collections>): number {
  const rows = useQuery(
    zero.query.issue
      .select(...issueFields)
      .desc('issue.created')
      .limit(1),
  );
  if (rows.length === 0) {
    return 0;
  }
  return rows[0].created;
}
