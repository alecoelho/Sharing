import { Injectable } from '@angular/core';
import { DbService } from '../../shared/services/db.service';

@Injectable({
    providedIn: 'root'
  })
  export class CategoryService {

      constructor(private db: DbService){}

      getAll() {
        return this.db.collection$("categories", ref => ref.orderBy("name", "asc"));
      }
  }