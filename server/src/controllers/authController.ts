import type { Request, Response } from "express";
import jwt from 'jsonwebtoken'
import userModel from "../models/userModel.js";
import type { AuthRequest } from "../middleware/authMiddleware.js";

export const register = async(req: Request, res: Response) => {
    try {
        const { name, email, password} = req.body;

        const existingUser = await userModel.findOne({ email });
        if(existingUser){
            return res.status(400).json({
                message: 'User already exists'
            })
        }

        const user = new userModel({ name, email, password});
        user.save();

        const token = jwt.sign({ userId: user._id}, process.env.JWT_SECRET!);

        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })
    } catch(error){
        res.status(500).json({
            message: 'Server Error'
        })
    }
}


export const login = async(req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });
        if(!user){
            return res.status(400).json({
                message: 'Invalid credentials'
            });
        }

        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            return res.status(400).json({
                message: 'Invalid credentials'
            })
        }

        const token = jwt.sign({ userId: user._id}, process.env.JWT_SECRET!);

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                companyName: user.companyName,
                companyAddress: user.companyAddress,
                companyPhone: user.companyPhone,
                companyEmail: user.companyEmail,
                taxId: user.taxId,
                logo: user.logo
            }
        })
    } catch(error){
        res.status(500).json({
            message: 'Server error'
        })
    }
}

export const getProfile = async(req: AuthRequest, res: Response) => {
    try {
        const user = await userModel.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch(error){
        res.status(500).json({
            message: 'Server error'
        })
    }
}

export const updateProfile = async(req: AuthRequest, res: Response) => {
    try{
        const updates = req.body;
        const user = await userModel.findByIdAndUpdate(
            req.userId,
            { $set: updates},
            { new: true}
        ).select('-password');

        res.json(user);
    } catch(error){
        res.status(500).json({ message: 'Server error'})
    }
}