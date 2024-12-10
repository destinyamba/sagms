import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ArtworksComponent } from '../artworks.component';
import { DataService } from '../../../data.service';
import { AuthService } from '../../../auth.service';
import { provideHttpClient } from '@angular/common/http';

describe('ArtworksComponent', () => {
  let component: ArtworksComponent;
  let fixture: ComponentFixture<ArtworksComponent>;
  let mockDataService: jasmine.SpyObj<DataService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockDataService = jasmine.createSpyObj('DataService', [
      'getArtworks',
      'searchArtworks',
      'filterArtworksByDimension',
      'getAvgArtworksRating',
    ]);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getUserRole']);

    const mockArtworksResponse = {
      artworks: [
        {
          _id: '1',
          title: 'Test Artwork',
          description: 'A test artwork description',
          category: 'Painting',
          materials: ['Oil', 'Canvas'],
          dimensions: { height_cm: 50, width_cm: 70 },
          images: 'test-image-url',
          provenance: 'Test Gallery',
        },
      ],
      totalPages: 1,
    };

    const mockRatingsResponse = [{ _id: '1', average_rating: 4.5 }];

    // Configure mock service methods
    mockDataService.getArtworks.and.returnValue(of(mockArtworksResponse));
    mockDataService.searchArtworks.and.returnValue(of(mockArtworksResponse));
    mockDataService.filterArtworksByDimension.and.returnValue(
      of(mockArtworksResponse)
    );
    mockDataService.getAvgArtworksRating.and.returnValue(
      of(mockRatingsResponse)
    );
    mockAuthService.getUserRole.and.returnValue('ARTIST');

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, FormsModule, ArtworksComponent],
      declarations: [],
      providers: [
        { provide: DataService, useValue: mockDataService },
        { provide: AuthService, useValue: mockAuthService },
        provideHttpClient(),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ArtworksComponent);
    component = fixture.componentInstance;

    component['dataService'] = mockDataService;
    component['authService'] = mockAuthService;

    sessionStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should load all artworks when initialized', () => {
      spyOn(component, 'loadArtworks');

      component.ngOnInit();

      expect(component.loadArtworks).toHaveBeenCalled();
    });
  });

  describe('Artworks Loading', () => {
    it('should load artworks from data service when no search term or filter', () => {
      fixture.detectChanges();

      expect(mockDataService.getArtworks).toHaveBeenCalledWith(1);

      expect(mockDataService.getAvgArtworksRating).toHaveBeenCalledWith(1);

      expect(component.artworks_data.length).toBe(1);
      expect(component.totalPages).toBe(1);
    });

    it('should search artworks when search term is provided', () => {
      component.searchTerm = 'test';
      component.loadArtworks();

      expect(mockDataService.searchArtworks).toHaveBeenCalledWith('test', 1);
    });

    it('should filter artworks by dimension when dimension range is selected', () => {
      const mockDimensionRange = {
        label: 'Small',
        height: { min: 0, max: 50 },
        width: { min: 0, max: 70 },
      };

      component.selectedDimensionRange = mockDimensionRange;
      component.loadArtworks();

      expect(mockDataService.filterArtworksByDimension).toHaveBeenCalledWith(
        mockDimensionRange.height,
        mockDimensionRange.width,
        1
      );
    });

    it('should filter artworks by dimension', () => {
      const mockDimensionRange = {
        label: 'Small',
        height: { min: 0, max: 50 },
        width: { min: 0, max: 70 },
      };

      component.selectedDimensionRange = mockDimensionRange;
      component.loadArtworks();

      expect(mockDataService.filterArtworksByDimension).toHaveBeenCalledWith(
        mockDimensionRange.height,
        mockDimensionRange.width,
        1
      );
    });

    it('should load artworks from data service when no search term or filter', () => {
      component.loadArtworks();

      expect(mockDataService.getArtworks).toHaveBeenCalledWith(1);
      expect(mockDataService.getAvgArtworksRating).toHaveBeenCalledWith(1);
    });
  });

  describe('Pagination', () => {
    it('should generate page numbers correctly', () => {
      component.totalPages = 10;
      component.page = 5;

      component.generatePageNumbers();

      expect(component.pageNumbers).toEqual([3, 4, 5, 6, 7]);
    });
  });

  describe('User Role and Permissions', () => {
    it('should return true for artist role', () => {
      mockAuthService.getUserRole.and.returnValue('ARTIST');

      expect(component.isArtist()).toBe(true);
    });

    it('should return false for non-artist roles', () => {
      mockAuthService.getUserRole.and.returnValue('VIEWER');

      expect(component.isArtist()).toBe(false);
    });
  });

  describe('Ratings', () => {
    it('should update artworks with average ratings', () => {
      fixture.detectChanges();

      const updatedArtworks = component.artworks_data;

      expect(updatedArtworks[0].average_rating).toBe(4.5);
      expect(mockDataService.getAvgArtworksRating).toHaveBeenCalled();
    });
  });

  describe('Modal Interaction', () => {
    it('should open add artwork modal for artists', () => {
      const modalComponent = jasmine.createSpyObj('AddItemModalComponent', [
        'openModal',
      ]);
      component.modalComponent = modalComponent;

      component.openAddArtworkModal();

      expect(modalComponent.openModal).toHaveBeenCalledWith('artwork');
    });
  });
});
