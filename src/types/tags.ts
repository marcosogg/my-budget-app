export interface Tag {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
}

export interface TransactionTag {
  transaction_id: string;
  tag_id: string;
  user_id: string;
  created_at: string;
}

export interface CreateTagInput {
  name: string;
}

export interface TagWithCount extends Tag {
  transaction_count: number;
}