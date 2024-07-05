import {Component, OnInit} from '@angular/core';
import {NewsroomsService} from '../newsrooms.service';
import {CommonModule, JsonPipe, NgIf} from '@angular/common';
import {TruncateHtmlPipe} from '../truncate-html.pipe';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Pressroom} from "../models/pressroom.model";
import {CustomSelectComponent} from "../custom-select/custom-select.component";

@Component({
  selector: 'app-latestnews',
  standalone: true,
  imports: [
    JsonPipe,
    NgIf,
    TruncateHtmlPipe,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomSelectComponent
  ],
  templateUrl: './latestnews.component.html',
  styleUrls: ['./latestnews.component.css']
})
export class LatestnewsComponent implements OnInit {
  newsData: any[] = [];
  offset: number = 0;
  limit: number = 7;
  allLoaded: boolean = false;
  searchResults: any[] = [];
  searchQuery: string = '';
  pressroom: Pressroom | undefined;
  tags: string[] = [];
  selectedTag: string = 'All categories';
  filteredNewsData: any[] = [];
  contentTypes = ['All content', 'pressrelease', 'news', 'blog_post', 'event', 'image', 'video', 'document', 'contact_person'];
  selectedContentType: string = 'All content';

  constructor(private newsRoomsSrv: NewsroomsService) {
  }

  ngOnInit(): void {
    this.loadInitialData();
    this.getCategories();
  }

  loadInitialData() {
    this.newsRoomsSrv.listMaterials('', '', this.limit)
      .subscribe(
        (response: any) => {
          console.log('Initial Data:', response);
          this.newsData = response.items;
          this.filteredNewsData = this.newsData.slice(1, this.limit + 1);
        },
        (error) => {
          console.error('Error fetching news:', error);
        }
      );
  }

  getCategories() {
    this.newsRoomsSrv.getCategories()
      .subscribe(
        (response: any) => {
          console.log('Categories:', response);
          this.pressroom = response.pressroom;
          this.tags = ['All categories', ...response.pressroom.all_tags.map((tag: any) => tag.name)];
        },
        (error) => {
          console.error('Error fetching pressroom details:', error);
        }
      );
  }

  applyFilters() {
    if (this.selectedContentType === 'All content' && this.selectedTag === 'All categories') {
      this.filteredNewsData = this.newsData.slice(0, this.limit - 1);
    } else {
      this.filteredNewsData = this.newsData.filter(item => {
        const contentTypeMatch = this.selectedContentType === 'All content' || item.type_of_media === this.selectedContentType;
        const tagMatch = this.selectedTag === 'All categories' || this.matchTags(item.tags, this.selectedTag);
        return contentTypeMatch && tagMatch;
      }).slice(0, this.limit - 1);
    }
  }

  matchTags(itemTags: any[], selectedTags: string): boolean {
    if (selectedTags === 'All categories') return true;

    const selectedTagsArray = selectedTags.split(',').map(tag => tag.trim());
    return itemTags && itemTags.some((tag: any) => selectedTagsArray.includes(tag.name));
  }

  search(): void {
    let formattedTags = this.selectedTag !== 'All categories' ? this.selectedTag.replace(/\s+/g, ',') : '';
    let formattedQuery = this.searchQuery ? this.searchQuery.trim() + '*' : '';

    this.newsRoomsSrv.searchMaterials(
      formattedQuery,
      this.selectedContentType === 'All content' ? '' : this.selectedContentType,
      this.limit - 1,
      1,
      true,
      formattedTags
    )
      .subscribe(
        (data: any) => {
          console.log('Search Results:', data);
          this.searchResults = data.search_result.items || [];
          this.filteredNewsData = this.searchResults.slice(0, this.limit - 1);
        },
        (error) => {
          console.error('Error fetching search results:', error);
        }
      );
  }

  loadMore() {
    this.offset += this.limit - 1;
    this.newsRoomsSrv.listMaterials(
      this.selectedContentType === 'All content' ? '' : this.selectedContentType,
      this.selectedTag === 'All categories' ? '' : this.selectedTag,
      this.limit - 1,
      this.offset
    ).subscribe(
      (data: any) => {
        console.log('Load More Data:', data);
        if (data.items.length === 0) {
          this.allLoaded = true;
        } else {
          this.newsData.push(...data.items);
          this.filteredNewsData = [...this.filteredNewsData, ...data.items];
        }
      },
      (error) => {
        console.error('Error fetching more news:', error);
      },
      () => {
        if (this.filteredNewsData.length >= this.newsData.length) {
          this.allLoaded = true;
        }
      }
    );
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
}
