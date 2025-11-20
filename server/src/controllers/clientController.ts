import type { Response } from "express";
import type { AuthRequest } from "../middleware/authMiddleware.js";
import clientModel from "../models/clientModel.js";

export const createClient = async (req: AuthRequest, res: Response) => {
    try {
        const clientData = { ...req.body, userId: req.userId};
        const client = new clientModel(clientData);
        await client.save();

        res.status(201).json(client);
    } catch(error){
        res.status(500).json({ message: 'Server error'})
    }
}

export const getClients = async(req: AuthRequest, res: Response) => {
    try {
        const clients = await clientModel.find({ userId: req.userId}).sort({ createdAt: -1});
        res.json(clients);
    } catch{
        res.status(500).json({ message: 'Server error'})
    }
}

export const getClientsById = async(req: AuthRequest, res: Response) => {
    try {
        const client = await clientModel.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if(!client) {
            return res.status(404).json({ message: 'Client not found'});
        }

        res.json(client)
    } catch{
        res.status(500).json({ message: 'Server error'})
    }
}

export const updateClient = async(req: AuthRequest, res: Response) => {
    try {
        const client = await clientModel.findOneAndUpdate(
            { $id: req.params.id, userId: req.userId},
            { $set: req.body },
            { new: true }
        )

        if(!client){
            return res.status(404).json({ message: 'Client not found'});
        }

        res.json(client);
    } catch(error){
        res.status(500).json({
            message: "Server error"
        })
    }
}

export const deleteClient = async(req: AuthRequest, res: Response) => {
    try {
        const client = await clientModel.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        })

        if(!client){
            return res.status(404).json({ message: 'Client not found'});
        }

        res.json({ message: 'Client deleted successfully'});
    } catch(error){
        return res.status(404).json({ message: 'Client not found'});
    }
}