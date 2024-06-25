import {Component} from '@angular/core';
import {JsonPipe, NgForOf} from "@angular/common";
import {SearchformComponent} from "./searchform/searchform.component";
import {SearchresultsComponent} from "./searchresults/searchresults.component";
import {NewsroomsService} from "./newsrooms.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [JsonPipe, NgForOf, SearchformComponent, SearchresultsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'bastion-news-app';
  searchResults: any[] = [];

  constructor(private newsRoomsSrv: NewsroomsService) {
    this.performSearch();
  }

  onSearch(filters: any): void {
    this.performSearch();
  }

  performSearch(): void {
    this.newsRoomsSrv.listMaterials().subscribe(
      _ => this.searchResults = _.items
    );
  }
}
