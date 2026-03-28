import api from '../utils/api'

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY'
  }).format(amount)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const TransactionList = ({ transactions, onTransactionDeleted }) => {

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return
    try {
      await api.delete(`/transactions/${id}`)
      onTransactionDeleted()
    } catch (err) {
      console.error('Failed to delete:', err)
    }
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
        <p className="text-4xl mb-3">📭</p>
        <p className="text-gray-500">No transactions yet. Add your first one above!</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-800">Transactions</h2>
      </div>

      <div className="divide-y divide-gray-50">
        {transactions.map(transaction => (
          <div
            key={transaction.id}
            className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
          >
            {/* Left side — category + description + date */}
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg
                ${transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                {transaction.type === 'income' ? '↑' : '↓'}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{transaction.category}</p>
                <p className="text-sm text-gray-400">
                  {transaction.description || '—'} · {formatDate(transaction.date)}
                </p>
              </div>
            </div>

            {/* Right side — amount + delete */}
            <div className="flex items-center gap-4">
              <span className={`font-bold text-lg
                ${transaction.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                {transaction.type === 'income' ? '+' : '-'}
                {formatCurrency(transaction.amount)}
              </span>
              <button
                onClick={() => handleDelete(transaction.id)}
                className="text-gray-300 hover:text-red-500 transition-colors text-xl"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TransactionList