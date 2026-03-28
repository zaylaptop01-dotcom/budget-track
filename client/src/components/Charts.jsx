import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts'

// Colors for pie chart slices
const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6']

const formatCurrency = (value) => {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY'
  }).format(value)
}

const Charts = ({ transactions, summary }) => {
  // Build pie chart data — group expenses by category
  const expenseByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const existing = acc.find(item => item.name === t.category)
      if (existing) {
        existing.value += parseFloat(t.amount)
      } else {
        acc.push({ name: t.category, value: parseFloat(t.amount) })
      }
      return acc
    }, [])

  // Build bar chart data
  const barData = [
    {
      name: 'Overview',
      Income: parseFloat(summary?.total_income || 0),
      Expenses: parseFloat(summary?.total_expenses || 0)
    }
  ]

  // Don't show charts if no data
  if (transactions.length === 0) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

      {/* Pie Chart — Expenses by Category */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          Spending by Category
        </h2>

        {expenseByCategory.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-gray-400">
            No expenses yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={expenseByCategory}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {expenseByCategory.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Bar Chart — Income vs Expenses */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          Income vs Expenses
        </h2>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={barData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" hide />
            <YAxis
              tickFormatter={(value) =>
                new Intl.NumberFormat('ja-JP', {
                  notation: 'compact',
                  currency: 'JPY'
                }).format(value)
              }
            />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
            <Bar dataKey="Income" fill="#10b981" radius={[6, 6, 0, 0]} />
            <Bar dataKey="Expenses" fill="#ef4444" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  )
}

export default Charts