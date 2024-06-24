import { TestBed } from '@angular/core/testing';

import { NewsroomsService } from './newsrooms.service';

describe('NewsroomsService', () => {
  let service: NewsroomsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewsroomsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
