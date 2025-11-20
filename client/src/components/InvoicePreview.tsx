import { X, Download } from 'lucide-react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { Invoice } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useAuthStore } from '../store/authStore';
import Button from './Button';

interface InvoicePreviewProps {
  invoice: Invoice;
  onClose: () => void;
}

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  invoiceNumber: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  text: {
    fontSize: 10,
    marginBottom: 4,
    color: '#666',
  },
  table: {
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    padding: 8,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    padding: 8,
  },
  col1: { width: '40%' },
  col2: { width: '15%', textAlign: 'right' },
  col3: { width: '15%', textAlign: 'right' },
  col4: { width: '15%', textAlign: 'right' },
  col5: { width: '15%', textAlign: 'right' },
  totalsSection: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
    marginBottom: 5,
  },
  totalLabel: {
    fontSize: 10,
    color: '#666',
  },
  totalValue: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  grandTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 2,
    borderTopColor: '#000',
  },
  grandTotalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  grandTotalValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  footerText: {
    fontSize: 9,
    color: '#666',
    marginBottom: 4,
  },
});

// PDF Document Component
const InvoicePDF = ({ invoice, user }: { invoice: Invoice; user: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>INVOICE</Text>
        <Text style={styles.invoiceNumber}>Invoice #: {invoice.invoiceNumber}</Text>
      </View>

      {/* Company & Client Info */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 }}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>From:</Text>
          <Text style={styles.text}>{user?.companyName || user?.name}</Text>
          {user?.companyAddress && <Text style={styles.text}>{user.companyAddress}</Text>}
          {user?.companyPhone && <Text style={styles.text}>{user.companyPhone}</Text>}
          {user?.companyEmail && <Text style={styles.text}>{user.companyEmail}</Text>}
          {user?.taxId && <Text style={styles.text}>Tax ID: {user.taxId}</Text>}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>To:</Text>
          <Text style={styles.text}>{invoice.clientName}</Text>
          <Text style={styles.text}>{invoice.clientEmail}</Text>
          {invoice.clientAddress && <Text style={styles.text}>{invoice.clientAddress}</Text>}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Invoice Details:</Text>
          <Text style={styles.text}>Issue Date: {formatDate(invoice.issueDate)}</Text>
          <Text style={styles.text}>Due Date: {formatDate(invoice.dueDate)}</Text>
          <Text style={styles.text}>Status: {invoice.status.toUpperCase()}</Text>
        </View>
      </View>

      {/* Items Table */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.col1}>Description</Text>
          <Text style={styles.col2}>Qty</Text>
          <Text style={styles.col3}>Rate</Text>
          <Text style={styles.col4}>Tax</Text>
          <Text style={styles.col5}>Amount</Text>
        </View>

        {invoice.items.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.col1}>{item.description}</Text>
            <Text style={styles.col2}>{item.quantity}</Text>
            <Text style={styles.col3}>{formatCurrency(item.rate, invoice.currency)}</Text>
            <Text style={styles.col4}>{item.tax}%</Text>
            <Text style={styles.col5}>{formatCurrency(item.amount, invoice.currency)}</Text>
          </View>
        ))}
      </View>

      {/* Totals */}
      <View style={styles.totalsSection}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal:</Text>
          <Text style={styles.totalValue}>{formatCurrency(invoice.subtotal, invoice.currency)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Tax:</Text>
          <Text style={styles.totalValue}>{formatCurrency(invoice.taxAmount, invoice.currency)}</Text>
        </View>
        {invoice.discount > 0 && (
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Discount:</Text>
            <Text style={styles.totalValue}>
              -{invoice.discount}
              {invoice.discountType === 'percentage' ? '%' : ''}
            </Text>
          </View>
        )}
        <View style={styles.grandTotal}>
          <Text style={styles.grandTotalLabel}>Total:</Text>
          <Text style={styles.grandTotalValue}>
            {formatCurrency(invoice.total, invoice.currency)}
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        {invoice.notes && (
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.sectionTitle}>Notes:</Text>
            <Text style={styles.footerText}>{invoice.notes}</Text>
          </View>
        )}
        {invoice.terms && (
          <View>
            <Text style={styles.sectionTitle}>Terms & Conditions:</Text>
            <Text style={styles.footerText}>{invoice.terms}</Text>
          </View>
        )}
      </View>
    </Page>
  </Document>
);

export default function InvoicePreview({ invoice, onClose }: InvoicePreviewProps) {
  const { user } = useAuthStore();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/75">
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Invoice Preview</h2>
            <div className="flex items-center gap-3">
              <PDFDownloadLink
                document={<InvoicePDF invoice={invoice} user={user} />}
                fileName={`invoice-${invoice.invoiceNumber}.pdf`}
              >
                {({ loading }) => (
                  <Button size="sm" disabled={loading}>
                    <Download className="w-4 h-4 mr-2" />
                    {loading ? 'Generating...' : 'Download PDF'}
                  </Button>
                )}
              </PDFDownloadLink>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Preview Content */}
          <div className="p-8 overflow-y-auto max-h-[calc(90vh-80px)]">
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">INVOICE</h1>
                <p className="text-gray-600">Invoice #: {invoice.invoiceNumber}</p>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-3 gap-8 mb-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">From:</h3>
                  <p className="text-sm text-gray-600">{user?.companyName || user?.name}</p>
                  {user?.companyAddress && (
                    <p className="text-sm text-gray-600">{user.companyAddress}</p>
                  )}
                  {user?.companyPhone && <p className="text-sm text-gray-600">{user.companyPhone}</p>}
                  {user?.companyEmail && <p className="text-sm text-gray-600">{user.companyEmail}</p>}
                  {user?.taxId && <p className="text-sm text-gray-600">Tax ID: {user.taxId}</p>}
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">To:</h3>
                  <p className="text-sm text-gray-600">{invoice.clientName}</p>
                  <p className="text-sm text-gray-600">{invoice.clientEmail}</p>
                  {invoice.clientAddress && (
                    <p className="text-sm text-gray-600">{invoice.clientAddress}</p>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Invoice Details:</h3>
                  <p className="text-sm text-gray-600">Issue Date: {formatDate(invoice.issueDate)}</p>
                  <p className="text-sm text-gray-600">Due Date: {formatDate(invoice.dueDate)}</p>
                  <p className="text-sm text-gray-600">
                    Status:{' '}
                    <span className="font-medium capitalize">{invoice.status}</span>
                  </p>
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-8">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-y border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Description
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                        Qty
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                        Rate
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                        Tax
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item, index) => (
                      <tr key={index} className="border-b border-gray-200">
                        <td className="px-4 py-3 text-sm text-gray-900">{item.description}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">
                          {formatCurrency(item.rate, invoice.currency)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">{item.tax}%</td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">
                          {formatCurrency(item.amount, invoice.currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end mb-8">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">
                      {formatCurrency(invoice.subtotal, invoice.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax:</span>
                    <span className="font-medium">
                      {formatCurrency(invoice.taxAmount, invoice.currency)}
                    </span>
                  </div>
                  {invoice.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Discount:</span>
                      <span className="font-medium text-red-600">
                        -{invoice.discount}
                        {invoice.discountType === 'percentage' ? '%' : ''}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold pt-2 border-t-2 border-gray-900">
                    <span>Total:</span>
                    <span>{formatCurrency(invoice.total, invoice.currency)}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              {(invoice.notes || invoice.terms) && (
                <div className="border-t border-gray-200 pt-6 space-y-4">
                  {invoice.notes && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">Notes:</h3>
                      <p className="text-sm text-gray-600">{invoice.notes}</p>
                    </div>
                  )}
                  {invoice.terms && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">
                        Terms & Conditions:
                      </h3>
                      <p className="text-sm text-gray-600">{invoice.terms}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}