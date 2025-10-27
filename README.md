# Beds24 Integration Backend

A Node.js/Express backend application for integrating with the Beds24 API to manage properties and fetch booking data.

## Features

-  Property management with encrypted API credentials
- Automated booking data synchronization
- Secure encryption for sensitive API keys
- MongoDB database integration
- RESTful API endpoints

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Security**: Crypto 
- **HTTP Client**: Axios
- **Environment**: dotenv

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Beds24 account with API access

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vai-sys/-Guestara
   cd -Guestara
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/beds24_db
   BEDS24_API_URL=https://api.beds24.com/json
   ENCRYPTION_KEY=---
   ENCRYPTION_IV=----
   ```

4. **Start the server**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

## API Endpoints

### 1. Create Property

**POST** `/api/beds24/property`

Creates a new property with encrypted API credentials.

**Request Body:**
```json
{
  "name": "Sunset Villa",
  "propId": "12345",
  "propTypeId": "1",
  "ownerId": "owner123",
  "currency": "USD",
  "address": "123 Beach Road",
  "city": "Miami",
  "state": "FL",
  "country": "USA",
  "postcode": "33139",
  "latitude": "25.7617",
  "longitude": "-80.1918",
  "apiKey": "your-beds24-api-key",
  "propKey": "your-property-key",
  "roomTypes": [
    {
      "name": "Deluxe Room",
      "qty": 5,
      "roomId": "room001",
      "minPrice": "150",
      "maxPeople": 4,
      "maxAdult": 2,
      "maxChildren": 2
    }
  ]
}
```

**Response:**
```json
{
  "message": "Property added successfully",
  "property": {  ...propertyData  }
}
```

### 2. Fetch Bookings

**GET** `/api/beds24/bookings/:propId`

Fetches bookings from Beds24 API for the last 7 days and stores them in the database.

**Parameters:**
- `propId` - Property ID (URL parameter)

**Response:**
```json
{
  "message": "Bookings fetched and stored successfully",
  "count": 5,
  "bookings": [
    {
      "bookingDate": "2025-10-20T10:30:00Z",
      "checkin": "2025-10-25",
      "checkout": "2025-10-28",
      "guestName": "John Doe",
      "guestEmail": "john@example.com",
      "guestPhone": "+1234567890",
      "status": "confirmed",
      "totalGuests": 2,
      "adults": 2,
      "children": 0,
      "roomIds": ["room001"],
      "propertyId": "12345"
    }
  ]
}
```

## Project Structure

```
.
├── controller/
│   └── beds24Controller.js    # Business logic for properties and bookings
├── models/
│   ├── Property.js             # Property schema
│   └── Booking.js              # Booking schema
├── routes/
│   └── beds24Routes.js         # API route definitions
├── utils/
│   └── encryption.js           # Encryption/decryption utilities
├── .env                        # Environment variables
├──  index.js                   # Application entry point
└── package.json                # Project dependencies
```

## Data Models

### Property Schema
- `name` - Property name
- `propId` - Unique property identifier
- `propTypeId` - Type of property
- `ownerId` - Owner identifier
- `currency` - Currency code
- `address`, `city`, `state`, `country`, `postcode` - Location details
- `latitude`, `longitude` - Coordinates
- `apiKey` - Encrypted Beds24 API key
- `propKey` - Encrypted property key
- `roomTypes` - Array of room configurations

### Booking Schema
- `bookingDate` - When booking was created
- `checkin` / `checkout` - Stay dates
- `guestName`, `guestEmail`, `guestPhone` - Guest information
- `status` - Booking status
- `totalGuests`, `adults`, `children` - Guest counts
- `roomIds` - Associated room IDs
- `propertyId` - Reference to property

## Security Features

- **API Key Encryption**: All Beds24 API keys and property keys are encrypted using AES-256-CBC before storage
- **Environment Variables**: Sensitive configuration stored in `.env` file
- **CORS**: Cross-Origin Resource Sharing enabled
- **Error Handling**: Comprehensive error messages without exposing sensitive data

## Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `201` - Resource created
- `404` - Resource not found
- `500` - Server error

## Development

### Scripts

Add these to your `package.json`:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### Dependencies

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.0.0",
    "axios": "^1.4.0",
    "dotenv": "^16.0.3",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}
```

## Beds24 API Integration

This application integrates with the Beds24 API to:
1. Store property information with secure credentials
2. Automatically fetch booking data for the past 7 days
3. Store bookings in local database for analysis and management

### Authentication
The Beds24 API requires:
- `apiKey` - Your Beds24 API key
- `propKey` - Property-specific key

These are encrypted before storage and decrypted only when making API calls.

