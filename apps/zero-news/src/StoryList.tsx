import {useQuery} from './hooks/use-zql';
import {zero} from './zero';
import * as agg from '@rocicorp/zql/src/zql/query/agg.js';

export function StoryList() {
  // Hm, many problems here
  // - If I do a megaquery here, I want to limit how many comments I get
  //   back for each story, but I don't think there's a way to do this.
  // - If I do a megaquery, I want to get the username for each comment too,
  //   but I don't think there's a way to roll that up with the agg.array()
  // - Both of the above make me feel like I really want subqueries - don't
  //   need to invent a whole new system for limits, can just use the limit
  //   that already exists in the query language.
  // - For some reason the query below is returning two duplicate comments
  //   in the aggregate.
  // - I think I don't want to do the megaquery in the first place, I really
  //   want fragments here. Can we jury-rig some ghetto fragments here in
  //   the hook layer to see what it would feel like? I think a fragment
  //   system could possibly also reduce the complexity the query language
  //   needs to support.
  const stories = useQuery(
    zero.query.item
      .leftJoin(zero.query.item, 'c', 'item.id', 'parent_item_id')
      .groupBy('item.id')
      .select(
        'item.id',
        'item.parent_item_id',
        'item.type',
        'item.created_at',
        'item.score',
        'item.text',
        'item.title',
        agg.array('c.id', 'comments'),
      )
      .where('item.type', '=', 1)
      .where('item.deleted', '=', false)
      .where('item.dead', '=', false)
      .desc('item.score')
      .limit(30),
  );
  console.log(stories);
  return <></>;
}
