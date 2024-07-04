
export interface Pressroom {
  id: number;
  pressroom_name: string;
  source_name: string;
  source_id: number;
  header: string;
  description: string;
  all_tags: Tag[];
}

export interface Tag {
  name: string;
  level: number;
}
