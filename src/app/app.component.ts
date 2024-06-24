import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NewsroomsService} from "./newsrooms.service";
import {JsonPipe, NgForOf} from "@angular/common";
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, JsonPipe, HttpClientModule, NgForOf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'bastion-news-app';
  items: any[] = [];


  constructor(private newsRoomsSrv: NewsroomsService) {
    this.newsRoomsSrv.listMaterials().subscribe(
      _ => this.items = _.items
    );
  }
}
