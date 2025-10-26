import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  name: String,
  qty: Number,
  roomId: String,
  minPrice: String,
  maxPeople: Number,
  maxAdult: Number,
  maxChildren: Number
});

const propertySchema = new mongoose.Schema({
  name: String,
  propId: { type: String, required: true, unique: true },
  propTypeId: String,
  ownerId: String,
  currency: String,
  address: String,
  city: String,
  state: String,
  country: String,
  postcode: String,
  latitude: String,
  longitude: String,
  apiKey: String,    
  propKey: String,    
  roomTypes: [roomSchema]
}, { timestamps: true });

export default mongoose.model("Property", propertySchema);
