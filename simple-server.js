const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle React routing, return all requests to React app
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// In-memory storage for demo
let users = [];
let startupProfiles = [];
let investorProfiles = [];
let swipes = [];
let matches = [];

// Utility functions
const generateId = () => Math.random().toString(36).substr(2, 9);
const findUser = (email) => users.find(u => u.email === email);
const findUserById = (id) => users.find(u => u.id === id);

// Simple JWT simulation (don't use in production!)
const createToken = (user) => Buffer.from(JSON.stringify(user)).toString('base64');
const verifyToken = (token) => {
  try {
    return JSON.parse(Buffer.from(token, 'base64').toString());
  } catch {
    return null;
  }
};

// Auth middleware
const authenticate = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const token = auth.split(' ')[1];
  const user = verifyToken(token);
  if (!user) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  
  req.user = user;
  next();
};

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth routes
app.post('/api/v1/auth/signup', (req, res) => {
  const { email, password, userType, firstName, lastName } = req.body;
  
  if (findUser(email)) {
    return res.status(409).json({ error: 'User already exists' });
  }
  
  const user = {
    id: generateId(),
    email,
    password, // In real app, hash this!
    userType,
    firstName,
    lastName,
    createdAt: new Date().toISOString()
  };
  
  users.push(user);
  
  const token = createToken({ id: user.id, email: user.email, userType: user.userType });
  
  res.status(201).json({
    accessToken: token,
    user: {
      id: user.id,
      email: user.email,
      userType: user.userType,
      firstName: user.firstName,
      lastName: user.lastName
    }
  });
});

app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = findUser(email);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const token = createToken({ id: user.id, email: user.email, userType: user.userType });
  
  res.json({
    accessToken: token,
    user: {
      id: user.id,
      email: user.email,
      userType: user.userType,
      firstName: user.firstName,
      lastName: user.lastName
    }
  });
});

// User routes
app.get('/api/v1/users/profile', authenticate, (req, res) => {
  const user = findUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  let profile = null;
  if (user.userType === 'startup') {
    profile = startupProfiles.find(p => p.userId === user.id);
  } else {
    profile = investorProfiles.find(p => p.userId === user.id);
  }
  
  res.json({
    id: user.id,
    email: user.email,
    userType: user.userType,
    firstName: user.firstName,
    lastName: user.lastName,
    profile
  });
});

app.post('/api/v1/users/startup-profile', authenticate, (req, res) => {
  if (req.user.userType !== 'startup') {
    return res.status(403).json({ error: 'Only startups can create startup profiles' });
  }
  
  const profile = {
    id: generateId(),
    userId: req.user.id,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  
  // Generate slug
  profile.slug = profile.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  
  startupProfiles.push(profile);
  res.status(201).json(profile);
});

app.post('/api/v1/users/investor-profile', authenticate, (req, res) => {
  if (req.user.userType !== 'investor') {
    return res.status(403).json({ error: 'Only investors can create investor profiles' });
  }
  
  const profile = {
    id: generateId(),
    userId: req.user.id,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  
  investorProfiles.push(profile);
  res.status(201).json(profile);
});

// Matching routes
app.get('/api/v1/matching/feed', authenticate, (req, res) => {
  const { limit = 20 } = req.query;
  const user = findUserById(req.user.id);
  
  // Find opposite user type
  const targetType = user.userType === 'startup' ? 'investor' : 'startup';
  const targetProfiles = targetType === 'startup' ? startupProfiles : investorProfiles;
  
  // Get users who haven't been swiped on
  const swipedIds = swipes.filter(s => s.userId === req.user.id).map(s => s.targetId);
  const candidates = targetProfiles
    .filter(p => !swipedIds.includes(p.userId))
    .slice(0, parseInt(limit))
    .map(profile => {
      const targetUser = findUserById(profile.userId);
      
      if (targetType === 'startup') {
        return {
          id: targetUser.id,
          type: 'startup',
          name: profile.name,
          stage: profile.stage,
          sectors: profile.sectors || [],
          valuation: profile.valuation,
          arr: profile.arr,
          description: profile.description,
          compatibilityScore: Math.floor(Math.random() * 40) + 60 // Random score 60-100
        };
      } else {
        return {
          id: targetUser.id,
          type: 'investor',
          name: profile.name,
          investorType: profile.type,
          sectorFocus: profile.sectorFocus || [],
          checkSizeMin: profile.checkSizeMin,
          checkSizeMax: profile.checkSizeMax,
          description: profile.description,
          compatibilityScore: Math.floor(Math.random() * 40) + 60
        };
      }
    });
  
  res.json(candidates);
});

app.post('/api/v1/matching/swipe', authenticate, (req, res) => {
  const { targetId, direction } = req.body;
  
  // Check if already swiped
  const existingSwipe = swipes.find(s => s.userId === req.user.id && s.targetId === targetId);
  if (existingSwipe) {
    return res.status(400).json({ error: 'Already swiped on this user' });
  }
  
  const swipe = {
    id: generateId(),
    userId: req.user.id,
    targetId,
    direction,
    createdAt: new Date().toISOString()
  };
  
  swipes.push(swipe);
  
  let match = null;
  
  // Check for mutual match if right swipe
  if (direction === 'right') {
    const reciprocalSwipe = swipes.find(s => 
      s.userId === targetId && 
      s.targetId === req.user.id && 
      s.direction === 'right'
    );
    
    if (reciprocalSwipe) {
      const user = findUserById(req.user.id);
      const target = findUserById(targetId);
      
      const matchData = {
        id: generateId(),
        startupId: user.userType === 'startup' ? req.user.id : targetId,
        investorId: user.userType === 'investor' ? req.user.id : targetId,
        mutualScore: Math.floor(Math.random() * 40) + 60,
        status: 'matched',
        createdAt: new Date().toISOString()
      };
      
      matches.push(matchData);
      match = matchData;
    }
  }
  
  res.json({
    swipeId: swipe.id,
    match
  });
});

app.get('/api/v1/matching/matches', authenticate, (req, res) => {
  const userMatches = matches.filter(m => 
    m.startupId === req.user.id || m.investorId === req.user.id
  );
  
  const formattedMatches = userMatches.map(match => {
    const startup = findUserById(match.startupId);
    const investor = findUserById(match.investorId);
    const startupProfile = startupProfiles.find(p => p.userId === match.startupId);
    const investorProfile = investorProfiles.find(p => p.userId === match.investorId);
    
    return {
      id: match.id,
      mutualScore: match.mutualScore,
      createdAt: match.createdAt,
      startup: {
        id: startup?.id,
        name: startupProfile?.name || 'Unnamed Startup',
        stage: startupProfile?.stage,
        sectors: startupProfile?.sectors || [],
        valuation: startupProfile?.valuation
      },
      investor: {
        id: investor?.id,
        name: investorProfile?.name || 'Unnamed Investor',
        type: investorProfile?.type,
        sectorFocus: investorProfile?.sectorFocus || [],
        checkSizeMin: investorProfile?.checkSizeMin,
        checkSizeMax: investorProfile?.checkSizeMax
      }
    };
  });
  
  res.json(formattedMatches);
});

// Demo data seeding
const seedDemoData = () => {
  // Create demo users
  const demoStartup = {
    id: 'startup1',
    email: 'startup@demo.com',
    password: 'password',
    userType: 'startup',
    firstName: 'Jane',
    lastName: 'Founder'
  };
  
  const demoInvestor = {
    id: 'investor1',
    email: 'investor@demo.com',
    password: 'password',
    userType: 'investor',
    firstName: 'John',
    lastName: 'Investor'
  };
  
  users.push(demoStartup, demoInvestor);
  
  // Create demo profiles
  startupProfiles.push({
    id: 'profile1',
    userId: 'startup1',
    name: 'TechFlow AI',
    stage: 'seed',
    sectors: ['fintech', 'ai'],
    description: 'AI-powered financial analytics platform',
    valuation: 5000000,
    arr: 500000,
    slug: 'techflow-ai'
  });
  
  investorProfiles.push({
    id: 'profile2',
    userId: 'investor1',
    name: 'Future Ventures',
    type: 'vc',
    sectorFocus: ['fintech', 'ai', 'saas'],
    stagePreferences: ['seed', 'series-a'],
    checkSizeMin: 250000,
    checkSizeMax: 2000000,
    description: 'Early-stage VC focused on B2B SaaS and AI'
  });
};

// Add some demo data
seedDemoData();

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Matchmaking Platform API running on port ${PORT}`);
  console.log(`📚 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API base: http://localhost:${PORT}/api/v1`);
  console.log(`\\n📋 Demo Accounts:`);
  console.log(`   Startup: startup@demo.com / password`);
  console.log(`   Investor: investor@demo.com / password`);
});
