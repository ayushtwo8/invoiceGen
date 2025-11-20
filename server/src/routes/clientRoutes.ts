import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createClient, deleteClient, getClients, getClientsById, updateClient } from "../controllers/clientController.js";

const router = Router();

router.use(authMiddleware);

router.post('/', createClient);
router.get('/', getClients);
router.get('/:id', getClientsById);
router.put('/:id', updateClient);
router.delete('/:id', deleteClient);

export default router;