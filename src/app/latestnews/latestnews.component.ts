import { Component } from '@angular/core';
import {NewsroomsService} from "../newsrooms.service";
import {JsonPipe, NgIf} from "@angular/common";
import {TruncateHtmlPipe} from "../truncate-html.pipe";

@Component({
  selector: 'app-latestnews',
  standalone: true,
  imports: [
    JsonPipe,
    NgIf,
    TruncateHtmlPipe
  ],
  templateUrl: './latestnews.component.html',
  styleUrl: './latestnews.component.css'
})
export class LatestnewsComponent {
  public newsData: any;

  constructor(private newsRoomsSrv: NewsroomsService) {
    this.newsRoomsSrv.listMaterials('news',4).subscribe(
      (response) => {
        this.newsData = response.items;
      },
      (error) => {
        console.error('Error fetching news:', error);
      }
    );
  }
}
