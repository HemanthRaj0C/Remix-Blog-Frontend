export type Site = {
  NAME: string;
  EMAIL: string;
  NUM_POSTS_ON_HOMEPAGE: number;
  NUM_WORKS_ON_HOMEPAGE: number;
  NUM_PROJECTS_ON_HOMEPAGE: number;
};

export type Metadata = {
  TITLE: string;
  DESCRIPTION: string;
};

export type Socials = {
  NAME: string;
  HREF: string;
}[];

export interface Author {
  id: number;
  username: string;
  email: string;
}

export interface BlogPost {
  id: number;
  title: string;
  shortDescription: string;
  content: string;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: number;
    username: string;
    email: string;
    password: string;
    blogs: BlogPost[];
    createdAt: string;
  };
}

export type PostsByYear = {
  [year: string]: BlogPost[];
};