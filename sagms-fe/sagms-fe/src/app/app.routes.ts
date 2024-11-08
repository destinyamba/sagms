import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { ExhibitionsComponent } from './exhibitions.component';
import { ArtworksComponent } from './artworks.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'artworks', component: ArtworksComponent },
  { path: 'artworks/:id', component: ArtworksComponent },
  { path: 'exhibitions', component: ExhibitionsComponent },
  { path: 'exhibitions/:id', component: ExhibitionsComponent },
];
