export type TransactionType = 'income' | 'expense'

export type TransactionCategory =
  | 'food'
  | 'travel'
  | 'work'
  | 'shopping'
  | 'health'
  | 'housing'
  | 'transport'
  | 'entertainment'
  | 'investment'
  | 'other'

export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  current_balance: number
  currency: string
  // Required by global rule
  wins: number
  games_played: number
  total_capital: number
  character_usage: Record<string, number>
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  user_id: string
  amount: number
  type: TransactionType
  category: TransactionCategory
  wallet: string
  note: string | null
  date: string
  created_at: string
}

export interface Goal {
  id: string
  user_id: string
  title: string
  subtitle: string | null
  icon: string
  target_amount: number
  current_amount: number
  color: 'primary' | 'secondary' | 'tertiary'
  target_date: string | null
  created_at: string
}

export interface CategoryInfo {
  key: TransactionCategory
  label: string
  icon: string
  color: string
  bgColor: string
}

export const CATEGORIES: CategoryInfo[] = [
  { key: 'food', label: 'Food', icon: 'restaurant', color: 'text-secondary', bgColor: 'bg-secondary/10' },
  { key: 'travel', label: 'Travel', icon: 'flight', color: 'text-tertiary', bgColor: 'bg-tertiary/10' },
  { key: 'work', label: 'Work', icon: 'work', color: 'text-primary', bgColor: 'bg-primary/10' },
  { key: 'shopping', label: 'Shop', icon: 'shopping_cart', color: 'text-secondary', bgColor: 'bg-secondary/10' },
  { key: 'health', label: 'Health', icon: 'fitness_center', color: 'text-tertiary', bgColor: 'bg-tertiary/10' },
  { key: 'housing', label: 'Housing', icon: 'house', color: 'text-primary', bgColor: 'bg-primary/10' },
  { key: 'transport', label: 'Transport', icon: 'commute', color: 'text-secondary', bgColor: 'bg-secondary/10' },
  { key: 'entertainment', label: 'Fun', icon: 'movie', color: 'text-tertiary', bgColor: 'bg-tertiary/10' },
  { key: 'investment', label: 'Invest', icon: 'account_balance', color: 'text-primary', bgColor: 'bg-primary/10' },
  { key: 'other', label: 'Other', icon: 'category', color: 'text-on-surface-variant', bgColor: 'bg-surface-container-highest' },
]

export function formatAmount(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === now.toDateString()) return 'Today'
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
