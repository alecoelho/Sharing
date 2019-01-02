import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { switchMap } from 'rxjs/operators';

import { CategoryService } from './services/category.service';

@Component({
  selector: 'app-category',
  templateUrl: 'category.page.html',
  styleUrls: ['category.page.scss'],
})
export class CategoryPage {
  categories$;

  constructor(private categoryService: CategoryService, private activatedRoute: ActivatedRoute){}

  ionViewWillEnter(){

    this.activatedRoute.paramMap.subscribe(params => {
      const cat = params.get("cat") || "";
      
      this.categories$ = this.categoryService.get(cat);
    });
  }
}
