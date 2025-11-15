import Stripe from 'stripe';

export interface UserDetails {
  id: string;
  first_name: string;
  last_name: string;
  full_name?: string;
  avatar_url?: string;
  billing_address?: Stripe.Address;
  payment_method?: Stripe.PaymentMethod[keyof Stripe.PaymentMethod];
}

export interface Product {
  id: string;
  active?: boolean;
  name?: string;
  description?: string;
  image?: string;
  metadata?: Stripe.Metadata;
}

export interface Price {
  id: string;
  product_id?: string;
  active?: boolean;
  description?: string;
  unit_amount?: number;
  currency?: string;
  type?: Stripe.Price.Type;
  interval?: Stripe.Price.Recurring.Interval;
  interval_count?: number;
  trial_days?: number | null;
  metadata?: Stripe.Metadata;
  product?: Product;
}

export interface Subscription {
  id: string;
  user_id: string;
  status?: string;
  metadata?: Stripe.Metadata;
  price_id?: string;
  quantity?: number;
  cancel_at?: string;
  cancel_at_period_end?: boolean;
  canceled_at?: string;
  ended_at?: string;
  created: string;
  current_period_start?: string;
  current_period_end?: string;
  trial_start?: string;
  trial_end?: string;
}

export enum SongStatus {
  Approved = 'approved',
  Pending = 'pending',
  Rejected = 'rejected',
}
export interface Song {
  id: number;
  user_id: string;
  author: string;
  artist_id: string;
  title: string;
  image_path: string;
  album: string;
  album_id: string;
  song_path: string;
  genre: string;
  status: SongStatus;
}

export interface Artist {
  id: string;
  name: string;
  image_path: string;
}

export interface Album {
  id: string;
  artist_id: string;
  title: string;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
}

export interface PlaylistSong {
  id: string;
  playlist_id: string;
  song_id: string;
}

export interface PlayHistory {
  id: string;
  song_id: string;
  user_id: string;
  played_at: string;
}

export interface ProductWithPrice extends Product {
  prices?: Price[];
}
