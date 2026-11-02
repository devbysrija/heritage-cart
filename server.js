/**
 * Heritage Antiques Platform - Backend Engine
 * Signed by srh
 */
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// -------------------------------------------------------------
// MongoDB Mongoose Schemas
// -------------------------------------------------------------

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'mid_admin', 'admin'], default: 'customer' },
  createdAt: { type: Date, default: Date.now }
});

const antiqueSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  category: { type: String, required: true },
  century: { type: String, required: true },
  year: { type: Number, required: true },
  origin: { type: String, required: true },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number },
    locationName: { type: String }
  },
  price: { type: Number, required: true },
  estimatedValue: { type: String },
  material: { type: String },
  dimensions: { type: String },
  condition: { type: String, default: 'Museum Grade A+' },
  rarity: { type: String, default: 'Extremely Rare' },
  description: { type: String, required: true },
  provenance: { type: String },
  certificateNo: { type: String },
  imageUrl: { type: String, required: true },
  gallery: [{ type: String }],
  isFeatured: { type: Boolean, default: false },
  isReserved: { type: Boolean, default: false },
  // Online Bidding & Auction Fields
  isAuction: { type: Boolean, default: false },
  startingBid: { type: Number, default: 0 },
  currentBid: { type: Number, default: 0 },
  bidIncrement: { type: Number, default: 100 },
  reservePrice: { type: Number, default: 0 },
  auctionStatus: { 
    type: String, 
    enum: ['active', 'curator_review', 'awarded', 'closed'], 
    default: 'active' 
  },
  auctionEndsAt: { type: Date },
  awardedTo: {
    userId: { type: String },
    userName: { type: String },
    userEmail: { type: String },
    winningBid: { type: Number },
    awardedAt: { type: Date },
    adminNotes: { type: String },
    adminDecidedBy: { type: String }
  },
  totalBidsCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const bidSchema = new mongoose.Schema({
  antiqueId: { type: String, required: true },
  antiqueTitle: { type: String, required: true },
  antiqueImageUrl: { type: String },
  bidder: {
    userId: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true }
  },
  amount: { type: Number, required: true },
  note: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['active', 'leading', 'outbid', 'awarded', 'declined'], 
    default: 'leading' 
  },
  createdAt: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true }
  },
  items: [{
    antiqueId: String,
    title: String,
    price: Number,
    certificateNo: String,
    imageUrl: String
  }],
  shippingMethod: { type: String, default: 'White-Glove Vault Express' },
  insuranceFee: { type: Number, default: 150 },
  subtotal: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, default: 'Paid (Vault Escrowed)' },
  certificateOfAuthenticityIssued: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const appraisalSchema = new mongoose.Schema({
  ownerName: { type: String, required: true },
  email: { type: String, required: true },
  itemTitle: { type: String, required: true },
  approxAge: { type: String },
  category: { type: String },
  details: { type: String, required: true },
  status: { type: String, enum: ['Pending Review', 'Accepted & Valued', 'Rejected'], default: 'Pending Review' },
  estimatedValueOffer: { type: String, default: 'Pending Master Appraiser Review' },
  appraiserNotes: { type: String, default: 'Under assessment by Heritage Senior Curator' },
  reviewedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Antique = mongoose.model('Antique', antiqueSchema);
const Bid = mongoose.model('Bid', bidSchema);
const Order = mongoose.model('Order', orderSchema);
const Appraisal = mongoose.model('Appraisal', appraisalSchema);

// -------------------------------------------------------------
// Seed Data
// -------------------------------------------------------------
const initialUsers = [
  {
    _id: "65f020202020202020202001",
    name: "Sir Julian Vance",
    email: "admin@heritage.co.uk",
    password: "admin123",
    role: "admin"
  },
  {
    _id: "65f020202020202020202003",
    name: "Arthur Wellesley",
    email: "mid.admin@heritage.co.uk",
    password: "mid123",
    role: "mid_admin"
  },
  {
    _id: "65f020202020202020202002",
    name: "Lord Edward Harrington",
    email: "harrington@mayfair-estate.co.uk",
    password: "customer123",
    role: "customer"
  },
  {
    _id: "65f020202020202020202004",
    name: "Lady Eleanor Cavendish",
    email: "eleanor@cavendish-manor.co.uk",
    password: "customer123",
    role: "customer"
  }
];

const initialAntiques = [
  {
    _id: "65f010101010101010101001",
    title: "1888 Maritime Brass Navigational Sextant",
    subtitle: "Engraved Troughton & Simms of Fleet Street",
    category: "Instruments & Cartography",
    century: "19th Century",
    year: 1888,
    origin: "Fleet Street, London",
    coordinates: { lat: 51.5138, lng: -0.1082, locationName: "Fleet Street Workshops, London" },
    price: 4850,
    estimatedValue: "£5,200 - £6,000",
    material: "Aged Brass, Optical Flint Glass, Silver Inlay",
    dimensions: "24cm x 22cm x 11cm",
    condition: "Museum Grade A+ (Fully Calibrated)",
    rarity: "Extremely Rare (1 of 12 known surviving)",
    description: "An exceptional precision navigational instrument crafted by Master Optician Troughton & Simms in 1888. Features hand-engraved silver degree scale, dual magnification horizon scope, and original velvet-lined mahogany casing.",
    provenance: "Commissioned for Royal Navy Survey Vessel HMS Endeavour II in 1889. Acquired from the Estate of Vice Admiral Sir Julian Vance (Mayfair, London).",
    certificateNo: "HA-1888-TS-0491",
    imageUrl: "/images/brass_sextant.jpg",
    gallery: ["/images/brass_sextant.jpg", "/images/hero_desk.jpg"],
    isFeatured: true,
    isReserved: false,
    isAuction: true,
    startingBid: 3500,
    currentBid: 4200,
    bidIncrement: 200,
    reservePrice: 4000,
    auctionStatus: "active",
    totalBidsCount: 2,
    auctionEndsAt: new Date(Date.now() + 86400000 * 2)
  },
  {
    _id: "65f010101010101010101002",
    title: "Victorian 18k Gold Skeleton Pocket Watch",
    subtitle: "Open-Work Movement by Dent of London",
    category: "Horology",
    century: "19th Century",
    year: 1892,
    origin: "Bloomsbury, London",
    coordinates: { lat: 51.5194, lng: -0.1270, locationName: "Bloomsbury Horology Vaults" },
    price: 8900,
    estimatedValue: "£9,500 - £11,000",
    material: "18-Karat Rose Gold, Blued Steel Hands, Ruby Jewels",
    dimensions: "52mm Diameter, 14mm Depth",
    condition: "Mint Working Order (36hr Power Reserve)",
    rarity: "Unique Masterpiece",
    description: "Hand-crafted by E. Dent & Co., makers of the Great Clock of Westminster (Big Ben). Features exposed hand-engraved bridge plates, 17 rubies, and a guilloché enamel case back.",
    provenance: "Presented to Lord Harrington upon his induction into the Royal Astronomical Society in 1894. Verified by Horological Guild Records.",
    certificateNo: "HA-1892-DENT-8820",
    imageUrl: "/images/gold_pocket_watch.jpg",
    gallery: ["/images/gold_pocket_watch.jpg", "/images/hero_desk.jpg"],
    isFeatured: true,
    isReserved: false,
    isAuction: true,
    startingBid: 6500,
    currentBid: 7800,
    bidIncrement: 250,
    reservePrice: 7500,
    auctionStatus: "active",
    totalBidsCount: 2,
    auctionEndsAt: new Date(Date.now() + 86400000 * 3)
  },
  {
    _id: "65f010101010101010101003",
    title: "1795 Hand-Colored Folio World Atlas",
    subtitle: "Cary's New Universal Atlas of the Known World",
    category: "Leather Books & Manuscripts",
    century: "18th Century",
    year: 1795,
    origin: "Strand, London",
    coordinates: { lat: 51.5115, lng: -0.1197, locationName: "The Strand Cartographic Guild" },
    price: 12400,
    estimatedValue: "£13,500 - £15,000",
    material: "Calfskin Leather, Hand-Wove Paper, Copperplate Engravings",
    dimensions: "54cm x 41cm (Elephant Folio)",
    condition: "Fine Antique Condition (Crisp Colors)",
    rarity: "Very Rare First Edition",
    description: "Contains 60 double-page hand-colored cartographic maps engraved by John Cary. Detailed depiction of uncharted territories in North America and Australasia during the late 18th century.",
    provenance: "From the Private Library of the Duke of Northumberland at Syon House.",
    certificateNo: "HA-1795-CARY-0112",
    imageUrl: "/images/leather_atlas.jpg",
    gallery: ["/images/leather_atlas.jpg", "/images/hero_desk.jpg"],
    isFeatured: true,
    isReserved: false,
    isAuction: false
  },
  {
    _id: "65f010101010101010101004",
    title: "Georgian 1820 Royal Emerald & Diamond Ring",
    subtitle: "Colombian Untreated Emerald in Gold & Silver",
    category: "Estate Jewelry & Curios",
    century: "19th Century",
    year: 1820,
    origin: "Mayfair, London",
    coordinates: { lat: 51.5093, lng: -0.1481, locationName: "Mayfair Jewellers Row" },
    price: 16500,
    estimatedValue: "£18,000 - £22,000",
    material: "3.2ct Natural Colombian Emerald, Old Mine Diamonds, 18k Gold & Silver",
    dimensions: "Ring Size UK N / US 6.75",
    condition: "Exquisite Heritage Preservation",
    rarity: "Museum Rare",
    description: "A breathtaking Georgian crown ring showcasing a 3.2-carat vivid green Colombian emerald surrounded by 14 old mine cut diamonds set in closed-back foil mounts.",
    provenance: "Belonged to Lady Eleanor Cavendish of Derbyshire. Comes with SSEF Swiss Gemstone Certification.",
    certificateNo: "HA-1820-EM-9041",
    imageUrl: "/images/emerald_ring.jpg",
    gallery: ["/images/emerald_ring.jpg", "/images/hero_desk.jpg"],
    isFeatured: true,
    isReserved: false,
    isAuction: true,
    startingBid: 12000,
    currentBid: 15500,
    bidIncrement: 500,
    reservePrice: 15000,
    auctionStatus: "active",
    totalBidsCount: 1,
    auctionEndsAt: new Date(Date.now() + 86400000 * 1)
  }
];

const initialBids = [
  {
    _id: "65f040404040404040404001",
    antiqueId: "65f010101010101010101002",
    antiqueTitle: "Victorian 18k Gold Skeleton Pocket Watch",
    antiqueImageUrl: "/images/gold_pocket_watch.jpg",
    bidder: {
      userId: "65f020202020202020202004",
      name: "Lady Eleanor Cavendish",
      email: "eleanor@cavendish-manor.co.uk"
    },
    amount: 7200,
    note: "For Cavendish Horological Memorial Collection.",
    status: "outbid",
    createdAt: new Date(Date.now() - 3600000 * 5)
  },
  {
    _id: "65f040404040404040404002",
    antiqueId: "65f010101010101010101002",
    antiqueTitle: "Victorian 18k Gold Skeleton Pocket Watch",
    antiqueImageUrl: "/images/gold_pocket_watch.jpg",
    bidder: {
      userId: "65f020202020202020202002",
      name: "Lord Edward Harrington",
      email: "harrington@mayfair-estate.co.uk"
    },
    amount: 7800,
    note: "Historical Mayfair estate heirloom acquisition.",
    status: "leading",
    createdAt: new Date(Date.now() - 3600000 * 2)
  },
  {
    _id: "65f040404040404040404003",
    antiqueId: "65f010101010101010101001",
    antiqueTitle: "1888 Maritime Brass Navigational Sextant",
    antiqueImageUrl: "/images/brass_sextant.jpg",
    bidder: {
      userId: "65f020202020202020202002",
      name: "Lord Edward Harrington",
      email: "harrington@mayfair-estate.co.uk"
    },
    amount: 3800,
    note: "Intended for the Admirals Reading Room.",
    status: "outbid",
    createdAt: new Date(Date.now() - 3600000 * 8)
  },
  {
    _id: "65f040404040404040404004",
    antiqueId: "65f010101010101010101001",
    antiqueTitle: "1888 Maritime Brass Navigational Sextant",
    antiqueImageUrl: "/images/brass_sextant.jpg",
    bidder: {
      userId: "65f020202020202020202004",
      name: "Lady Eleanor Cavendish",
      email: "eleanor@cavendish-manor.co.uk"
    },
    amount: 4200,
    note: "Acquisition for the Royal Geographic Exhibition.",
    status: "leading",
    createdAt: new Date(Date.now() - 3600000 * 3)
  },
  {
    _id: "65f040404040404040404005",
    antiqueId: "65f010101010101010101004",
    antiqueTitle: "Georgian 1820 Royal Emerald & Diamond Ring",
    antiqueImageUrl: "/images/emerald_ring.jpg",
    bidder: {
      userId: "65f020202020202020202004",
      name: "Lady Eleanor Cavendish",
      email: "eleanor@cavendish-manor.co.uk"
    },
    amount: 15500,
    note: "Cavendish ancestral estate restoration.",
    status: "leading",
    createdAt: new Date(Date.now() - 3600000 * 1)
  }
];

const initialAppraisals = [
  {
    _id: "65f030303030303030303001",
    ownerName: "Lord Edward Harrington",
    email: "harrington@mayfair-estate.co.uk",
    itemTitle: "1865 Marine Chronometer by Thomas Mercer",
    approxAge: "19th Century",
    category: "Horology",
    details: "Gimballed brass chronometer in two-tier mahogany box. Key-wound 56-hour movement with spring detent escapement.",
    status: "Pending Review",
    estimatedValueOffer: "Pending Master Appraiser Review",
    appraiserNotes: "Awaiting physical inspection or high-res serial photograph.",
    createdAt: new Date()
  },
  {
    _id: "65f030303030303030303002",
    ownerName: "Lady Eleanor Cavendish",
    email: "eleanor@cavendish-manor.co.uk",
    itemTitle: "1780 Astronomical Table Map of the Moon",
    approxAge: "18th Century",
    category: "Leather Books & Manuscripts",
    details: "Copperplate engraving by Cassini IV. Hand-colored celestial coordinates with original gilt frame.",
    status: "Accepted & Valued",
    estimatedValueOffer: "£7,800",
    appraiserNotes: "Extremely rare 18th century lunar chart. Verified by Fleet Street Archives.",
    reviewedAt: new Date(),
    createdAt: new Date()
  }
];

// In-Memory Store Fallback
let useInMemory = false;
let inMemoryUsers = [...initialUsers];
let inMemoryAntiques = [...initialAntiques];
let inMemoryBids = [...initialBids];
let inMemoryOrders = [];
let inMemoryAppraisals = [...initialAppraisals];

// -------------------------------------------------------------
// MongoDB Atlas Connection Setup
// -------------------------------------------------------------
let dbStatus = "Connecting...";

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 6000
}).then(async () => {
  dbStatus = "Connected to MongoDB Atlas Cluster";
  console.log('✅ ' + dbStatus);
  useInMemory = false;
  
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Seeding initial user accounts (Senior Admin, Mid Admin, Customers)...');
      await User.insertMany(initialUsers);
    } else {
      // Ensure mid_admin Arthur Wellesley exists in MongoDB
      const hasMid = await User.findOne({ email: "mid.admin@heritage.co.uk" });
      if (!hasMid) {
        await User.create(initialUsers[1]);
      }
    }

    const count = await Antique.countDocuments();
    if (count === 0) {
      console.log('🌱 Seeding initial Heritage Antiques collection with auction settings...');
      await Antique.insertMany(initialAntiques);
    } else {
      // Sync auction parameters to existing MongoDB documents if not set
      for (const initA of initialAntiques) {
        if (initA.isAuction) {
          await Antique.findByIdAndUpdate(initA._id, {
            $set: {
              isAuction: true,
              startingBid: initA.startingBid,
              currentBid: initA.currentBid,
              bidIncrement: initA.bidIncrement,
              reservePrice: initA.reservePrice,
              auctionStatus: initA.auctionStatus,
              totalBidsCount: initA.totalBidsCount,
              auctionEndsAt: initA.auctionEndsAt
            }
          });
        }
      }
    }

    const bidCount = await Bid.countDocuments();
    if (bidCount === 0) {
      console.log('🌱 Seeding initial live auction bids...');
      await Bid.insertMany(initialBids);
    }

    const appCount = await Appraisal.countDocuments();
    if (appCount === 0) {
      console.log('🌱 Seeding sample appraisals for review...');
      await Appraisal.insertMany(initialAppraisals);
    }
  } catch (err) {
    console.error('Error seeding MongoDB database:', err.message);
  }
}).catch(err => {
  dbStatus = "MongoDB Atlas offline/restricted IP -> Operating in High-Speed Fallback Mode";
  console.warn('⚠️ MongoDB Atlas Connection Warning:', err.message);
  useInMemory = true;
});

// -------------------------------------------------------------
// REST API Routes
// -------------------------------------------------------------

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: "online",
    platform: "Heritage Antiques API Engine",
    databaseStatus: dbStatus,
    mode: useInMemory ? "In-Memory Vault Mode" : "MongoDB Atlas Cluster",
    serverTime: new Date().toISOString()
  });
});

// AUTH: Register Endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    if (!useInMemory) {
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) return res.status(400).json({ error: 'An account with this email already exists.' });

      const newUser = new User({
        name,
        email: email.toLowerCase(),
        password,
        role: role || 'customer'
      });
      await newUser.save();
      return res.status(201).json({
        user: { _id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }
      });
    } else {
      const existing = inMemoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) return res.status(400).json({ error: 'An account with this email already exists.' });

      const newUser = {
        _id: "user_" + Date.now(),
        name,
        email: email.toLowerCase(),
        password,
        role: role || 'customer'
      };
      inMemoryUsers.push(newUser);
      return res.status(201).json({
        user: { _id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// AUTH: Login Endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required.' });
    }

    if (!useInMemory) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Invalid credentials. Check email and password.' });
      }
      return res.json({
        user: { _id: user._id, name: user.name, email: user.email, role: user.role }
      });
    } else {
      const user = inMemoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Invalid credentials. Check email and password.' });
      }
      return res.json({
        user: { _id: user._id, name: user.name, email: user.email, role: user.role }
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Statistics Endpoint
app.get('/api/stats', async (req, res) => {
  try {
    let items = [];
    let bidsCount = 0;
    if (!useInMemory) {
      items = await Antique.find();
      bidsCount = await Bid.countDocuments();
    } else {
      items = inMemoryAntiques;
      bidsCount = inMemoryBids.length;
    }
    const totalValuation = items.reduce((acc, item) => acc + item.price, 0);
    const count = items.length;
    const centuries = [...new Set(items.map(i => i.century))].length;
    const activeAuctions = items.filter(i => i.isAuction && i.auctionStatus === 'active').length;
    const awardedAuctions = items.filter(i => i.isAuction && i.auctionStatus === 'awarded').length;
    
    res.json({
      totalValuation: `£${totalValuation.toLocaleString()}`,
      totalItems: count,
      centurySpan: `${centuries} Historic Eras`,
      authenticatedCertificates: `${count} Vault Certified`,
      activeAuctions,
      awardedAuctions,
      totalBids: bidsCount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/antiques - List all items with filters
app.get('/api/antiques', async (req, res) => {
  try {
    const { category, century, search, sort, minPrice, maxPrice, featured, isAuction, auctionStatus } = req.query;
    
    if (!useInMemory) {
      let query = {};
      if (category && category !== 'All') query.category = category;
      if (century && century !== 'All') query.century = century;
      if (featured === 'true') query.isFeatured = true;
      if (isAuction === 'true') query.isAuction = true;
      if (auctionStatus) query.auctionStatus = auctionStatus;
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { provenance: { $regex: search, $options: 'i' } },
          { origin: { $regex: search, $options: 'i' } }
        ];
      }

      let reqQuery = Antique.find(query);

      if (sort === 'price-asc') reqQuery = reqQuery.sort({ price: 1 });
      else if (sort === 'price-desc') reqQuery = reqQuery.sort({ price: -1 });
      else if (sort === 'year-asc') reqQuery = reqQuery.sort({ year: 1 });
      else if (sort === 'year-desc') reqQuery = reqQuery.sort({ year: -1 });
      else if (sort === 'bid-desc') reqQuery = reqQuery.sort({ currentBid: -1 });
      else reqQuery = reqQuery.sort({ createdAt: -1 });

      const items = await reqQuery.exec();
      return res.json(items);
    } else {
      let items = [...inMemoryAntiques];
      if (category && category !== 'All') items = items.filter(i => i.category === category);
      if (century && century !== 'All') items = items.filter(i => i.century === century);
      if (featured === 'true') items = items.filter(i => i.isFeatured);
      if (isAuction === 'true') items = items.filter(i => i.isAuction);
      if (auctionStatus) items = items.filter(i => i.auctionStatus === auctionStatus);
      if (minPrice) items = items.filter(i => i.price >= Number(minPrice));
      if (maxPrice) items = items.filter(i => i.price <= Number(maxPrice));
      if (search) {
        const s = search.toLowerCase();
        items = items.filter(i => 
          i.title.toLowerCase().includes(s) || 
          i.description.toLowerCase().includes(s) ||
          i.provenance.toLowerCase().includes(s)
        );
      }

      if (sort === 'price-asc') items.sort((a, b) => a.price - b.price);
      else if (sort === 'price-desc') items.sort((a, b) => b.price - a.price);
      else if (sort === 'year-asc') items.sort((a, b) => a.year - b.year);
      else if (sort === 'year-desc') items.sort((a, b) => b.year - a.year);
      else if (sort === 'bid-desc') items.sort((a, b) => (b.currentBid || 0) - (a.currentBid || 0));

      return res.json(items);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/antiques/:id
app.get('/api/antiques/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!useInMemory) {
      const item = await Antique.findById(id);
      if (!item) return res.status(404).json({ error: 'Antique artifact not found' });
      return res.json(item);
    } else {
      const item = inMemoryAntiques.find(i => i._id === id);
      if (!item) return res.status(404).json({ error: 'Antique artifact not found' });
      return res.json(item);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/antiques - Admin add antique
app.post('/api/antiques', async (req, res) => {
  try {
    const data = req.body;
    if (!data.title || !data.category || !data.price) {
      return res.status(400).json({ error: 'Title, category, and price are required.' });
    }

    if (!data.certificateNo) {
      data.certificateNo = `HA-${data.year || 1900}-${Math.floor(1000 + Math.random() * 9000)}`;
    }
    if (!data.imageUrl) {
      data.imageUrl = "/images/brass_sextant.jpg";
    }

    if (!useInMemory) {
      const newAntique = new Antique(data);
      await newAntique.save();
      return res.status(201).json(newAntique);
    } else {
      const newAntique = {
        _id: "mem_" + Date.now(),
        ...data,
        createdAt: new Date()
      };
      inMemoryAntiques.unshift(newAntique);
      return res.status(201).json(newAntique);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// ONLINE BIDDING SYSTEM ROUTES
// -------------------------------------------------------------

// GET /api/bids - Get bids (filter by antiqueId or email)
app.get('/api/bids', async (req, res) => {
  try {
    const { antiqueId, email } = req.query;
    if (!useInMemory) {
      let query = {};
      if (antiqueId) query.antiqueId = antiqueId;
      if (email) query['bidder.email'] = email.toLowerCase();
      const bids = await Bid.find(query).sort({ amount: -1, createdAt: -1 });
      return res.json(bids);
    } else {
      let bids = [...inMemoryBids];
      if (antiqueId) bids = bids.filter(b => b.antiqueId === antiqueId);
      if (email) bids = bids.filter(b => b.bidder?.email?.toLowerCase() === email.toLowerCase());
      bids.sort((a, b) => b.amount - a.amount || new Date(b.createdAt) - new Date(a.createdAt));
      return res.json(bids);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/bids - Place a bid on an active auction item
app.post('/api/bids', async (req, res) => {
  try {
    const { antiqueId, bidder, amount, note } = req.body;
    if (!antiqueId || !bidder || !bidder.name || !bidder.email || !amount) {
      return res.status(400).json({ error: 'Antique ID, bidder name, email, and bid amount are required.' });
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ error: 'Bid amount must be a positive number.' });
    }

    if (!useInMemory) {
      const antique = await Antique.findById(antiqueId);
      if (!antique) return res.status(404).json({ error: 'Antique artifact not found.' });

      if (antique.auctionStatus && antique.auctionStatus !== 'active') {
        return res.status(400).json({ error: `Auction is currently ${antique.auctionStatus}. New bids are closed.` });
      }

      const minAllowed = antique.currentBid 
        ? antique.currentBid + (antique.bidIncrement || 100) 
        : (antique.startingBid || antique.price);

      if (numericAmount < minAllowed) {
        return res.status(400).json({ 
          error: `Minimum acceptable bid is £${minAllowed.toLocaleString()}. Current leading bid is £${(antique.currentBid || 0).toLocaleString()}.` 
        });
      }

      // Mark all existing 'leading' bids for this item as 'outbid'
      await Bid.updateMany({ antiqueId, status: 'leading' }, { status: 'outbid' });

      // Create new bid record
      const newBid = new Bid({
        antiqueId,
        antiqueTitle: antique.title,
        antiqueImageUrl: antique.imageUrl,
        bidder: {
          userId: bidder.userId || '',
          name: bidder.name,
          email: bidder.email.toLowerCase()
        },
        amount: numericAmount,
        note: note || '',
        status: 'leading',
        createdAt: new Date()
      });
      await newBid.save();

      // Update antique with new current bid and count
      antique.currentBid = numericAmount;
      antique.totalBidsCount = (antique.totalBidsCount || 0) + 1;
      await antique.save();

      return res.status(201).json({ bid: newBid, antique });
    } else {
      const antique = inMemoryAntiques.find(a => a._id === antiqueId);
      if (!antique) return res.status(404).json({ error: 'Antique artifact not found.' });

      if (antique.auctionStatus && antique.auctionStatus !== 'active') {
        return res.status(400).json({ error: `Auction is currently ${antique.auctionStatus}. New bids are closed.` });
      }

      const minAllowed = antique.currentBid 
        ? antique.currentBid + (antique.bidIncrement || 100) 
        : (antique.startingBid || antique.price);

      if (numericAmount < minAllowed) {
        return res.status(400).json({ 
          error: `Minimum acceptable bid is £${minAllowed.toLocaleString()}. Current leading bid is £${(antique.currentBid || 0).toLocaleString()}.` 
        });
      }

      // Update in-memory previous leading bids
      inMemoryBids.forEach(b => {
        if (b.antiqueId === antiqueId && b.status === 'leading') {
          b.status = 'outbid';
        }
      });

      const newBid = {
        _id: "bid_" + Date.now(),
        antiqueId,
        antiqueTitle: antique.title,
        antiqueImageUrl: antique.imageUrl,
        bidder: {
          userId: bidder.userId || '',
          name: bidder.name,
          email: bidder.email.toLowerCase()
        },
        amount: numericAmount,
        note: note || '',
        status: 'leading',
        createdAt: new Date()
      };
      inMemoryBids.unshift(newBid);

      // Update antique
      antique.currentBid = numericAmount;
      antique.totalBidsCount = (antique.totalBidsCount || 0) + 1;

      return res.status(201).json({ bid: newBid, antique });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/auctions/:id/final-call - Mid-Level Admin Final Decision Call
app.post('/api/admin/auctions/:id/final-call', async (req, res) => {
  try {
    const { id } = req.params;
    const { winningBidId, adminNotes, decidedByName, decidedByEmail, decidedByRole } = req.body;

    if (!winningBidId) {
      return res.status(400).json({ error: 'Winning Bid ID is required to execute the final call.' });
    }

    if (!useInMemory) {
      const antique = await Antique.findById(id);
      if (!antique) return res.status(404).json({ error: 'Antique artifact not found.' });

      const winningBid = await Bid.findById(winningBidId);
      if (!winningBid) return res.status(404).json({ error: 'Selected winning bid not found.' });

      // Mark other bids for this item as declined, set winner to awarded
      await Bid.updateMany({ antiqueId: id }, { status: 'declined' });
      winningBid.status = 'awarded';
      await winningBid.save();

      // Update Antique status and awarded info
      antique.auctionStatus = 'awarded';
      antique.isReserved = true;
      antique.awardedTo = {
        userId: winningBid.bidder.userId,
        userName: winningBid.bidder.name,
        userEmail: winningBid.bidder.email,
        winningBid: winningBid.amount,
        awardedAt: new Date(),
        adminNotes: adminNotes || 'Approved by Mid-Level Auction Administrator after archival provenance assessment.',
        adminDecidedBy: `${decidedByName || 'Arthur Wellesley'} (${decidedByRole || 'Mid-Level Auction Admin'})`
      };
      await antique.save();

      return res.json({
        message: 'Final Call executed successfully. Lot awarded to selected bidder.',
        antique,
        awardedBid: winningBid
      });
    } else {
      const antique = inMemoryAntiques.find(a => a._id === id);
      if (!antique) return res.status(404).json({ error: 'Antique artifact not found.' });

      const winningBid = inMemoryBids.find(b => b._id === winningBidId);
      if (!winningBid) return res.status(404).json({ error: 'Selected winning bid not found.' });

      inMemoryBids.forEach(b => {
        if (b.antiqueId === id) {
          b.status = (b._id === winningBidId) ? 'awarded' : 'declined';
        }
      });

      antique.auctionStatus = 'awarded';
      antique.isReserved = true;
      antique.awardedTo = {
        userId: winningBid.bidder.userId,
        userName: winningBid.bidder.name,
        userEmail: winningBid.bidder.email,
        winningBid: winningBid.amount,
        awardedAt: new Date(),
        adminNotes: adminNotes || 'Approved by Mid-Level Auction Administrator after archival provenance assessment.',
        adminDecidedBy: `${decidedByName || 'Arthur Wellesley'} (${decidedByRole || 'Mid-Level Auction Admin'})`
      };

      return res.json({
        message: 'Final Call executed successfully. Lot awarded to selected bidder.',
        antique,
        awardedBid: winningBid
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/auctions/:id/reopen - Reopen an auction or reset final call
app.post('/api/admin/auctions/:id/reopen', async (req, res) => {
  try {
    const { id } = req.params;
    if (!useInMemory) {
      const antique = await Antique.findById(id);
      if (!antique) return res.status(404).json({ error: 'Antique artifact not found.' });
      
      antique.auctionStatus = 'active';
      antique.isReserved = false;
      antique.awardedTo = null;
      await antique.save();

      const bids = await Bid.find({ antiqueId: id }).sort({ amount: -1 });
      for (let i = 0; i < bids.length; i++) {
        bids[i].status = (i === 0) ? 'leading' : 'outbid';
        await bids[i].save();
      }
      return res.json({ message: 'Auction reopened for live bidding.', antique });
    } else {
      const antique = inMemoryAntiques.find(a => a._id === id);
      if (!antique) return res.status(404).json({ error: 'Antique artifact not found.' });

      antique.auctionStatus = 'active';
      antique.isReserved = false;
      antique.awardedTo = null;

      const lotBids = inMemoryBids.filter(b => b.antiqueId === id).sort((a, b) => b.amount - a.amount);
      lotBids.forEach((b, idx) => {
        b.status = (idx === 0) ? 'leading' : 'outbid';
      });

      return res.json({ message: 'Auction reopened for live bidding.', antique });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/auctions/:id/configure - Configure auction parameters on any item
app.post('/api/admin/auctions/:id/configure', async (req, res) => {
  try {
    const { id } = req.params;
    const { isAuction, startingBid, bidIncrement, reservePrice, auctionEndsAt } = req.body;

    if (!useInMemory) {
      const antique = await Antique.findById(id);
      if (!antique) return res.status(404).json({ error: 'Antique not found.' });

      if (isAuction !== undefined) antique.isAuction = Boolean(isAuction);
      if (startingBid !== undefined) {
        antique.startingBid = Number(startingBid);
        if (!antique.currentBid || antique.currentBid < antique.startingBid) {
          antique.currentBid = Number(startingBid);
        }
      }
      if (bidIncrement !== undefined) antique.bidIncrement = Number(bidIncrement);
      if (reservePrice !== undefined) antique.reservePrice = Number(reservePrice);
      if (auctionEndsAt !== undefined) antique.auctionEndsAt = new Date(auctionEndsAt);
      if (antique.isAuction && !antique.auctionStatus) antique.auctionStatus = 'active';

      await antique.save();
      return res.json(antique);
    } else {
      const antique = inMemoryAntiques.find(a => a._id === id);
      if (!antique) return res.status(404).json({ error: 'Antique not found.' });

      if (isAuction !== undefined) antique.isAuction = Boolean(isAuction);
      if (startingBid !== undefined) {
        antique.startingBid = Number(startingBid);
        if (!antique.currentBid || antique.currentBid < antique.startingBid) {
          antique.currentBid = Number(startingBid);
        }
      }
      if (bidIncrement !== undefined) antique.bidIncrement = Number(bidIncrement);
      if (reservePrice !== undefined) antique.reservePrice = Number(reservePrice);
      if (auctionEndsAt !== undefined) antique.auctionEndsAt = new Date(auctionEndsAt);
      if (antique.isAuction && !antique.auctionStatus) antique.auctionStatus = 'active';

      return res.json(antique);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// ORDERS & APPRAISALS ROUTES
// -------------------------------------------------------------

// POST /api/orders - Create order
app.post('/api/orders', async (req, res) => {
  try {
    const { customer, items, shippingMethod } = req.body;
    if (!customer || !items || items.length === 0) {
      return res.status(400).json({ error: 'Customer details and cart items required.' });
    }

    const subtotal = items.reduce((sum, item) => sum + (item.price || 0), 0);
    const insuranceFee = shippingMethod === 'White-Glove Vault Express' ? 250 : 120;
    const totalAmount = subtotal + insuranceFee;
    const orderNumber = `HA-ORD-${Date.now().toString().slice(-6)}`;

    const orderData = {
      orderNumber,
      customer,
      items,
      shippingMethod: shippingMethod || 'White-Glove Vault Express',
      insuranceFee,
      subtotal,
      totalAmount,
      paymentStatus: 'Paid (Vault Escrowed)',
      certificateOfAuthenticityIssued: true,
      createdAt: new Date()
    };

    if (!useInMemory) {
      const order = new Order(orderData);
      await order.save();
      return res.status(201).json(order);
    } else {
      inMemoryOrders.unshift(orderData);
      return res.status(201).json(orderData);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders - Get orders (Filter by email if query provided)
app.get('/api/orders', async (req, res) => {
  try {
    const { email } = req.query;
    if (!useInMemory) {
      let query = {};
      if (email) query['customer.email'] = email.toLowerCase();
      const orders = await Order.find(query).sort({ createdAt: -1 });
      return res.json(orders);
    } else {
      let orders = [...inMemoryOrders];
      if (email) orders = orders.filter(o => o.customer?.email?.toLowerCase() === email.toLowerCase());
      return res.json(orders);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/appraisals - Submit an antique for valuation
app.post('/api/appraisals', async (req, res) => {
  try {
    const { ownerName, email, itemTitle, approxAge, category, details } = req.body;
    if (!ownerName || !email || !itemTitle || !details) {
      return res.status(400).json({ error: 'Name, email, item title, and details are required.' });
    }

    const appraisalData = {
      ownerName,
      email: email.toLowerCase(),
      itemTitle,
      approxAge: approxAge || 'Unknown Era',
      category: category || 'Unassigned',
      details,
      status: 'Pending Review',
      estimatedValueOffer: 'Pending Master Appraiser Review',
      appraiserNotes: 'Awaiting curator assessment at Fleet Street Vaults.',
      createdAt: new Date()
    };

    if (!useInMemory) {
      const appraisal = new Appraisal(appraisalData);
      await appraisal.save();
      return res.status(201).json(appraisal);
    } else {
      appraisalData._id = "app_" + Date.now();
      inMemoryAppraisals.unshift(appraisalData);
      return res.status(201).json(appraisalData);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/appraisals - List appraisals (Optional filter by user email)
app.get('/api/appraisals', async (req, res) => {
  try {
    const { email } = req.query;
    if (!useInMemory) {
      let query = {};
      if (email) query.email = email.toLowerCase();
      const list = await Appraisal.find(query).sort({ createdAt: -1 });
      return res.json(list);
    } else {
      let list = [...inMemoryAppraisals];
      if (email) list = list.filter(a => a.email?.toLowerCase() === email.toLowerCase());
      return res.json(list);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/admin/appraisals/:id - Admin Appraiser Decision (Accept/Reject & Set Valuation)
app.put('/api/admin/appraisals/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, estimatedValueOffer, appraiserNotes } = req.body;

    if (!status || !['Accepted & Valued', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Valid status ("Accepted & Valued" or "Rejected") is required.' });
    }

    if (!useInMemory) {
      const appraisal = await Appraisal.findById(id);
      if (!appraisal) return res.status(404).json({ error: 'Appraisal request not found' });

      appraisal.status = status;
      if (estimatedValueOffer) appraisal.estimatedValueOffer = estimatedValueOffer;
      if (appraiserNotes) appraisal.appraiserNotes = appraiserNotes;
      appraisal.reviewedAt = new Date();

      await appraisal.save();
      return res.json(appraisal);
    } else {
      const appraisal = inMemoryAppraisals.find(a => a._id === id);
      if (!appraisal) return res.status(404).json({ error: 'Appraisal request not found' });

      appraisal.status = status;
      if (estimatedValueOffer) appraisal.estimatedValueOffer = estimatedValueOffer;
      if (appraiserNotes) appraisal.appraiserNotes = appraiserNotes;
      appraisal.reviewedAt = new Date();

      return res.json(appraisal);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🏰 Heritage Antiques Server listening on http://localhost:${PORT}`);
});
