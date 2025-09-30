import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Instead of throwing, export a nullable client to allow frontend to run without Supabase
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Database types
export interface NewsArticle {
  id?: number
  title: string
  summary: string
  url: string
  source: string
  date: string
  category: string
  image_url?: string
  created_at?: string
  updated_at?: string
}