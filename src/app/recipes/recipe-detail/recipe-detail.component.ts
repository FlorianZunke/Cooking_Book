import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RecipeService } from '../../services/recipe.service';
import { Recipe, NutritionInfo } from '../../models/recipe.model';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recipe-detail.component.html',
  styleUrl: './recipe-detail.component.scss'
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe | null = null;
  servings: number = 1;
  nutrition: NutritionInfo | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.recipe = this.recipeService.getRecipeById(id) || null;
      if (this.recipe) {
        this.servings = this.recipe.servings;
        this.calculateNutrition();
      } else {
        this.router.navigate(['/recipes']);
      }
    }
  }

  calculateNutrition(): void {
    if (this.recipe) {
      this.nutrition = this.recipeService.calculateNutrition(this.recipe, this.servings);
    }
  }

  onServingsChange(): void {
    this.calculateNutrition();
  }

  goBack(): void {
    this.router.navigate(['/recipes']);
  }

  editRecipe(): void {
    if (this.recipe) {
      this.router.navigate(['/recipes', this.recipe.id, 'edit']);
    }
  }
}
