export interface Artwork {
  average_rating: number | null;
  _id: string;
  title: string;
  description: string;
  images: string;
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
  artworkImage?: string;
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

export interface Review {
  _id: string;
  content: string;
  created_at: string;
  rating: number;
  reviewer_id: string;
  username: string;
}

export interface ReviewsResponse {
  reviews: Review[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalReviews: number;
}

export const dimensionRanges: DimensionRange[] = [
  {
    label: 'All Sizes',
    height: { min: 0, max: 1000 },
    width: { min: 0, max: 1000 },
  },
  {
    label: '0-100 cm',
    height: { min: 0, max: 100 },
    width: { min: 0, max: 100 },
  },
  {
    label: '101-200 cm',
    height: { min: 101, max: 200 },
    width: { min: 101, max: 200 },
  },
  {
    label: '201-300 cm',
    height: { min: 201, max: 300 },
    width: { min: 201, max: 300 },
  },
  {
    label: '301-400 cm',
    height: { min: 301, max: 400 },
    width: { min: 301, max: 400 },
  },
  {
    label: '401+ cm',
    height: { min: 401, max: 1000 },
    width: { min: 401, max: 1000 },
  },
];

export interface DimensionRange {
  label: string;
  height: { min: number; max: number };
  width: { min: number; max: number };
}
