export type Service = {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  category: string;
  address: string;
  area: string;
  phone: string;
  website: string;
  hours: Record<string, string>;
  requirements: string[];
  tags: string[];
  featured: boolean;
  colorScheme: string;
  icon: string;
  accessibility: boolean;
  onlineAvailable: boolean;
  location?: {
    latitude: number;
    longitude: number;
  };
  steps?: Step[];
};

export type Step = {
  title: string;
  description: string;
  tips?: string[];
  documents?: string[];
};

export type Lesson = {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  duration: string;
  createdAt: string;
  status: "Published" | "Draft" | string;
};

export type Quiz = {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  questions: number;
  createdAt: string;
  status: "Published" | "Draft" | string;
};
