'use client'

import { format } from 'date-fns'

export default function DateFormatter({ date }: { date: string | Date }) {
  if (!date) return null

  const parsed = typeof date === 'string' ? new Date(date) : date
  return <span>{format(parsed, 'dd MMM yyyy')}</span>
}
