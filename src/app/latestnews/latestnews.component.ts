import {Component, OnInit} from '@angular/core';
import {NewsroomsService} from '../newsrooms.service';
import {CommonModule, JsonPipe, NgIf} from '@angular/common';
import {TruncateHtmlPipe} from '../truncate-html.pipe';

@Component({
  selector: 'app-latestnews',
  standalone: true,
  imports: [
    JsonPipe,
    NgIf,
    TruncateHtmlPipe,
    CommonModule
  ],
  templateUrl: './latestnews.component.html',
  styleUrls: ['./latestnews.component.css']
})
export class LatestnewsComponent implements OnInit{
  newsData: any[] = [];
  offset: number = 0;
  limit: number = 7;
  allLoaded: boolean = false;

  constructor(private newsRoomsSrv: NewsroomsService) {
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData() {
    this.newsRoomsSrv.listMaterials('news', this.limit)
      .subscribe(
        (response: any) => {
          this.newsData = response.items;
        },
        (error) => {
          console.error('Error fetching news:', error);
        }
      );
  }

  loadMore() {
    this.offset += this.limit-1;
    console.log(this.offset += this.limit)
    this.newsRoomsSrv.listMaterials('news', this.limit-1, this.offset)
      .subscribe(
        (data: any) => {
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
}
