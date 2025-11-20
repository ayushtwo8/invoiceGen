import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Plus, Trash2, Save } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useClientStore } from '../store/clientStore';
import { useInvoiceStore } from '../store/invoiceStore';
import { invoiceService } from '../services/invoiceService';
import { clientService } from '../services/clientService';
import { calculateItemAmount, calculateInvoiceTotals } from '../utils/calculations';
import type { InvoiceItem } from '../types';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import InvoicePreview from '../components/InvoicePreview';

export default function EditInvoice() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { clients, setClients } = useClientStore();
  const { updateInvoice } = useInvoiceStore();

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState({
    invoiceNumber: '',
    clientId: '',
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    issueDate: '',
    dueDate: '',
    currency: 'INR',
    status: 'draft' as 'draft' | 'sent' | 'paid' | 'overdue',
    discount: 0,
    discountType: 'fixed' as 'percentage' | 'fixed',
    notes: '',
    terms: '',
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    { description: '', quantity: 1, rate: 0, tax: 0, amount: 0 },
  ]);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [invoiceData, clientsData] = await Promise.all([
        invoiceService.getInvoiceById(id!),
        clientService.getClients(),
      ]);

      setClients(clientsData);
      setFormData({
        invoiceNumber: invoiceData.invoiceNumber,
        clientId: invoiceData.clientId,
        clientName: invoiceData.clientName,
        clientEmail: invoiceData.clientEmail,
        clientAddress: invoiceData.clientAddress || '',
        issueDate: new Date(invoiceData.issueDate).toISOString().split('T')[0],
        dueDate: new Date(invoiceData.dueDate).toISOString().split('T')[0],
        currency: invoiceData.currency,
        status: invoiceData.status,
        discount: invoiceData.discount,
        discountType: invoiceData.discountType,
        notes: invoiceData.notes || '',
        terms: invoiceData.terms || '',
      });
      setItems(invoiceData.items);
    } catch (error) {
      toast.error('Failed to fetch invoice');
      navigate('/invoices');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleClientChange = (clientId: string) => {
    const client = clients.find((c) => c._id === clientId);
    if (client) {
      setFormData({
        ...formData,
        clientId: client._id,
        clientName: client.name,
        clientEmail: client.email,
        clientAddress: `${client.address || ''}, ${client.city || ''}, ${client.state || ''} ${
          client.zipCode || ''
        }`.trim(),
      });
    }
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    if (field === 'quantity' || field === 'rate' || field === 'tax') {
      newItems[index].amount = calculateItemAmount(
        Number(newItems[index].quantity),
        Number(newItems[index].rate),
        Number(newItems[index].tax)
      );
    }

    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, rate: 0, tax: 0, amount: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const { subtotal, taxAmount, total } = calculateInvoiceTotals(
    items,
    formData.discount,
    formData.discountType
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.clientId) {
      toast.error('Please select a client');
      return;
    }

    if (items.some((item) => !item.description || item.quantity <= 0 || item.rate <= 0)) {
      toast.error('Please fill in all item details');
      return;
    }

    setLoading(true);

    try {
      const invoiceData = {
        ...formData,
        items,
        subtotal,
        taxAmount,
        total,
      };

      const updatedInvoice = await invoiceService.updateInvoice(id!, invoiceData);
      updateInvoice(updatedInvoice);
      toast.success('Invoice updated successfully!');
      navigate('/invoices');
    } catch (error) {
      toast.error('Failed to update invoice');
    } finally {
      setLoading(false);
    }
  };

 const currencyOptions = [
  { value: 'INR', label: '₹ INR - Indian Rupee' },
  { value: 'USD', label: '$ USD - US Dollar' },
  { value: 'EUR', label: '€ EUR - Euro' },
  { value: 'GBP', label: '£ GBP - British Pound' },
  { value: 'AED', label: 'AED - UAE Dirham' },
  { value: 'SGD', label: 'SGD - Singapore Dollar' },
];

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'sent', label: 'Sent' },
    { value: 'paid', label: 'Paid' },
    { value: 'overdue', label: 'Overdue' },
  ];

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Invoice</h1>
        <p className="text-gray-600">Update invoice details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Invoice Number"
                  value={formData.invoiceNumber}
                  onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                  required
                />
                <Select
                  label="Currency"
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  options={currencyOptions}
                />
                <Input
                  label="Issue Date"
                  type="date"
                  value={formData.issueDate}
                  onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                  required
                />
                <Input
                  label="Due Date"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  required
                />
                <Select
                  label="Status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  options={statusOptions}
                />
              </div>
            </div>

            {/* Client Information */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Client Information</h2>
              <div className="space-y-4">
                <Select
                  label="Select Client"
                  value={formData.clientId}
                  onChange={(e) => handleClientChange(e.target.value)}
                  options={[
                    { value: '', label: 'Select a client' },
                    ...clients.map((client) => ({
                      value: client._id,
                      label: `${client.name} - ${client.email}`,
                    })),
                  ]}
                />
                {formData.clientId && (
                  <>
                    <Input label="Client Name" value={formData.clientName} readOnly />
                    <Input label="Client Email" value={formData.clientEmail} readOnly />
                    <Input label="Client Address" value={formData.clientAddress} readOnly />
                  </>
                )}
              </div>
            </div>

            {/* Invoice Items */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Invoice Items</h2>
                <Button type="button" onClick={addItem} size="sm" variant="secondary">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-4 p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="col-span-12 md:col-span-4">
                      <Input
                        label="Description"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        placeholder="Item description"
                        required
                      />
                    </div>
                    <div className="col-span-6 md:col-span-2">
                      <Input
                        label="Quantity"
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                        required
                      />
                    </div>
                    <div className="col-span-6 md:col-span-2">
                      <Input
                        label="Rate"
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.rate}
                        onChange={(e) => handleItemChange(index, 'rate', Number(e.target.value))}
                        required
                      />
                    </div>
                    <div className="col-span-6 md:col-span-2">
                      <Input
                        label="Tax (%)"
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={item.tax}
                        onChange={(e) => handleItemChange(index, 'tax', Number(e.target.value))}
                      />
                    </div>
                    <div className="col-span-6 md:col-span-2 flex items-end">
                      <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Amount
                        </label>
                        <div className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm font-medium">
                          {item.amount.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    {items.length > 1 && (
                      <div className="col-span-12 flex justify-end">
                        <Button
                          type="button"
                          onClick={() => removeItem(index)}
                          variant="danger"
                          size="sm"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Discount & Notes */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Details</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Discount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                  />
                  <Select
                    label="Discount Type"
                    value={formData.discountType}
                    onChange={(e) =>
                      setFormData({ ...formData, discountType: e.target.value as any })
                    }
                    options={[
                      { value: 'fixed', label: 'Fixed Amount' },
                      { value: 'percentage', label: 'Percentage' },
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Add any notes or additional information"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Terms & Conditions
                  </label>
                  <textarea
                    value={formData.terms}
                    onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Payment terms and conditions"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button type="submit" isLoading={loading}>
                <Save className="w-4 h-4 mr-2" />
                Update Invoice
              </Button>
              <Button type="button" variant="secondary" onClick={() => navigate('/invoices')}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowPreview(!showPreview)}
                className="ml-auto"
              >
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </Button>
            </div>
          </form>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 sticky top-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax:</span>
                <span className="font-medium">{taxAmount.toFixed(2)}</span>
              </div>
              {formData.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount:</span>
                  <span className="font-medium text-red-600">
                    -{formData.discount}
                    {formData.discountType === 'percentage' ? '%' : ''}
                  </span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-base font-semibold text-gray-900">Total:</span>
                  <span className="text-xl font-bold text-blue-600">
                    {formData.currency} {total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <InvoicePreview
          invoice={{
            ...formData,
            items,
            subtotal,
            taxAmount,
            total,
            userId: user?.id || '',
            _id: id || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}