import mongoose, { Document, Schema } from "mongoose";

export interface IClient extends Document {
    userId: mongoose.Types.ObjectId;
    name: string;
    company?: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    createdAt: Date;
}

const clientSchema = new Schema<IClient>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    company: String,
    email: { type: String, required: true },
    phone: String,
    address: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    createdAt: { type: Date, default: Date.now }
})

export default mongoose.model<IClient>('Client', clientSchema);