import express from 'express';
import {getAllContacts,
        sendMessage,
        getMesssagesByUserId ,
        getChatPartners
} from '../controllers/message.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import { arcjetProtection } from '../middleware/arcjet.middleware.js';
const router = express.Router();

//these run in the order ...

router.use(arcjetProtection, protectRoute);

router.get("/contacts",getAllContacts);
router.get("/chatscl", getChatPartners);
router.get("/:id", getMesssagesByUserId);
router.post("/send/:id", sendMessage);


export default router;