import { Component } from '@angular/core';
import { CategoryService } from './services/category.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  categories$;

  constructor(private categoryService: CategoryService){}

  ionViewWillEnter(){
    this.categories$ = this.categoryService.getAll();
  }
}
