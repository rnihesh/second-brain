export enum KnowledgeType {
  NOTE = "NOTE",
  LINK = "LINK",
  INSIGHT = "INSIGHT",
}

export interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  type: KnowledgeType;
  summary?: string | null;
  sourceUrl?: string | null;
  fileName?: string | null;
  fileType?: string | null;
  userId: string;
  tags: Tag[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Tag {
  id: string;
  name: string;
}

export interface CreateKnowledgeInput {
  title: string;
  content: string;
  type: KnowledgeType;
  sourceUrl?: string;
  tags?: string[];
  autoSummarize?: boolean;
  autoTag?: boolean;
}

export interface UpdateKnowledgeInput {
  title?: string;
  content?: string;
  type?: KnowledgeType;
  sourceUrl?: string;
  summary?: string;
  tags?: string[];
}

export interface QueryResponse {
  answer: string;
  sources: {
    id: string;
    title: string;
    excerpt: string;
  }[];
}

export interface DashboardFilters {
  search?: string;
  type?: KnowledgeType;
  tags?: string[];
  sortBy?: "createdAt" | "updatedAt" | "title";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}
