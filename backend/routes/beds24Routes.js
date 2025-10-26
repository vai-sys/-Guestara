import express from "express";
import { createProperty, fetchBookings } from "../controller/beds24Controller.js";

const router = express.Router();

router.post("/property", createProperty);         
router.get("/bookings/:propId", fetchBookings);   

export default router;
