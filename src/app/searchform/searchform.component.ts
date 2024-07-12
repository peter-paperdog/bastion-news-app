import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CustomDropdownComponent} from "../custom-dropdown/custom-dropdown.component";
import {Pressroom} from "../models/pressroom.model";
import {NewsroomsService} from "../newsrooms.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-searchform',
  templateUrl: './searchform.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CustomDropdownComponent,
    FormsModule,
    NgIf
  ],
  styleUrls: ['./searchform.component.css']
})
export class SearchformComponent {
  newsData: any[] = [];
  offset: number = 0;
  limit: number = 6;
  allLoaded: boolean = false;
  searchQuery: string = '';
  pressroom: Pressroom | undefined;
  tags: string[] = [];
  selectedTag: string = 'All categories';
  filteredNewsData: any[] = [];
  contentTypes = ['All content', 'pressrelease', 'news', 'blog_post', 'event', 'image', 'video', 'document', 'contact_person'];
  selectedContentType: string = 'All content';
  searchResults: any[] = [];

  constructor(private newsRoomsSrv: NewsroomsService) {
  }

  applyFilters() {
    if (this.selectedContentType === 'All content' && this.selectedTag === 'All categories') {
      this.filteredNewsData = this.newsData.slice(0, this.limit);
    } else {
      this.filteredNewsData = this.newsData.filter(item => {
        const contentTypeMatch = this.selectedContentType === 'All content' || item.type_of_media === this.selectedContentType;
        const tagMatch = this.selectedTag === 'All categories' || this.matchTags(item.tags, this.selectedTag);
        return contentTypeMatch && tagMatch;
      }).slice(0, this.limit);
    }

    this.offset = 0;
    this.allLoaded = false;
  }

  matchTags(itemTags: any[], selectedTags: string): boolean {
    if (selectedTags === 'All categories') return true;

    const selectedTagsArray = selectedTags.split(',').map(tag => tag.trim());
    return itemTags && itemTags.some((tag: any) => selectedTagsArray.includes(tag.name));
  }

  onContentTypeSelected(selectedOption: string): void {
    this.selectedContentType = selectedOption;
    this.applyFilters();
    this.search();
  }

  onTagSelected(selectedOption: string): void {
    this.selectedTag = selectedOption;
    this.applyFilters();
    this.search();
  }

  search(): void {
    let formattedTags = this.selectedTag !== 'All categories' ? this.selectedTag.replace(/\s+/g, ',') : '';
    let formattedQuery = this.searchQuery ? this.searchQuery.trim() + '*' : '';

    this.newsRoomsSrv.searchMaterials(
      formattedQuery,
      this.selectedContentType === 'All content' ? '' : this.selectedContentType,
      this.limit,
      1,
      true,
      formattedTags
    )
      .subscribe(
        (data: any) => {
          this.searchResults = data.search_result.items || [];
          this.filteredNewsData = this.searchResults.slice(0, this.limit);
        },
        (error) => {
          console.error('Error fetching search results:', error);
        }
      );
  }
}
