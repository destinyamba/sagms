import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ExhibitionDetailComponent } from '../exhibition.detail.component';
import { DataService } from '../../../data.service';
import { AuthService } from '../../../auth.service';
import { provideHttpClient } from '@angular/common/http';

describe('ExhibitionDetailComponent', () => {
  let component: ExhibitionDetailComponent;
  let fixture: ComponentFixture<ExhibitionDetailComponent>;
  let mockDataService: jasmine.SpyObj<DataService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  const mockExhibition = {
    _id: '123',
    title: 'Test Exhibition',
    description: 'A test description',
    provenance: 'Test Provenance',
    artworks: ['art1', 'art2'],
    created_at: '2023-01-01T00:00:00Z',
  };

  const mockArtwork = { images: ['image1.jpg', 'image2.jpg'] };

  beforeEach(async () => {
    mockDataService = jasmine.createSpyObj('DataService', [
      'getExhibitionById',
      'getExhibitionReviews',
      'getArtworkById',
      'deleteExhibitionReview',
    ]);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getUserRole']);

    await TestBed.configureTestingModule({
      imports: [ExhibitionDetailComponent],
      declarations: [],
      providers: [
        { provide: DataService, useValue: mockDataService },
        { provide: AuthService, useValue: mockAuthService },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '123' } } },
        },
        provideHttpClient(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ExhibitionDetailComponent);
    component = fixture.componentInstance;
  });

  describe('Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should handle error in fetching exhibition details', fakeAsync(() => {
      const consoleErrorSpy = spyOn(console, 'error');
      mockDataService.getExhibitionById.and.returnValue(
        throwError(() => new Error('Error'))
      );

      fixture.detectChanges();
      tick();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching exhibition details:',
        jasmine.any(Error)
      );
    }));
  });
});
