import React, { useState, useEffect } from 'react'
import { useBillingStore, Quote, Order, Invoice } from '../../stores/billingStore'
import { FileText, Package, Receipt, Plus, Search, Filter, MoreHorizontal, Send, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { formatCurrency, formatDate } from '../../utils/formatters'

type BillingTab = 'quotes' | 'orders' | 'invoices'

const STATUS_CONFIG = {
  quote: {
    draft: { color: 'default', icon: Clock },
    sent: { color: 'info', icon: Send },
    accepted: { color: 'success', icon: CheckCircle },
    rejected: { color: 'error', icon: AlertCircle },
    expired: { color: 'warning', icon: Clock },
  },
  order: {
    pending: { color: 'warning', icon: Clock },
    processing: { color: 'info', icon: Clock },
    shipped: { color: 'info', icon: Package },
    delivered: { color: 'success', icon: CheckCircle },
    cancelled: { color: 'error', icon: AlertCircle },
  },
  invoice: {
    draft: { color: 'default', icon: Clock },
    sent: { color: 'info', icon: Send },
    paid: { color: 'success', icon: CheckCircle },
    overdue: { color: 'error', icon: AlertCircle },
    cancelled: { color: 'error', icon: AlertCircle },
  },
}

export const BillingView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<BillingTab>('quotes')
  const {
    quotes,
    orders,
    invoices,
    isLoading,
    fetchQuotes,
    fetchOrders,
    fetchInvoices,
    selectQuote,
    selectOrder,
    selectInvoice,
  } = useBillingStore()

  useEffect(() => {
    if (activeTab === 'quotes') fetchQuotes()
    else if (activeTab === 'orders') fetchOrders()
    else if (activeTab === 'invoices') fetchInvoices()
  }, [activeTab, fetchQuotes, fetchOrders, fetchInvoices])

  const getTotals = () => {
    const quotesTotal = quotes.reduce((sum, q) => sum + q.total, 0)
    const ordersTotal = orders.reduce((sum, o) => sum + o.total, 0)
    const invoicesTotal = invoices.reduce((sum, i) => sum + i.total, 0)
    const paidTotal = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total, 0)
    const pendingTotal = invoicesTotal - paidTotal
    
    return { quotesTotal, ordersTotal, invoicesTotal, paidTotal, pendingTotal }
  }

  const totals = getTotals()

  const renderQuotesList = () => (
    <div className="fox-billing-list">
      <div className="fox-billing-toolbar">
        <div className="fox-search-wrapper">
          <Search size={16} className="fox-search-icon" />
          <input type="text" placeholder="Search quotes..." className="fox-input fox-search-input" />
        </div>
        <div className="fox-billing-actions">
          <button className="fox-btn fox-btn-secondary">
            <Filter size={16} />
            Filter
          </button>
          <button className="fox-btn fox-btn-primary">
            <Plus size={16} />
            New Quote
          </button>
        </div>
      </div>

      <div className="fox-table-wrapper">
        <table className="fox-table fox-billing-table">
          <thead>
            <tr>
              <th>Quote #</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Total</th>
              <th>Valid Until</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((quote: Quote) => {
              const statusConfig = STATUS_CONFIG.quote[quote.status]
              const StatusIcon = statusConfig.icon
              return (
                <tr key={quote.id} onClick={() => selectQuote(quote)}>
                  <td className="fox-cell-id">{quote.quoteNumber}</td>
                  <td>
                    <div className="fox-cell-contact">
                      <span className="fox-contact-name">{quote.contactName}</span>
                      {quote.organizationName && (
                        <span className="fox-org-name">{quote.organizationName}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`fox-badge fox-badge-${statusConfig.color}`}>
                      <StatusIcon size={12} />
                      {quote.status}
                    </span>
                  </td>
                  <td className="fox-cell-amount">{formatCurrency(quote.total)}</td>
                  <td className="fox-cell-date">
                    {quote.validUntil ? formatDate(quote.validUntil) : '—'}
                  </td>
                  <td>
                    <button className="fox-btn fox-btn-ghost fox-btn-sm">
                      <MoreHorizontal size={14} />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderOrdersList = () => (
    <div className="fox-billing-list">
      <div className="fox-billing-toolbar">
        <div className="fox-search-wrapper">
          <Search size={16} className="fox-search-icon" />
          <input type="text" placeholder="Search orders..." className="fox-input fox-search-input" />
        </div>
        <div className="fox-billing-actions">
          <button className="fox-btn fox-btn-secondary">
            <Filter size={16} />
            Filter
          </button>
          <button className="fox-btn fox-btn-primary">
            <Plus size={16} />
            New Order
          </button>
        </div>
      </div>

      <div className="fox-table-wrapper">
        <table className="fox-table fox-billing-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Total</th>
              <th>Created</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: Order) => {
              const statusConfig = STATUS_CONFIG.order[order.status]
              const StatusIcon = statusConfig.icon
              return (
                <tr key={order.id} onClick={() => selectOrder(order)}>
                  <td className="fox-cell-id">{order.orderNumber}</td>
                  <td>
                    <div className="fox-cell-contact">
                      <span className="fox-contact-name">{order.contactName}</span>
                      {order.organizationName && (
                        <span className="fox-org-name">{order.organizationName}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`fox-badge fox-badge-${statusConfig.color}`}>
                      <StatusIcon size={12} />
                      {order.status}
                    </span>
                  </td>
                  <td className="fox-cell-amount">{formatCurrency(order.total)}</td>
                  <td className="fox-cell-date">{formatDate(order.createdAt)}</td>
                  <td>
                    <button className="fox-btn fox-btn-ghost fox-btn-sm">
                      <MoreHorizontal size={14} />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderInvoicesList = () => (
    <div className="fox-billing-list">
      <div className="fox-billing-toolbar">
        <div className="fox-search-wrapper">
          <Search size={16} className="fox-search-icon" />
          <input type="text" placeholder="Search invoices..." className="fox-input fox-search-input" />
        </div>
        <div className="fox-billing-actions">
          <button className="fox-btn fox-btn-secondary">
            <Filter size={16} />
            Filter
          </button>
          <button className="fox-btn fox-btn-primary">
            <Plus size={16} />
            New Invoice
          </button>
        </div>
      </div>

      <div className="fox-table-wrapper">
        <table className="fox-table fox-billing-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Total</th>
              <th>Due Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice: Invoice) => {
              const statusConfig = STATUS_CONFIG.invoice[invoice.status]
              const StatusIcon = statusConfig.icon
              return (
                <tr key={invoice.id} onClick={() => selectInvoice(invoice)}>
                  <td className="fox-cell-id">{invoice.invoiceNumber}</td>
                  <td>
                    <div className="fox-cell-contact">
                      <span className="fox-contact-name">{invoice.contactName}</span>
                      {invoice.organizationName && (
                        <span className="fox-org-name">{invoice.organizationName}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`fox-badge fox-badge-${statusConfig.color}`}>
                      <StatusIcon size={12} />
                      {invoice.status}
                    </span>
                  </td>
                  <td className="fox-cell-amount">{formatCurrency(invoice.total)}</td>
                  <td className="fox-cell-date">
                    {formatDate(invoice.dueDate)}
                    {invoice.status === 'overdue' && (
                      <span className="fox-overdue-indicator">Overdue</span>
                    )}
                  </td>
                  <td>
                    <button className="fox-btn fox-btn-ghost fox-btn-sm">
                      <MoreHorizontal size={14} />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <div className="fox-billing-view">
      <div className="fox-billing-header">
        <div className="fox-billing-title">
          <h2>Billing</h2>
        </div>
        <div className="fox-billing-stats">
          <div className="fox-stat-card">
            <FileText size={16} />
            <span>{formatCurrency(totals.quotesTotal)} in quotes</span>
          </div>
          <div className="fox-stat-card">
            <Package size={16} />
            <span>{formatCurrency(totals.ordersTotal)} in orders</span>
          </div>
          <div className="fox-stat-card">
            <Receipt size={16} />
            <span>{formatCurrency(totals.pendingTotal)} outstanding</span>
          </div>
        </div>
      </div>

      <div className="fox-billing-tabs">
        <button
          className={`fox-tab ${activeTab === 'quotes' ? 'active' : ''}`}
          onClick={() => setActiveTab('quotes')}
        >
          <FileText size={18} />
          Quotes ({quotes.length})
        </button>
        <button
          className={`fox-tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <Package size={18} />
          Orders ({orders.length})
        </button>
        <button
          className={`fox-tab ${activeTab === 'invoices' ? 'active' : ''}`}
          onClick={() => setActiveTab('invoices')}
        >
          <Receipt size={18} />
          Invoices ({invoices.length})
        </button>
      </div>

      <div className="fox-billing-content">
        {isLoading ? (
          <div className="fox-loading">Loading...</div>
        ) : (
          <>
            {activeTab === 'quotes' && renderQuotesList()}
            {activeTab === 'orders' && renderOrdersList()}
            {activeTab === 'invoices' && renderInvoicesList()}
          </>
        )}
      </div>
    </div>
  )
}