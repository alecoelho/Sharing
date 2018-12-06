import { Injectable } from '@angular/core';
import { DbService } from '../../shared/services/db.service';

@Injectable({
    providedIn: 'root'
  })
  export class CategoryService {

      constructor(private db: DbService){}

      get(cat: string) {
        return this.db.collection$("categories", ref =>
        ref 
          .where("parent", "==", cat)
          .orderBy("name", "asc")
          .limit(10)
        )
      }
  }