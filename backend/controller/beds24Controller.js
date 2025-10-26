import axios from "axios";
import Property from "../models/Property.js";
import Booking from "../models/Booking.js";
import { encrypt, decrypt } from "../utils/encryption.js";
import dotenv from "dotenv";

dotenv.config();

const BEDS24_API_URL = process.env.BEDS24_API_URL || "https://api.beds24.com/json";


export const createProperty = async (req, res) => {
  try {
    const { 
      name, propId, propTypeId, ownerId, currency, address, city, state, 
      country, postcode, latitude, longitude, apiKey, propKey, roomTypes 
    } = req.body;

    const encryptedApiKey = encrypt(apiKey);
    const encryptedPropKey = encrypt(propKey);

    const newProperty = new Property({
      name,
      propId,
      propTypeId,
      ownerId,
      currency,
      address,
      city,
      state,
      country,
      postcode,
      latitude,
      longitude,
      apiKey: encryptedApiKey,
      propKey: encryptedPropKey,
      roomTypes
    });

    await newProperty.save();
    res.status(201).json({ message: "Property added successfully ", property: newProperty });
  } catch (error) {
    console.error("Error creating property:", error);
    res.status(500).json({ message: "Failed to create property", error: error.message });
  }
};


export const fetchBookings = async (req, res) => {
  try {
    const { propId } = req.params;
    const property = await Property.findOne({ propId });

    if (!property) return res.status(404).json({ message: "Property not found" });

   
    const decryptedApiKey = decrypt(property.apiKey);
    const decryptedPropKey = decrypt(property.propKey);

   
    const toDate = new Date().toISOString().split("T")[0];
    const fromDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

   
    const requestBody = {
      getBookings: {
        authentication: {
          propKey: decryptedPropKey,
          apiKey: decryptedApiKey
        },
        criteria: {
          propId,
          fromDate,
          toDate
        }
      }
    };

   
    const response = await axios.post(BEDS24_API_URL, requestBody);
    const bookingsData = response.data?.getBookings || [];

    if (!Array.isArray(bookingsData) || bookingsData.length === 0) {
      return res.status(200).json({ message: "No new bookings found" });
    }

  
    const formattedBookings = bookingsData.map(b => ({
      bookingDate: b.created || null,
      checkin: b.checkin || null,
      checkout: b.checkout || null,
      guestName: `${b.firstname || ""} ${b.lastname || ""}`.trim(),
      guestEmail: b.email || "",
      guestPhone: b.phone || "",
      status: b.status || "",
      totalGuests: b.totalGuests || 0,
      adults: b.adults || 0,
      children: b.children || 0,
      roomIds: b.roomIds || [],
      propertyId: property.propId
    }));

    await Booking.insertMany(formattedBookings);

    res.status(200).json({
      message: "Bookings fetched and stored successfully ",
      count: formattedBookings.length,
      bookings: formattedBookings
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Failed to fetch bookings", error: error.message });
  }
};
