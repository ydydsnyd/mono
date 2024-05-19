export type Item = {
  id: string;
  deleted: boolean;
  type: string;
  user_id: string;
  created_at: number;
  updated_at: number;
  title: string;
  text: string;
  dead: boolean;
  parent_item_id: string;
  url: string;
  score: number;
};
