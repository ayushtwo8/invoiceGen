import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  DollarSign, 
  Clock, 
  AlertCircle,
  Plus 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useInvoiceStore } from '../store/invoiceStore';
import { invoiceService } from '../services/invoiceService';
import { formatCurrency, formatShortDate } from '../utils/formatters';
import StatCard from '../components/StatCard';
import Button from '../components/Button';

export default function Dashboard() {
  const { invoices, stats, setInvoices, setStats } = useInvoiceStore();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [invoicesData, statsData] = await Promise.all([
        invoiceService.getInvoices(),
        invoiceService.getStats(),
      ]);
      setInvoices(invoicesData);
      setStats(statsData);
    } catch (error) {
        console.error(error);
      toast.error('Failed to fetch dashboard data');
    }
  };

  const recentInvoices = invoices.slice(0, 5);

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

  return (
   <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
        <p className="text-sm text-gray-600">Welcome back! Here's your overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Invoices"
          value={stats?.totalInvoices || 0}
          icon={<FileText className="w-4 h-4" />}
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats?.totalRevenue || 0)}
          icon={<DollarSign className="w-4 h-4" />}
        />
        <StatCard
          title="Pending Amount"
          value={formatCurrency(stats?.pendingAmount || 0)}
          icon={<Clock className="w-4 h-4" />}
        />
        <StatCard
          title="Overdue"
          value={stats?.overdueInvoices || 0}
          icon={<AlertCircle className="w-4 h-4" />}
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/app/invoices/create">
            <Button size="sm">
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              New Invoice
            </Button>
          </Link>
          <Link to="/app/clients">
            <Button variant="secondary" size="sm">
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Add Client
            </Button>
          </Link>
          <Link to="/app/invoices">
            <Button variant="ghost" size="sm">
              View All Invoices
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Recent Invoices</h2>
            <Link to="/app/invoices" className="text-xs text-gray-600 hover:text-black font-medium">
              View all →
            </Link>
          </div>
        </div>
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
                  Due Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentInvoices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-gray-500">
                    <FileText className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm font-medium text-gray-900">No invoices yet</p>
                    <p className="text-xs mt-1">Create your first invoice to get started</p>
                  </td>
                </tr>
              ) : (
                recentInvoices.map((invoice) => (
                  <tr key={invoice._id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 whitespace-nowrap">
                      <Link
                        to={`/app/invoices/edit/${invoice._id}`}
                        className="text-xs font-medium text-black hover:underline"
                      >
                        {invoice.invoiceNumber}
                      </Link>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <div className="text-xs text-gray-900">{invoice.clientName}</div>
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
                      {formatShortDate(invoice.dueDate)}
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