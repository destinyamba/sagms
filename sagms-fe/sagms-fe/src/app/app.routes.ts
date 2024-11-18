import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ExhibitionsComponent } from './components/exhibitions/exhibitions.component';
import { ArtworksComponent } from './components/artworks/artworks.component';
import { ArtworkDetailComponent } from './components/artwork.detail/artwork.detail.component';
import { ExhibitionDetailComponent } from './components/exhibition.detail/exhibition.detail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'artworks', component: ArtworksComponent },
  { path: 'artworks/:id', component: ArtworkDetailComponent },
  { path: 'exhibitions', component: ExhibitionsComponent },
  { path: 'exhibitions/:id', component: ExhibitionDetailComponent },
];
