import {Component, Input} from '@angular/core';
import {NewsroomsService} from "../newsrooms.service";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-searchresults',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './searchresults.component.html',
  styleUrl: './searchresults.component.css'
})
export class SearchresultsComponent {
  @Input() results: any[] = [];

  constructor(private newsRoomsSrv: NewsroomsService) {
  }
}
