
export interface Pressroom {
  id: number;
  pressroom_name: string;
  source_name: string;
  source_id: number;
  header: string;
  description: string;
  all_tags_formatted: Tag[];
}

export interface Tag {
  name_for_pressroom: string;
  level: number;
}
