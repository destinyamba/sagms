import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ArtworkDetailComponent } from '../artwork.detail.component';
import { DataService } from '../../../data.service';
import { AuthService } from '../../../auth.service';
import { CommonModule } from '@angular/common';

describe('ArtworkDetailComponent', () => {
  let component: ArtworkDetailComponent;
  let fixture: ComponentFixture<ArtworkDetailComponent>;
  let dataServiceSpy: jasmine.SpyObj<DataService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;

  const mockArtwork = {
    _id: 'artwork123',
    title: 'Test Artwork',
    description: 'A test artwork description',
    images: 'test-image-url',
    category: 'Painting',
  };

  const mockReviewsResponse = {
    reviews: [
      {
        _id: 'review1',
        content: 'Great artwork',
        rating: 4,
        username: 'testuser',
        created_at: new Date(),
      },
    ],
    page: 1,
    pageSize: 5,
    totalPages: 1,
    totalReviews: 1,
  };

  beforeEach(async () => {
    const dataSpy = jasmine.createSpyObj('DataService', [
      'getArtworkById',
      'getArtworkReviews',
      'deleteArtworkReview',
    ]);
    const authSpy = jasmine.createSpyObj('AuthService', ['getUserRole']);
    const routeSpy = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('artwork123'),
        },
      },
    };

    await TestBed.configureTestingModule({
      imports: [ArtworkDetailComponent, CommonModule],
      providers: [
        { provide: DataService, useValue: dataSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: ActivatedRoute, useValue: routeSpy },
      ],
    }).compileComponents();

    dataSpy.getArtworkById.and.returnValue(of(mockArtwork));
    dataSpy.getArtworkReviews.and.returnValue(of(mockReviewsResponse));
    dataSpy.deleteArtworkReview.and.returnValue(of({}));
    authSpy.getUserRole.and.returnValue('ADMIN');

    fixture = TestBed.createComponent(ArtworkDetailComponent);
    component = fixture.componentInstance;
    dataServiceSpy = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    activatedRouteSpy = TestBed.inject(
      ActivatedRoute
    ) as jasmine.SpyObj<ActivatedRoute>;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Artwork Fetching', () => {
    it('should fetch artwork details on init', () => {
      expect(dataServiceSpy.getArtworkById).toHaveBeenCalledWith('artwork123');
      expect(component.artwork).toEqual(mockArtwork);
      expect(component.artworkImageUrl).toBe(mockArtwork.images);
    });

    it('should handle artwork fetch error', () => {
      const consoleErrorSpy = spyOn(console, 'error');
      dataServiceSpy.getArtworkById.and.returnValue(
        throwError(() => new Error('Fetch error'))
      );

      component.getArtwork('artwork123');

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching artwork data:',
        jasmine.any(Error)
      );
    });
  });

  describe('Reviews', () => {
    it('should fetch artwork reviews on init', () => {
      expect(dataServiceSpy.getArtworkReviews).toHaveBeenCalledWith(
        'artwork123',
        1
      );
      expect(component.reviews).toEqual(mockReviewsResponse.reviews);
      expect(component.currentPage).toBe(1);
      expect(component.totalPages).toBe(1);
    });

    it('should handle reviews fetch error', () => {
      const consoleErrorSpy = spyOn(console, 'error');
      dataServiceSpy.getArtworkReviews.and.returnValue(
        throwError(() => new Error('Reviews fetch error'))
      );

      component.getArtworkReviews('artwork123', 1);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching artwork reviews:',
        jasmine.any(Error)
      );
      expect(component.isLoading).toBeFalse();
    });

    it('should check if reviews are empty', () => {
      component.totalReviews = 0;
      component.isLoading = false;
      expect(component.isReviewsEmpty()).toBeTrue();

      component.totalReviews = 1;
      expect(component.isReviewsEmpty()).toBeFalse();
    });
  });

  describe('Pagination', () => {
    it('should navigate to previous page', () => {
      component.currentPage = 2;
      component.previousPage();
      expect(component.currentPage).toBe(1);
      expect(dataServiceSpy.getArtworkReviews).toHaveBeenCalledWith(
        'artwork123',
        1
      );
    });
  });

  describe('User Interactions', () => {
    it('should check if user is admin', () => {
      authServiceSpy.getUserRole.and.returnValue('ADMIN');
      expect(component.isAdminUser()).toBeTrue();

      authServiceSpy.getUserRole.and.returnValue('USER');
      expect(component.isAdminUser()).toBeFalse();
    });

    it('should delete review', () => {
      const review = { _id: 'review1' };
      component.artwork = mockArtwork;

      component.deleteReview(review);

      expect(dataServiceSpy.deleteArtworkReview).toHaveBeenCalledWith(
        mockArtwork._id,
        review._id
      );
      expect(dataServiceSpy.getArtworkReviews).toHaveBeenCalledWith(
        mockArtwork._id,
        component.currentPage
      );
    });

    it('should handle review deletion error', () => {
      const consoleErrorSpy = spyOn(console, 'error');
      const alertSpy = spyOn(window, 'alert');
      const review = { _id: 'review1' };
      component.artwork = mockArtwork;

      dataServiceSpy.deleteArtworkReview.and.returnValue(
        throwError(() => new Error('Delete failed'))
      );

      component.deleteReview(review);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Delete failed',
        jasmine.any(Error)
      );
      expect(alertSpy).toHaveBeenCalledWith('Failed to delete artwork');
    });
  });
});
