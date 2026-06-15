import { cn } from '@/lib/utils'
import { FailedPaymentStatus } from '@/types'

const config: Record<FailedPaymentStatus, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  email_sent: { label: 'Email Sent', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  recovered: { label: 'Recovered', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  failed: { label: 'Failed', className: 'bg-red-50 text-red-700 border-red-200' },
  max_emails_reached: { label: 'Max Emails', className: 'bg-gray-50 text-gray-600 border-gray-200' },
  cancelled: { label: 'Cancelled', className: 'bg-gray-50 text-gray-500 border-gray-200' },
}

export function StatusBadge({ status }: { status: FailedPaymentStatus }) {
  const { label, className } = config[status]
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border', className)}>
      {label}
    </span>
  )
}
