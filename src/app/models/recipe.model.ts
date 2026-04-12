export type RecipeCategory = 'suppen' | 'nudeln' | 'reis' | 'fleisch' | 'vegetarisch' | 'desserts' | 'andere';

export interface Ingredient {
  id?: string;
  name: string;
  amount: number;
  unit: string; // g, ml, TL, EL, Stück, etc.
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
}

export interface Recipe {
  id: string;
  name: string;
  category: RecipeCategory;
  description?: string;
  ingredients: Ingredient[];
  instructions?: string;
  servings: number; // Standard-Portionsgröße
  prepTime?: number; // in Minuten
  cookTime?: number; // in Minuten
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}
