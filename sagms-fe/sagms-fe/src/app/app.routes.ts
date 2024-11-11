import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ExhibitionsComponent } from './exhibitions/exhibitions.component';
import { ArtworksComponent } from './artworks/artworks.component';
import { ArtworkDetailComponent } from './artwork.detail/artwork.detail.component';
import { ExhibitionDetailComponent } from './exhibition.detail/exhibition.detail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'artworks', component: ArtworksComponent },
  { path: 'artworks/:id', component: ArtworkDetailComponent },
  { path: 'exhibitions', component: ExhibitionsComponent },
  { path: 'exhibitions/:id', component: ExhibitionDetailComponent },
];
