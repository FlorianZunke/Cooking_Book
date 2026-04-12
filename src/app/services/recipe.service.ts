import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Recipe, NutritionInfo } from '../models/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private recipes$ = new BehaviorSubject<Recipe[]>([]);
  
  constructor() {
    this.loadRecipes();
  }

  getRecipes(): Observable<Recipe[]> {
    return this.recipes$.asObservable();
  }

  getRecipeById(id: string): Recipe | undefined {
    return this.recipes$.value.find(r => r.id === id);
  }

  addRecipe(recipe: Recipe): void {
    const recipes = this.recipes$.value;
    recipe.id = this.generateId();
    recipe.createdAt = new Date();
    recipe.updatedAt = new Date();
    this.recipes$.next([...recipes, recipe]);
    this.saveRecipes();
  }

  updateRecipe(id: string, updatedRecipe: Partial<Recipe>): void {
    const recipes = this.recipes$.value.map(r =>
      r.id === id
        ? { ...r, ...updatedRecipe, updatedAt: new Date() }
        : r
    );
    this.recipes$.next(recipes);
    this.saveRecipes();
  }

  deleteRecipe(id: string): void {
    const recipes = this.recipes$.value.filter(r => r.id !== id);
    this.recipes$.next(recipes);
    this.saveRecipes();
  }

  calculateNutrition(recipe: Recipe, servings: number = recipe.servings): NutritionInfo {
    const factor = servings / recipe.servings;
    
    return {
      calories: Math.round((recipe.ingredients.reduce((sum, ing) => sum + (ing.calories || 0), 0)) * factor),
      protein: Math.round((recipe.ingredients.reduce((sum, ing) => sum + (ing.protein || 0), 0)) * factor * 10) / 10,
      carbs: Math.round((recipe.ingredients.reduce((sum, ing) => sum + (ing.carbs || 0), 0)) * factor * 10) / 10,
      fat: Math.round((recipe.ingredients.reduce((sum, ing) => sum + (ing.fat || 0), 0)) * factor * 10) / 10,
      fiber: Math.round((recipe.ingredients.reduce((sum, ing) => sum + (ing.fiber || 0), 0)) * factor * 10) / 10,
    };
  }

  private generateId(): string {
    return `recipe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private saveRecipes(): void {
    localStorage.setItem('recipes', JSON.stringify(this.recipes$.value));
  }

  private loadRecipes(): void {
    const stored = localStorage.getItem('recipes');
    if (stored) {
      try {
        this.recipes$.next(JSON.parse(stored));
      } catch (e) {
        console.error('Fehler beim Laden der Rezepte', e);
      }
    }
  }
}
