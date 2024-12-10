import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { CuratorRelatedExhibitionsComponent } from '../curator.related.exhibitions.component';
import { DataService } from '../../../data.service';
import { AuthService } from '../../../auth.service';
import { AddItemModalComponent } from '../../modals/modal.component';
import { provideHttpClient } from '@angular/common/http';

describe('CuratorRelatedExhibitionsComponent', () => {
  let component: CuratorRelatedExhibitionsComponent;
  let fixture: ComponentFixture<CuratorRelatedExhibitionsComponent>;
  let mockDataService: jasmine.SpyObj<DataService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  const mockExhibitionsResponse = {
    exhibitions: [
      {
        _id: '1',
        title: 'Test Exhibition',
        description: 'Test Description',
        provenance: 'Test Provenance',
        artworks: ['artwork1', 'artwork2'],
      },
    ],
    totalPages: 1,
  };

  const mockArtwork = {
    images: 'test-image-url.jpg',
  };

  beforeEach(async () => {
    // Create mock service objects
    mockDataService = jasmine.createSpyObj('DataService', [
      'getCuratorRelatedExhibitions',
      'getArtworkById',
      'deleteExhibition',
    ]);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getUserId']);

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        AddItemModalComponent,
        CuratorRelatedExhibitionsComponent,
      ],
      declarations: [],
      providers: [
        { provide: DataService, useValue: mockDataService },
        { provide: AuthService, useValue: mockAuthService },
        provideHttpClient(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CuratorRelatedExhibitionsComponent);
    component = fixture.componentInstance;
  });

  describe('Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default page values', () => {
      expect(component.page).toBe(1);
      expect(component.pageSize).toBe(12);
    });
  });

  describe('Pagination', () => {
    it('should generate correct page numbers', () => {
      component.totalPages = 10;

      // Test different current page scenarios
      component.page = 1;
      component.generatePageNumbers();
      expect(component.pageNumbers).toEqual([1, 2, 3, 4, 5]);

      component.page = 5;
      component.generatePageNumbers();
      expect(component.pageNumbers).toEqual([3, 4, 5, 6, 7]);

      component.page = 10;
      component.generatePageNumbers();
      expect(component.pageNumbers).toEqual([6, 7, 8, 9, 10]);
    });

    it('should go to specific page', () => {
      spyOn(component, 'getExhibitions');
      component.goToPage(3);

      expect(component.page).toBe(3);
      expect(sessionStorage['page']).toBe('3');
      expect(component.getExhibitions).toHaveBeenCalled();
    });
  });

  describe('Utility Methods', () => {
    it('should track exhibition by ID', () => {
      const exhibition = { _id: '123' };
      expect(component.trackByExhibitionId(exhibition)).toBe('123');
    });
  });
});
