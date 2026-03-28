// Formats numbers as currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY'
  }).format(amount)
}

const SummaryCards = ({ summary }) => {
  const balance = parseFloat(summary?.balance || 0)
  const totalIncome = parseFloat(summary?.total_income || 0)
  const totalExpenses = parseFloat(summary?.total_expenses || 0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

      {/* Balance Card */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
        <p className="text-blue-100 text-sm font-medium">Total Balance</p>
        <p className="text-3xl font-bold mt-1">{formatCurrency(balance)}</p>
      </div>

      {/* Income Card */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-green-500 text-lg">↑</span>
          <p className="text-gray-500 text-sm font-medium">Total Income</p>
        </div>
        <p className="text-2xl font-bold text-gray-800">{formatCurrency(totalIncome)}</p>
      </div>

      {/* Expenses Card */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-red-500 text-lg">↓</span>
          <p className="text-gray-500 text-sm font-medium">Total Expenses</p>
        </div>
        <p className="text-2xl font-bold text-gray-800">{formatCurrency(totalExpenses)}</p>
      </div>

    </div>
  )
}

export default SummaryCards