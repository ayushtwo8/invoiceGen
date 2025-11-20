import mongoose, { Document, Schema } from "mongoose"

export interface IInvoiceItem {
    description: string;
    quantity: number;
    rate: number;
    tax: number;
    amount: number;
}

export interface IInvoice extends Document {
    userId: mongoose.Types.ObjectId;
    invoiceNumber: string;
    clientId: mongoose.Types.ObjectId;
    clientName: string;
    clientEmail: string;
    clientAddress?: string;
    items: IInvoiceItem[];
    subtotal: number;
    taxAmount: number;
    discount: number;
    discountType: 'percentage' | 'fixed';
    total: number;
    currency: string;
    status: 'draft' | 'sent' | 'paid' | 'overdue';
    issueDate: Date;
    dueDate: Date;
    notes?: string;
    terms?: string;
    paymentStatus?: string;
    createdAt: Date;
    updatedAt: Date;    
}

const invoiceItemSchema = new Schema<IInvoiceItem>({
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    rate: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    amount: { type: Number, required: true }    
})

const invoiceSchema = new Schema<IInvoice>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  invoiceNumber: { type: String, required: true, unique: true },
  clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  clientName: { type: String, required: true },
  clientEmail: { type: String, required: true },
  clientAddress: String,
  items: [invoiceItemSchema],
  subtotal: { type: Number, required: true },
  taxAmount: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  discountType: { type: String, enum: ['percentage', 'fixed'], default: 'fixed' },
  total: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  status: { type: String, enum: ['draft', 'sent', 'paid', 'overdue'], default: 'draft' },
  issueDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  notes: String,
  terms: String,
  paymentStatus: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IInvoice>('Invoice', invoiceSchema);