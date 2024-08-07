import {Component, OnInit} from '@angular/core';
import {NewsroomsService} from '../newsrooms.service';
import {CommonModule, JsonPipe, NgIf} from '@angular/common';
import {TruncateHtmlPipe} from '../truncate-html.pipe';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Pressroom} from "../models/pressroom.model";
import {CustomDropdownComponent} from "../custom-dropdown/custom-dropdown.component";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {SearchformComponent} from "../searchform/searchform.component";

@Component({
  selector: 'app-latestnews',
  standalone: true,
  imports: [
    JsonPipe,
    NgIf,
    TruncateHtmlPipe,
    CommonModule,
    FormsModule,
    SearchformComponent,
    ReactiveFormsModule,
    CustomDropdownComponent,
  ],
  templateUrl: './latestnews.component.html',
  styleUrls: ['./latestnews.component.css'],
  animations: [
    trigger('buttonOverlayAnimation', [
      state('default', style({
        transform: 'translate3d(-104%, 0, 0)'
      })),
      state('active', style({
        transform: 'translate3d(0, 0, 0)'
      })),
      transition('default => active', [
        animate('0.3s ease-in-out')
      ]),
      transition('active => default', [
        animate('0.3s ease-in-out')
      ])
    ])
  ]
})
export class LatestnewsComponent implements OnInit {
  newsData: any[] = [];
  offset: number = 0;
  limit: number = 6;
  allLoaded: boolean = false;
  searchResults: any[] = [];
  searchQuery: string = '';
  pressroom: Pressroom | undefined;
  tags: string[] = [];
  selectedTag: string = 'All categories';
  filteredNewsData: any[] = [];
  contentTypes = ['All content', 'pressrelease', 'news', 'blog_post', 'event', 'image', 'video', 'document', 'contact_person'];
  selectedContentType: string = 'All content';
  buttonOverlayState = 'default';
  totalItems: number = 0;
  totalSearchItems: number = 0;
  page: number = 0;
  pageCount: number = 1;
  isLoading = true;

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
          this.newsData = response.items;
          this.isLoading = false;
          this.filteredNewsData = this.newsData.slice(0, this.limit);
          this.totalItems = response.total_count;
          this.checkIfAllLoaded();
        },
        (error) => {
          console.error('Error fetching news:', error);
          this.isLoading = false;
        }
      );
  }

  getCategories() {
    this.newsRoomsSrv.getCategories()
      .subscribe(
        (response: any) => {
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
    this.checkIfAllLoaded();
  }

  matchTags(itemTags: any[], selectedTags: string): boolean {
    if (selectedTags === 'All categories') return true;

    const selectedTagsArray = selectedTags.split(',').map(tag => tag.trim());
    return itemTags && itemTags.some((tag: any) => selectedTagsArray.includes(tag.name));
  }

  search(): void {
    this.isLoading = true;
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
          this.totalSearchItems = data.search_result.summary.nr_of_items;
          this.page = data.search_result.summary.page;
          this.pageCount = data.search_result.summary.page_count;
          this.checkIfAllLoaded();
          this.isLoading = false;
        },
        (error) => {
          console.error('Error fetching search results:', error);
        }
      );
  }

  loadMore(event: Event) {
    event.preventDefault();
    this.offset += this.limit;

    this.newsRoomsSrv.searchMaterials(
      this.searchQuery ? this.searchQuery.trim() + '*' : '',
      this.selectedContentType === 'All content' ? '' : this.selectedContentType,
      this.limit,
      Math.floor(this.offset / this.limit) + 1,
      true,
      this.selectedTag !== 'All categories' ? this.selectedTag.replace(/\s+/g, ',') : ''
    ).subscribe(
      (data: any) => {
        if (data.search_result.items.length === 0) {
          this.allLoaded = true;
        } else {
          this.filteredNewsData = [...this.filteredNewsData, ...data.search_result.items];
          this.totalSearchItems = data.search_result.summary.nr_of_items;
          this.page = data.search_result.summary.page;
          this.pageCount = data.search_result.summary.page_count;
          this.checkIfAllLoaded();
        }
        this.isLoading = false;
      },
      (error: any) => {
        console.error('Error fetching more filtered news:', error);
        this.isLoading = false;
      }
    );
  }

  checkIfAllLoaded(): void {
    this.allLoaded = this.filteredNewsData.length >= this.totalItems || (this.page >= this.pageCount && this.filteredNewsData.length >= this.totalSearchItems);
  }

  shouldShowSeeMoreButton(): boolean {
    return !this.allLoaded && (this.filteredNewsData.length < this.totalItems || this.page < this.pageCount);
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

  onMouseOver() {
    this.buttonOverlayState = 'active';
  }

  onMouseOut() {
    this.buttonOverlayState = 'default';
  }
}
