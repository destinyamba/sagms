import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ExhibitionsComponent } from './components/exhibitions/exhibitions.component';
import { ArtworksComponent } from './components/artworks/artworks.component';
import { ArtworkDetailComponent } from './components/artwork.detail/artwork.detail.component';
import { ExhibitionDetailComponent } from './components/exhibition.detail/exhibition.detail.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NgModule } from '@angular/core';
import { ArtistRelatedArtworksComponent } from './components/artist-related-artworks/artist.related.artworks.component';
import { CuratorRelatedExhibitionsComponent } from './components/curator-related-exhibitions/curator.related.exhibitions.component';
import { TestDataServiceComponent } from './testDataService.spec';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'artworks', component: ArtworksComponent },
  { path: 'artworks/:id', component: ArtworkDetailComponent },
  { path: 'exhibitions', component: ExhibitionsComponent },
  { path: 'exhibitions/:id', component: ExhibitionDetailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'related-artworks', component: ArtistRelatedArtworksComponent },
  {
    path: 'related-exhibitions',
    component: CuratorRelatedExhibitionsComponent,
  },
  {
    path: 'test-report',
    component: TestDataServiceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
