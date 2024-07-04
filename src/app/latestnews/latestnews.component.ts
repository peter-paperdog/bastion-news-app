import {Component, OnInit} from '@angular/core';
import {NewsroomsService} from '../newsrooms.service';
import {CommonModule, JsonPipe, NgIf} from '@angular/common';
import {TruncateHtmlPipe} from '../truncate-html.pipe';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Pressroom} from "../models/pressroom.model";

@Component({
  selector: 'app-latestnews',
  standalone: true,
  imports: [
    JsonPipe,
    NgIf,
    TruncateHtmlPipe,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
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
  selectedTag: string | null = null;
  filteredNewsData: any[] = [];
  contentTypes = ['pressrelease', 'news', 'blog_post', 'event', 'image', 'video', 'document', 'contact_person'];
  selectedContentType: string | null = null;

  constructor(private newsRoomsSrv: NewsroomsService) {
  }

  ngOnInit(): void {
    this.loadInitialData();
    this.getCategories();
  }

  loadInitialData() {
    this.newsRoomsSrv.listMaterials('news', this.limit)
      .subscribe(
        (response: any) => {
          console.log('Initial Data:', response);
          this.newsData = response.items;
          this.filteredNewsData = this.newsData.slice(0, this.limit);
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
          this.tags = response.pressroom.all_tags.map((tag: any) => tag.name);
        },
        (error) => {
          console.error('Error fetching pressroom details:', error);
        }
      );
  }

  applyFilters() {
    this.filteredNewsData = this.newsData.filter(item => {
      const contentTypeMatch = !this.selectedContentType || item.type_of_media === this.selectedContentType;
      const tagMatch = !this.selectedTag || this.matchTags(item.tags, this.selectedTag);
      return contentTypeMatch && tagMatch;
    }).slice(0, this.limit);
  }

  matchTags(itemTags: any[], selectedTags: string): boolean {
    if (!selectedTags) return true; // No tag filter applied

    const selectedTagsArray = selectedTags.split(',').map(tag => tag.trim());
    return itemTags && itemTags.some((tag: any) => selectedTagsArray.includes(tag.name));
  }

  search(): void {
    let formattedTags = this.selectedTag ? this.selectedTag.replace(/\s+/g, ',') : '';
    let formattedQuery = this.searchQuery ? this.searchQuery.trim() + '*' : '';

    this.newsRoomsSrv.searchMaterials(formattedQuery, this.selectedContentType || '', this.limit, 1, true, formattedTags)
      .subscribe(
        (data: any) => {
          console.log('Search Results:', data);
          this.searchResults = data.search_result.items || [];
          this.filteredNewsData = this.searchResults.slice(0, this.limit);
        },
        (error) => {
          console.error('Error fetching search results:', error);
        }
      );
  }

  loadMore() {
    this.offset += this.limit;
    this.newsRoomsSrv.listMaterials('news', this.limit, this.offset)
      .subscribe(
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
        }
      );
  }
}
