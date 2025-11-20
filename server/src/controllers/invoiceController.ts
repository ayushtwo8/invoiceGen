import type { Response } from "express";
import type { AuthRequest } from "../middleware/authMiddleware.js";
import invoiceModel from "../models/invoiceModel.js";

export const createInvoice = async(req: AuthRequest, res: Response) => {
    try {
        const invoiceData = { ...req.body, userId: req.userId};
        const invoice = new invoiceModel(invoiceData);
        await invoice.save();
        res.status(201).json(invoice);
    } catch(error){
        res.status(500).json({ message: "Server error"})
    }
}

export const getInvoices = async(req: AuthRequest, res: Response) => {
    try {
        const {status, search} = req.query;
        let query: any = { userId: req.userId};

        if(status && status != 'all'){
            query.status = status;
        }

        if(search) {
            query.$or = [
                { invoiceNumber: {$regex: search, $options: 'i'}},
                { clientName: {$regex: search, $options: 'i'}}
            ]
        }

        const invoices = await invoiceModel.find(query).sort({ createdAt: -1 });
        res.json(invoices);
    }catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

export const getInvoiceById = async(req: AuthRequest, res: Response) => {
    try {
        const invoice = await invoiceModel.findOne({
            _id: req.params.id,
            userId: req.userId
        })

        if(!invoice){
            return res.status(404).json({
                message: "Invoice not found"
            })
        }
        
        res.json(invoice);
    } catch(error){
        res.status(500).json({
            message: 'Server error'
        })
    }
}

export const updateInvoice = async(req: AuthRequest, res: Response) => {
    try {
        const invoice = await invoiceModel.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId},
            { $set: { ...req.body, updatedAt: new Date()}},
            { new: true }
        );

        if(!invoice){
            return res.status(404).json({ message: 'Invoice not found'});
        }

        res.json(invoice)
    } catch(error){
        res.status(500).json({ message: 'Server error'})
    }
}

export const deleteInvoice = async(req: AuthRequest, res: Response) => {
    try {
        const invoice = await invoiceModel.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        })

        if(!invoice){
            return res.status(404).json({ message: 'Invoice not found'})
        }

        res.json({ message: "Invoice deleted successfully"})
    } catch(error){
        res.status(500).json({ message: "Server error"});
    }
}

export const getInvoiceStats = async (req: AuthRequest, res: Response) => {
    try {
        const totalInvoices = await invoiceModel.countDocuments({ userId: req.userId});
        const paidInvoices = await invoiceModel.countDocuments({ userId: req.userId, status: 'paid'});
        const pendingInvoices = await invoiceModel.countDocuments({ userId: req.userId, status: { $in: ['sent', 'draft']}});
        const overdueInvoices = await invoiceModel.countDocuments({ userId: req.userId, status: 'overdue'});
        
        const totalRevenue = await invoiceModel.aggregate([
            { $match: { userId: req.userId, status: 'paid'}},
            { $group: { _id: null, total: { $sum: '$total'}}}
        ])

        const pendingAmount = await invoiceModel.aggregate([
            { $match: { userId: req.userId, status: { $in: ['sent', 'draft']}}},
            { $group: { _id: null, total: { $sum: '$total'}}}
        ])

        res.json({
            totalInvoices,
            paidInvoices,
            pendingInvoices,
            overdueInvoices,
            totalRevenue: totalRevenue[0]?.total || 0,
            pendingRevenue: pendingAmount[0]?.total || 0,
        })
    } catch(error){
        res.status(500).json({ message: "Server error"});
    }
}