import {Component} from '@angular/core';
import {CommonModule, JsonPipe, NgForOf} from "@angular/common";
import {SearchformComponent} from "./searchform/searchform.component";
import {NewsroomsService} from "./newsrooms.service";
import {LatestnewsComponent} from "./latestnews/latestnews.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [JsonPipe, NgForOf, SearchformComponent, LatestnewsComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'bastion-news-app';
  searchResults: any[] = [];

  constructor(private newsRoomsSrv: NewsroomsService) {
    //this.performSearch();
  }

  onSearch(filters: any): void {
    //this.performSearch();
  }

  /*performSearch(): void {
    this.newsRoomsSrv.listMaterials().subscribe(
      _ => this.searchResults = _.items
    );
  }*/
}
