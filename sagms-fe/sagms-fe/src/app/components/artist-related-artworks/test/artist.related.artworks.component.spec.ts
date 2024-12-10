import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ArtistRelatedArtworksComponent } from '../artist.related.artworks.component';
import { DataService } from '../../../data.service';
import { AuthService } from '../../../auth.service';
import { provideHttpClient } from '@angular/common/http';

describe('ArtistRelatedArtworksComponent', () => {
  let component: ArtistRelatedArtworksComponent;
  let fixture: ComponentFixture<ArtistRelatedArtworksComponent>;

  beforeEach(() => {
    const dataServiceMock = jasmine.createSpyObj('DataService', [
      'getArtistRelatedArtworks',
      'deleteArtwork',
      'editArtwork',
    ]);

    const authServiceMock = jasmine.createSpyObj('AuthService', [
      'getUserId',
      'getToken',
    ]);

    TestBed.configureTestingModule({
      imports: [ArtistRelatedArtworksComponent],
      providers: [
        { provide: DataService, useValue: dataServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        provideHttpClient(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ArtistRelatedArtworksComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should update page numbers correctly', () => {
    component.totalPages = 10;
    component.page = 5;

    component.generatePageNumbers();

    expect(component.pageNumbers).toEqual([3, 4, 5, 6, 7]);
  });

  it('should call `getArtworks` on page change', () => {
    spyOn(component, 'getArtworks');

    component.goToPage(3);

    expect(component.page).toBe(3);
    expect(sessionStorage['page']).toBe('3');
    expect(component.getArtworks).toHaveBeenCalled();
  });
});
