export interface Artwork {
  average_rating: number | null;
  _id: string;
  title: string;
  description: string;
  images: string[];
  created_at: string;
  updated_at: string;
}

export interface Exhibition {
  _id: string;
  title: string;
  description: string;
  provenance: string;
  artworks: string[];
  created_at: string;
  updated_at: string;
}

export interface TopExhibition {
  exhibition_id: string;
  review_count: number;
  title: string;
  image?: string;
}

export interface ArtworkRating {
  _id: string;
  average_rating: number;
}
