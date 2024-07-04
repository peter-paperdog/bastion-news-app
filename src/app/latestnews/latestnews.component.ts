import {Component, OnInit} from '@angular/core';
import {NewsroomsService} from '../newsrooms.service';
import {CommonModule, JsonPipe, NgIf} from '@angular/common';
import {TruncateHtmlPipe} from '../truncate-html.pipe';
import {FormsModule} from "@angular/forms";
import {Pressroom} from "../models/pressroom.model";
@Component({
  selector: 'app-latestnews',
  standalone: true,
  imports: [
    JsonPipe,
    NgIf,
    TruncateHtmlPipe,
    CommonModule,
    FormsModule
  ],
  templateUrl: './latestnews.component.html',
  styleUrls: ['./latestnews.component.css']
})
export class LatestnewsComponent implements OnInit{
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

  constructor(private newsRoomsSrv: NewsroomsService) { }

  ngOnInit(): void {
    this.loadInitialData();
    this.getCategories();
  }

  loadInitialData() {
    this.newsRoomsSrv.listMaterials('news', this.limit)
      .subscribe(
        (response: any) => {
          console.log('Initial Data:', response); // Debugging
          this.newsData = response.items;
          this.filteredNewsData = this.newsData;
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
          console.log('Categories:', response); // Debugging
          this.pressroom = response.pressroom;
          this.tags = response.pressroom.all_tags_formatted.map((tag: any) => tag.name_for_pressroom);
        },
        (error) => {
          console.error('Error fetching pressroom details:', error);
        }
      );
  }

  filterByTag(tag: string) {
    this.selectedTag = tag;
    this.filteredNewsData = this.newsData.filter(item => item.tags && item.tags.some((t: any) => t.name === tag));
  }

  loadMore() {
    this.offset += this.limit - 1;
    this.newsRoomsSrv.listMaterials('news', this.limit - 1, this.offset)
      .subscribe(
        (data: any) => {
          console.log('Load More Data:', data); // Debugging
          if (data.items.length === 0) {
            this.allLoaded = true;
          } else {
            this.newsData.push(...data.items);
          }
        },
        (error) => {
          console.error('Error fetching more news:', error);
        }
      );
  }

  search(): void {
    if (this.searchQuery.trim() === '') {
      this.searchResults = [];
      return;
    }

    this.newsRoomsSrv.searchMaterials(this.searchQuery)
      .subscribe(
        (data: any) => {
          console.log('Search Results:', data);
          this.searchResults = data.search_result.items || [];
        },
        (error) => {
          console.error('Error fetching search results:', error);
        }
      );
  }
}
