import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import SummaryCards from '../components/SummaryCards'
import TransactionForm from '../components/TransactionForm'
import TransactionList from '../components/TransactionList'
import Charts from '../components/Charts'
import api from '../utils/api'

const DashboardPage = () => {
  const [transactions, setTransactions] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const [transRes, summaryRes] = await Promise.all([
        api.get('/transactions'),
        api.get('/transactions/summary')
      ])
      setTransactions(transRes.data)
      setSummary(summaryRes.data)
    } catch (err) {
      console.error('Failed to fetch data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading your dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <SummaryCards summary={summary} />
        {/* Charts appear here — only shows when there's data */}
        <Charts transactions={transactions} summary={summary} />
        <TransactionForm onTransactionAdded={fetchData} />
        <TransactionList
          transactions={transactions}
          onTransactionDeleted={fetchData}
        />
      </div>
    </div>
  )
}

export default DashboardPage