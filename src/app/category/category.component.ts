import { Component, OnInit } from '@angular/core';
import { Category } from '../_models/Category';
import { FormGroup , Validators, FormBuilder } from '@angular/forms';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  categoryForm: FormGroup;
  model: Category;

  constructor(public toastController: ToastController, private  fb: FormBuilder) { }

  ngOnInit() {
    this.createCategoryForm();
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      showCloseButton: true,
      position: 'bottom',
      closeButtonText: 'X',
    });
    toast.present();
  }

  createCategoryForm() {
    this.categoryForm = this.fb.group
    (
      {
        name: [
          '',
          [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
        description: [
          '',
          [Validators.required, Validators.minLength(10), Validators.maxLength(50)]]
      }
    );
  }

  save() {
    if (this.categoryForm.valid) {
        this.model = Object.assign({}, this.categoryForm.value);
        this.presentToast('Category ' + this.model.name + ' has been saved successfully.');
      }
  }

  reset() {
    this.createCategoryForm();
  }
}
