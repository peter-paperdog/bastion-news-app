import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from '../environment';

@Injectable({
  providedIn: 'root'
})
export class NewsroomsService {
  private apiUrl = environment.apiUrl;
  private apiKey = environment.apiKey;

  constructor(private http: HttpClient) {
  }

  // Method to list all materials
  listMaterials(typeOfMedia: string = 'news', limit: number = 20, offset: number = 0, order: string = 'published'): Observable<any> {
    let params = new HttpParams()
      .set('format', 'json')
      .set('type_of_media', typeOfMedia)
      .set('limit', limit.toString())
      .set('offset', offset.toString())
      .set('order', order);

    return this.http.get(`${this.apiUrl}/list/${this.apiKey}`, {params});
  }

  // Method to search materials
  searchMaterials(
    query: string = '',
    typeOfMedia: string = '',
    limit: number = 7,
    page: number = 1,
    strict: boolean = true,
    tags: string = '',
    callback: string = '',
    pressroom: string = ''
  ): Observable<any> {
    const params = new HttpParams()
      .set('format', 'json')
      .set('query', query)
      .set('type_of_media', typeOfMedia)
      .set('limit', limit.toString())
      .set('page', page.toString())
      .set('strict', strict.toString())
      .set('pressroom', pressroom)
      .set('tags', tags)
      .set('callback', callback);

    return this.http.get(`${this.apiUrl}/search/${this.apiKey}`, { params });
  }
  getCategories(
    pressroom: string = ''
  ): Observable<any> {
    let params = new HttpParams()
      .set('format', 'json')

    return this.http.get(`${this.apiUrl}//pressroom_info//${this.apiKey}`, {params});
  }
}
