import React, { useEffect, useState } from 'react'
import { useWealthStore, Account } from '../../stores/wealthStore'
import { Wallet, TrendingUp, TrendingDown, DollarSign, Plus, RefreshCw, Link, PieChart, Activity } from 'lucide-react'
import { formatCurrency, formatDate } from '../../utils/formatters'

type WealthTab = 'overview' | 'accounts' | 'transactions' | 'portfolio'

const ACCOUNT_TYPE_ICONS: Record<string, string> = {
  checking: '💳',
  savings: '🏦',
  investment: '📈',
  credit: '💳',
  loan: '📄',
  property: '🏠',
  other: '📦',
}

const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  checking: 'Checking',
  savings: 'Savings',
  investment: 'Investment',
  credit: 'Credit Card',
  loan: 'Loan',
  property: 'Property',
  other: 'Other',
}

export const WealthView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<WealthTab>('overview')
  const {
    accounts,
    transactions,
    portfolio,
    selectedAccount,
    isLoading,
    plaidLinkToken,
    fetchAccounts,
    fetchPortfolio,
    fetchTransactions,
    createPlaidLink,
    syncPlaidAccounts,
    selectAccount,
    getTotalBalance,
    getAccountTypeBreakdown,
    getMonthlyCashFlow,
  } = useWealthStore()

  useEffect(() => {
    fetchAccounts()
    fetchPortfolio()
  }, [fetchAccounts, fetchPortfolio])

  useEffect(() => {
    if (selectedAccount) {
      fetchTransactions(selectedAccount.id)
    }
  }, [selectedAccount, fetchTransactions])

  const totalBalance = getTotalBalance()
  const typeBreakdown = getAccountTypeBreakdown()
  const cashFlow = getMonthlyCashFlow()

  const renderOverview = () => (
    <div className="fox-wealth-overview">
      <div className="fox-wealth-cards">
        <div className="fox-wealth-card fox-wealth-total">
          <div className="fox-wealth-card-header">
            <Wallet size={24} />
            <span>Total Net Worth</span>
          </div>
          <div className="fox-wealth-card-value">
            {formatCurrency(totalBalance)}
          </div>
          <div className="fox-wealth-card-change">
            {portfolio?.performance?.monthly >= 0 ? (
              <>
                <TrendingUp size={16} />
                <span className="positive">+{portfolio.performance.monthly.toFixed(2)}% this month</span>
              </>
            ) : (
              <>
                <TrendingDown size={16} />
                <span className="negative">{portfolio.performance.monthly.toFixed(2)}% this month</span>
              </>
            )}
          </div>
        </div>

        <div className="fox-wealth-card fox-wealth-cashflow">
          <div className="fox-wealth-card-header">
            <Activity size={24} />
            <span>Monthly Cash Flow</span>
          </div>
          <div className="fox-cashflow-grid">
            <div className="fox-cashflow-item">
              <span className="fox-cashflow-label">Income</span>
              <span className="fox-cashflow-value positive">+{formatCurrency(cashFlow.income)}</span>
            </div>
            <div className="fox-cashflow-item">
              <span className="fox-cashflow-label">Expenses</span>
              <span className="fox-cashflow-value negative">-{formatCurrency(cashFlow.expenses)}</span>
            </div>
            <div className="fox-cashflow-item fox-cashflow-net">
              <span className="fox-cashflow-label">Net</span>
              <span className={`fox-cashflow-value ${cashFlow.income - cashFlow.expenses >= 0 ? 'positive' : 'negative'}`}>
                {formatCurrency(cashFlow.income - cashFlow.expenses)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="fox-wealth-section">
        <h3>Asset Allocation</h3>
        <div className="fox-allocation-grid">
          {Object.entries(typeBreakdown).map(([type, value]) => {
            const percentage = totalBalance > 0 ? (value / totalBalance) * 100 : 0
            return (
              <div key={type} className="fox-allocation-item">
                <div className="fox-allocation-header">
                  <span className="fox-allocation-icon">{ACCOUNT_TYPE_ICONS[type]}</span>
                  <span className="fox-allocation-name">{ACCOUNT_TYPE_LABELS[type]}</span>
                  <span className="fox-allocation-percent">{percentage.toFixed(1)}%</span>
                </div>
                <div className="fox-allocation-bar-container">
                  <div
                    className="fox-allocation-bar"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="fox-allocation-value">{formatCurrency(value)}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )

  const renderAccounts = () => (
    <div className="fox-wealth-accounts">
      <div className="fox-list-toolbar">
        <div className="fox-search-wrapper">
          <input type="text" placeholder="Search accounts..." className="fox-input" />
        </div>
        <div className="fox-wealth-actions">
          <button
            className="fox-btn fox-btn-secondary"
            onClick={createPlaidLink}
            disabled={isLoading}
          >
            <Link size={16} />
            Connect Bank
          </button>
          <button
            className="fox-btn fox-btn-secondary"
            onClick={syncPlaidAccounts}
            disabled={isLoading}
          >
            <RefreshCw size={16} />
            Sync
          </button>
          <button className="fox-btn fox-btn-primary">
            <Plus size={16} />
            Add Account
          </button>
        </div>
      </div>

      <div className="fox-table-wrapper">
        <table className="fox-table fox-wealth-table">
          <thead>
            <tr>
              <th>Account</th>
              <th>Institution</th>
              <th>Type</th>
              <th>Balance</th>
              <th>Last Updated</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account: Account) => (
              <tr
                key={account.id}
                onClick={() => selectAccount(account)}
                className={selectedAccount?.id === account.id ? 'selected' : ''}
              >
                <td>
                  <div className="fox-account-name">
                    <span className="fox-account-icon">{ACCOUNT_TYPE_ICONS[account.type]}</span>
                    <span>{account.name}</span>
                  </div>
                </td>
                <td>{account.institution}</td>
                <td>
                  <span className="fox-badge fox-badge-default">
                    {ACCOUNT_TYPE_LABELS[account.type]}
                  </span>
                </td>
                <td className="fox-cell-amount">
                  {formatCurrency(account.balance)}
                </td>
                <td className="fox-cell-date">
                  {formatDate(account.lastUpdated)}
                </td>
                <td>
                  {!account.isActive && (
                    <span className="fox-badge fox-badge-warning">Inactive</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderTransactions = () => (
    <div className="fox-wealth-transactions">
      {!selectedAccount ? (
        <div className="fox-empty">
          <div className="fox-empty-icon">💳</div>
          <div className="fox-empty-title">Select an Account</div>
          <div className="fox-empty-description">
            Choose an account from the Accounts tab to view transactions.
          </div>
        </div>
      ) : (
        <>
          <div className="fox-transactions-header">
            <h3>{selectedAccount.name} Transactions</h3>
            <button
              className="fox-btn fox-btn-secondary fox-btn-sm"
              onClick={() => selectAccount(null)}
            >
              Back to Accounts
            </button>
          </div>

          <div className="fox-table-wrapper">
            <table className="fox-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="fox-cell-date">{formatDate(transaction.date)}</td>
                    <td>{transaction.description}</td>
                    <td>
                      {transaction.category && (
                        <span className="fox-badge fox-badge-default">{transaction.category}</span>
                      )}
                    </td>
                    <td className={`fox-cell-amount ${transaction.type}`}>
                      {transaction.type === 'credit' ? '+' : '-'}
                      {formatCurrency(Math.abs(transaction.amount))}
                    </td>
                    <td>
                      {transaction.isPending ? (
                        <span className="fox-badge fox-badge-warning">Pending</span>
                      ) : (
                        <span className="fox-badge fox-badge-success">Cleared</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )

  const renderPortfolio = () => (
    <div className="fox-wealth-portfolio">
      {portfolio ? (
        <>
          <div className="fox-portfolio-header">
            <div className="fox-portfolio-value">
              <span className="fox-portfolio-label">Portfolio Value</span>
              <span className="fox-portfolio-amount">{formatCurrency(portfolio.totalValue)}</span>
            </div>
            <div className="fox-portfolio-performance">
              {Object.entries(portfolio.performance || {}).map(([period, value]) => (
                <div key={period} className="fox-performance-item">
                  <span className="fox-performance-period">{period}</span>
                  <span className={`fox-performance-value ${value >= 0 ? 'positive' : 'negative'}`}>
                    {value >= 0 ? '+' : ''}{value.toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {portfolio.allocation && (
            <div className="fox-portfolio-allocation">
              <h4>Asset Allocation</h4>
              <div className="fox-allocation-chart">
                {portfolio.allocation.map((item) => (
                  <div key={item.category} className="fox-allocation-segment">
                    <div
                      className="fox-allocation-fill"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: getCategoryColor(item.category)
                      }}
                    />
                    <span className="fox-allocation-label">
                      {item.category} ({item.percentage.toFixed(1)}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="fox-empty">
          <div className="fox-empty-icon">📊</div>
          <div className="fox-empty-title">No Portfolio Data</div>
          <div className="fox-empty-description">
            Connect investment accounts to see your portfolio analytics.
          </div>
        </div>
      )}
    </div>
  )

  function getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
      stocks: '#3b82f6',
      bonds: '#10b981',
      cash: '#f59e0b',
      crypto: '#8b5cf6',
      commodities: '#ef4444',
      other: '#6b7280',
    }
    return colors[category.toLowerCase()] || '#6b7280'
  }

  return (
    <div className="fox-wealth-view">
      <div className="fox-wealth-header">
        <div className="fox-wealth-title">
          <h2>Wealth Intelligence</h2>
        </div>
        <div className="fox-wealth-quick-stats">
          <div className="fox-stat-card">
            <Wallet size={16} />
            <span>{accounts.length} Accounts</span>
          </div>
          <div className="fox-stat-card">
            <PieChart size={16} />
            <span>{formatCurrency(totalBalance)}</span>
          </div>
        </div>
      </div>

      <div className="fox-directory-tabs">
        <button
          className={`fox-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <Activity size={18} />
          Overview
        </button>
        <button
          className={`fox-tab ${activeTab === 'accounts' ? 'active' : ''}`}
          onClick={() => setActiveTab('accounts')}
        >
          <Wallet size={18} />
          Accounts
        </button>
        <button
          className={`fox-tab ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveTab('transactions')}
        >
          <DollarSign size={18} />
          Transactions
        </button>
        <button
          className={`fox-tab ${activeTab === 'portfolio' ? 'active' : ''}`}
          onClick={() => setActiveTab('portfolio')}
        >
          <PieChart size={18} />
          Portfolio
        </button>
      </div>

      <div className="fox-wealth-content">
        {isLoading ? (
          <div className="fox-loading">Loading...</div>
        ) : (
          <>
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'accounts' && renderAccounts()}
            {activeTab === 'transactions' && renderTransactions()}
            {activeTab === 'portfolio' && renderPortfolio()}
          </>
        )}
      </div>
    </div>
  )
}
