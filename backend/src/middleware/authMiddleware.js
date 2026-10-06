const { verifyToken } = require('../utils/jwt');
const { supabase, isConfigured, memoryStore } = require('../config/supabase');

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ success: false, message: 'Invalid or expired authentication token.' });
    }

    // Attach user information
    let user = null;
    if (isConfigured && supabase) {
      const { data, error } = await supabase.from('users').select('*').eq('id', decoded.userId).single();
      if (!error && data) user = data;
    } else {
      user = memoryStore.users.find(u => u.id === decoded.userId);
    }

    if (!user) {
      // In dev fallback, allow decoded payload as user
      req.user = { id: decoded.userId, email: decoded.email, fullName: decoded.fullName };
    } else {
      req.user = { id: user.id, email: user.email, fullName: user.full_name || user.fullName, role: user.role };
    }

    next();
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Auth middleware error: ' + err.message });
  }
};

module.exports = {
  requireAuth
};
