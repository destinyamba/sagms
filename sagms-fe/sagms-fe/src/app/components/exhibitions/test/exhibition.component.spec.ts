import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { ExhibitionsComponent } from '../exhibitions.component';
import { DataService } from '../../../data.service';
import { AuthService } from '../../../auth.service';
import { provideHttpClient } from '@angular/common/http';

describe('ExhibitionsComponent', () => {
  let component: ExhibitionsComponent;
  let fixture: ComponentFixture<ExhibitionsComponent>;
  let mockDataService: jasmine.SpyObj<DataService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockDataService = jasmine.createSpyObj('DataService', [
      'getExhibitions',
      'getTotalExhibitions',
      'getArtworkById',
    ]);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getUserRole']);

    await TestBed.configureTestingModule({
      imports: [ExhibitionsComponent],
      declarations: [],
      providers: [
        { provide: DataService, useValue: mockDataService },
        { provide: AuthService, useValue: mockAuthService },
        provideHttpClient(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ExhibitionsComponent);
    component = fixture.componentInstance;

    mockDataService.getExhibitions.and.returnValue(of([]));
    mockDataService.getTotalExhibitions.and.returnValue(of(0));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display "Related Exhibitions" header', () => {
    fixture.detectChanges();
    const header = fixture.debugElement.query(By.css('h1.text-center'));
    expect(header.nativeElement.textContent).toContain('Related Exhibitions');
  });

  it('should determine if the user is a curator', () => {
    mockAuthService.getUserRole.and.returnValue('CURATOR');
    expect(component.isCurator()).toBeTrue();
  });
});
