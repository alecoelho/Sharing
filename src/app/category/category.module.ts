import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CategoryPage } from './category.page';

import { CategoryService } from './services/category.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: CategoryPage
      }
    ])
  ],
  exports: [CategoryPage],
  declarations: [CategoryPage],
  providers: [
    CategoryService
  ]
})
export class CategoryPageModule {}
