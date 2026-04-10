import { Transaction, CATEGORIES, formatAmount, formatDate } from '@/lib/types'

interface TransactionCardProps {
  transaction: Transaction
}

export default function TransactionCard({ transaction }: TransactionCardProps) {
  const category = CATEGORIES.find(c => c.key === transaction.category) ?? CATEGORIES[CATEGORIES.length - 1]
  const isIncome = transaction.type === 'income'

  return (
    <div className="flex items-center justify-between p-5 hover:bg-[#2c2c2c] transition-colors cursor-pointer rounded-xl group">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl ${isIncome ? 'bg-[#aaffdc]/10' : 'bg-[#262626]'} flex items-center justify-center flex-shrink-0`}>
          <span className={`material-symbols-outlined ${isIncome ? 'text-[#aaffdc]' : category.color}`}>
            {category.icon}
          </span>
        </div>
        <div>
          <p className="font-bold text-white">{transaction.note || category.label}</p>
          <p className="text-xs text-[#adaaaa]">
            {category.label} • {formatDate(transaction.date)}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p
          className="font-bold"
          style={{
            fontFamily: 'Manrope, sans-serif',
            color: isIncome ? '#aaffdc' : '#ffffff',
          }}
        >
          {isIncome ? '+' : '-'}{formatAmount(transaction.amount)}
        </p>
        <p className="text-[10px] uppercase tracking-widest font-semibold text-[#adaaaa]">
          {transaction.date === new Date().toISOString().split('T')[0] ? 'Today' : 'Cleared'}
        </p>
      </div>
    </div>
  )
}
