import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { Recipe, RecipeCategory } from '../../models/recipe.model';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './recipe-list.component.html',
  styleUrl: './recipe-list.component.scss'
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [];
  selectedCategory: RecipeCategory | 'alle' = 'alle';
  
  categories: { value: RecipeCategory | 'alle'; label: string }[] = [
    { value: 'alle', label: 'Alle Kategorien' },
    { value: 'suppen', label: 'Suppen' },
    { value: 'nudeln', label: 'Nudelgerichte' },
    { value: 'reis', label: 'Reisgerichte' },
    { value: 'fleisch', label: 'Fleischgerichte' },
    { value: 'vegetarisch', label: 'Vegetarisch' },
    { value: 'desserts', label: 'Desserts' },
    { value: 'andere', label: 'Andere' },
  ];

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.recipeService.getRecipes().subscribe(recipes => {
      this.recipes = recipes;
    });
  }

  get filteredRecipes(): Recipe[] {
    if (this.selectedCategory === 'alle') {
      return this.recipes;
    }
    return this.recipes.filter(r => r.category === this.selectedCategory);
  }

  deleteRecipe(id: string): void {
    if (confirm('Möchtest du dieses Rezept wirklich löschen?')) {
      this.recipeService.deleteRecipe(id);
    }
  }

  getCategoryLabel(category: RecipeCategory): string {
    return this.categories.find(c => c.value === category)?.label || category;
  }
}
