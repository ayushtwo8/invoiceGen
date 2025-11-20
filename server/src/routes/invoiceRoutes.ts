import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createInvoice, deleteInvoice, getInvoiceById, getInvoices, getInvoiceStats, updateInvoice } from "../controllers/invoiceController.js";

const router = Router();

router.use(authMiddleware);

router.post('/', createInvoice);
router.get('/', getInvoices);
router.get('/stats', getInvoiceStats)
router.get('/:id', getInvoiceById)
router.put('/:id', updateInvoice)
router.delete('/:id', deleteInvoice)

export default router;