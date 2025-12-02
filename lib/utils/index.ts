import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { customAlphabet } from 'nanoid'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate unique IDs for database records
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 12)
export const generateId = () => nanoid()

// Format numbers for display
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

// Format duration from milliseconds to MM:SS
export function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// Format date for display
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

// Format relative time (e.g., "2 hours ago")
export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'just now'
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`
  }

  return formatDate(date)
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

// Get image URL with fallback
export function getImageUrl(images: Array<{ url: string; height?: number; width?: number }>, size: 'small' | 'medium' | 'large' = 'medium'): string {
  if (!images || images.length === 0) {
    return '/placeholder-playlist.png' // You'll need to add this placeholder image
  }

  // Sort images by size (largest first)
  const sortedImages = [...images].sort((a, b) => {
    const aSize = (a.width || 0) * (a.height || 0)
    const bSize = (b.width || 0) * (b.height || 0)
    return bSize - aSize
  })

  switch (size) {
    case 'small':
      return sortedImages[sortedImages.length - 1]?.url || sortedImages[0]?.url
    case 'large':
      return sortedImages[0]?.url
    case 'medium':
    default:
      const midIndex = Math.floor(sortedImages.length / 2)
      return sortedImages[midIndex]?.url || sortedImages[0]?.url
  }
}

// Debounce function for search inputs
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Parse array from query string
export function parseArrayFromQuery(value: string | string[] | undefined): string[] {
  if (!value) return []
  if (Array.isArray(value)) return value
  return value.split(',').filter(Boolean)
}

// Build query string from object
export function buildQueryString(params: Record<string, string | number | boolean | null | undefined | string[]>): string {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          searchParams.set(key, value.join(','))
        }
      } else {
        searchParams.set(key, String(value))
      }
    }
  })

  return searchParams.toString()
}