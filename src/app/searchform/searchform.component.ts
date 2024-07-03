import { Component, EventEmitter, Output } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-searchform',
  templateUrl: './searchform.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  styleUrls: ['./searchform.component.css']
})
export class SearchformComponent {
  @Output() search = new EventEmitter<string>();
  searchForm: FormGroup;

  contentTypes = ['All Content', 'News', 'Pressrelease', 'Blog Posts'];
  categories = ['All Categories', 'Category 1', 'Category 2', 'Category 3'];

  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      contentType: ['All Content'],
      category: ['All Categories'],
      query: ['']
    });
  }

  onSubmit(): void {
    const query = this.searchForm.value.query;
    this.search.emit(query);
  }
}
