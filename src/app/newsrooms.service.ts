import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NewsroomsService {
  private apiUrl = 'https://www.mynewsdesk.com/services/pressroom'; // Base URL for the API

  constructor(private http: HttpClient) { }

  // Method to list all materials
  listMaterials(typeOfMedia: string = 'pressrelease', limit: number = 20, offset: number = 0, order: string = 'published'): Observable<any> {
    let params = new HttpParams()
      .set('format', 'json')
      .set('type_of_media', typeOfMedia)
      .set('limit', limit.toString())
      .set('offset', offset.toString())
      .set('order', order);

    return this.http.get(`${this.apiUrl}/list/fxnW-qYxoiHF-AAVrX40zg`, { params });
  }
}
