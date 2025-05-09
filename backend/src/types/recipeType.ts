export interface Ingredient {
  name: string;
  amount: number;
  unit?: string;
  type: string;
}

export interface Step {
  number: number;
  instruction: string;
}

export interface Recipe {
  title: string;
  description: string;
  ingredients: Ingredient[];
  steps: Step[];
  tags: string[];
  imageUrl?: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RecipeCreate {
  title: string;
  description: string;
  ingredients: Ingredient[];
  steps: Step[];
  Tags: string[];
  imageUrl?: string;
}

export interface RecipeUpdate {
  title?: string;
  description?: string;
  ingredients?: Ingredient[];
  steps?: Step[];
  Tags?: string[];
  imageUrl?: string;
}

export interface RecipeDelete {
  id: string;
}
