import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { Recipe, RecipeCategory, Ingredient } from '../../models/recipe.model';

@Component({
  selector: 'app-recipe-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './recipe-editor.component.html',
  styleUrl: './recipe-editor.component.scss'
})
export class RecipeEditorComponent implements OnInit {
  recipeForm!: FormGroup;
  isEditMode = false;
  recipe: Recipe | null = null;
  ingredients: Ingredient[] = [];

  categories: { value: RecipeCategory; label: string }[] = [
    { value: 'suppen', label: 'Suppen' },
    { value: 'nudeln', label: 'Nudelgerichte' },
    { value: 'reis', label: 'Reisgerichte' },
    { value: 'fleisch', label: 'Fleischgerichte' },
    { value: 'vegetarisch', label: 'Vegetarisch' },
    { value: 'desserts', label: 'Desserts' },
    { value: 'andere', label: 'Andere' },
  ];

  units = ['g', 'ml', 'TL', 'EL', 'Stück', 'Tasse', 'Packung'];

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.recipeForm = this.createForm();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      const recipe = this.recipeService.getRecipeById(id);
      if (recipe) {
        this.recipe = recipe;
        this.ingredients = [...recipe.ingredients];
        this.populateForm(recipe);
      }
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      category: ['nudeln', Validators.required],
      description: [''],
      servings: [1, [Validators.required, Validators.min(1)]],
      prepTime: [0],
      cookTime: [0],
      instructions: [''],
      image: ['']
    });
  }

  populateForm(recipe: Recipe): void {
    this.recipeForm.patchValue({
      name: recipe.name,
      category: recipe.category,
      description: recipe.description,
      servings: recipe.servings,
      prepTime: recipe.prepTime,
      cookTime: recipe.cookTime,
      instructions: recipe.instructions,
      image: recipe.image
    });
  }

  addIngredient(): void {
    this.ingredients.push({
      name: '',
      amount: 0,
      unit: 'g',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0
    });
  }

  removeIngredient(index: number): void {
    this.ingredients.splice(index, 1);
  }

  saveRecipe(): void {
    if (this.recipeForm.invalid) {
      alert('Bitte fülle alle erforderlichen Felder aus');
      return;
    }

    const formValue = this.recipeForm.value;
    const recipeData: Recipe = {
      id: this.recipe?.id || '',
      name: formValue.name,
      category: formValue.category,
      description: formValue.description,
      servings: formValue.servings,
      prepTime: formValue.prepTime,
      cookTime: formValue.cookTime,
      instructions: formValue.instructions,
      image: formValue.image,
      ingredients: this.ingredients,
      createdAt: this.recipe?.createdAt || new Date(),
      updatedAt: new Date()
    };

    if (this.isEditMode && this.recipe) {
      this.recipeService.updateRecipe(this.recipe.id, recipeData);
      alert('Rezept aktualisiert!');
    } else {
      this.recipeService.addRecipe(recipeData);
      alert('Rezept erstellt!');
    }

    this.router.navigate(['/recipes']);
  }

  cancel(): void {
    this.router.navigate(['/recipes']);
  }
}
