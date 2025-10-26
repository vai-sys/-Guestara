import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  bookingDate: Date,
  checkin: Date,
  checkout: Date,
  guestName: String,
  guestEmail: String,
  guestPhone: String,
  status: String,
  totalGuests: Number,
  adults: Number,
  children: Number,
  roomIds: [String],
  propertyId: { type: String, required: true } 
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);
