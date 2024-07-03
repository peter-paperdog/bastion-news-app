import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {catchError, forkJoin, map, Observable, of, switchMap} from "rxjs";
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

    return this.http.get(`${this.apiUrl}/list/${this.apiKey}`, { params });
  }

  listAllMaterials(typeOfMedia: string = 'news', limit: number = 20): Observable<any[]> {
    return this.listMaterials(typeOfMedia, limit).pipe(
      switchMap(response => {
        const totalItems = response.total_count;
        const requests: Observable<any>[] = [];
        for (let offset = limit; offset < totalItems; offset += limit) {
          requests.push(this.listMaterials(typeOfMedia, limit, offset));
        }
        return forkJoin([of(response), ...requests]);
      }),
      map((results: any[]) => {
        let allItems: any[] = [];
        results.forEach(result => allItems = allItems.concat(result.items));
        return allItems;
      }),
      catchError(error => {
        console.error('Error fetching all materials:', error);
        return of([]);
      })
    );
  }

  searchMaterials(query: string = 'header', typeOfMedia: string = 'pressrelease', page: number = 1, strict: boolean = true, tags: string = '', callback: string = '', pressroom: string = ''): Observable<any> {
    let params = new HttpParams()
      .set('format', 'json')
      .set('query', query)
      .set('type_of_media', typeOfMedia)
      .set('page', page.toString())
      .set('strict', strict.toString())
      .set('pressroom', pressroom)
      .set('tags', tags)
      .set('callback', callback);

    return this.http.get(`${this.apiUrl}/search/${this.apiKey}`, { params });
  }
}
