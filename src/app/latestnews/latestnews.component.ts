import {Component, OnInit} from '@angular/core';
import {NewsroomsService} from '../newsrooms.service';
import {CommonModule, JsonPipe, NgIf} from '@angular/common';
import {TruncateHtmlPipe} from '../truncate-html.pipe';
import {FormsModule} from "@angular/forms";

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
export class LatestnewsComponent implements OnInit {
  newsData: any[] = [];
  allNewsData: any[] = [];
  searchResults: any[] = [];
  allSearchResults: any[] = [];
  searchQuery: string = '';
  totalItemCount: number = 0;
  limit: number = 7;
  allLoaded: boolean = false;
  searchOffset: number = 0;

  constructor(private newsRoomsSrv: NewsroomsService) { }

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData() {
    this.newsRoomsSrv.listAllMaterials('news', this.limit)
      .subscribe(
        (allItems: any[]) => {
          this.allNewsData = allItems;
          this.newsData = allItems.slice(0, this.limit);
          this.totalItemCount = allItems.length;
        },
        (error) => {
          console.error('Error fetching all news:', error);
        }
      );
  }

  loadMore() {
    const nextOffset = this.newsData.length;
    const nextItems = this.allNewsData.slice(nextOffset, nextOffset + this.limit-1);
    this.newsData.push(...nextItems);
  }

  loadMoreSearchResults() {
    const nextSearchOffset = this.searchResults.length;
    const nextSearchItems = this.allSearchResults.slice(nextSearchOffset, nextSearchOffset + this.limit - 1);
    this.searchResults.push(...nextSearchItems);
  }

  search(): void {
    if (this.searchQuery.trim() === '') {
      this.searchResults = [];
      this.searchOffset = 0;
      return;
    }
    this.allSearchResults = this.allNewsData.filter(news => {
      const foundInHeader = news.header.toLowerCase().includes(this.searchQuery.toLowerCase());
      return foundInHeader;
    });
    this.searchResults = this.allSearchResults.slice(0, this.limit - 1);
    this.searchOffset = this.limit - 1;
  }
}
