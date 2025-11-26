import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useInvoiceStore } from '../store/invoiceStore';
import { invoiceService } from '../services/invoiceService';
import { formatCurrency, formatShortDate } from '../utils/formatters';
import Button from '../components/Button';
import Select from '../components/Select';

export default function InvoiceList() {
  const { invoices, setInvoices, removeInvoice, loading, setLoading } = useInvoiceStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchInvoices();
  }, [statusFilter, search]);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const data = await invoiceService.getInvoices(
        statusFilter !== 'all' ? statusFilter : undefined,
        search || undefined
      );
      setInvoices(data);
    } catch (error) {
      toast.error('Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) return;

    try {
      await invoiceService.deleteInvoice(id);
      removeInvoice(id);
      toast.success('Invoice deleted successfully');
    } catch (error) {
      toast.error('Failed to delete invoice');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'sent':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'draft':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'overdue':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'draft', label: 'Draft' },
    { value: 'sent', label: 'Sent' },
    { value: 'paid', label: 'Paid' },
    { value: 'overdue', label: 'Overdue' },
  ];

  const filteredInvoices = invoices;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Invoices</h1>
            <p className="text-sm text-gray-600">Manage all your invoices</p>
          </div>
          <Link to="/app/invoices/create">
            <Button>
              <Plus className="w-4 h-4 mr-1.5" />
              New Invoice
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search invoices..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg hover:border-gray-300 focus:border-black focus:ring-0 transition-colors"
              />
            </div>
          </div>
          <div className="w-full sm:w-40">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={statusOptions}
            />
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">
                  Invoice
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">
                  Client
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">
                  Amount
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">
                  Status
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">
                  Issue Date
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">
                  Due Date
                </th>
                <th className="px-5 py-3 text-right text-xs font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-gray-500">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-gray-500">
                    <div className="text-center">
                      <svg
                        className="mx-auto h-10 w-10 text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No invoices found</h3>
                      <p className="mt-1 text-xs text-gray-500">
                        Get started by creating a new invoice.
                      </p>
                      <div className="mt-4">
                        <Link to="/app/invoices/create">
                          <Button size="sm">
                            <Plus className="w-3.5 h-3.5 mr-1.5" />
                            New Invoice
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((invoice) => (
                  <tr key={invoice._id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 whitespace-nowrap">
                      <div className="text-xs font-medium text-gray-900">
                        {invoice.invoiceNumber}
                      </div>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <div className="text-xs text-gray-900">{invoice.clientName}</div>
                      <div className="text-xs text-gray-500">{invoice.clientEmail}</div>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <div className="text-xs font-medium text-gray-900">
                        {formatCurrency(invoice.total, invoice.currency)}
                      </div>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 inline-flex text-xs font-medium rounded border ${getStatusColor(
                          invoice.status
                        )}`}
                      >
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap text-xs text-gray-500">
                      {formatShortDate(invoice.issueDate)}
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap text-xs text-gray-500">
                      {formatShortDate(invoice.dueDate)}
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap text-right text-xs font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/app/invoices/edit/${invoice._id}`}
                          className="text-gray-600 hover:text-black"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(invoice._id)}
                          className="text-gray-600 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}