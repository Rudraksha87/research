const { v4: uuidv4 } = require('uuid');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');
const { supabase, isConfigured, memoryStore } = require('../config/supabase');

const register = async (req, res) => {
  try {
    const { email, password, organization } = req.body;
    const fullName = req.body.fullName || req.body.name || 'Researcher';

    // Check existing
    let existingUser = null;
    if (isConfigured && supabase) {
      const { data } = await supabase.from('users').select('id').eq('email', email).single();
      existingUser = data;
    } else {
      existingUser = memoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    }

    if (existingUser) {
      if (!isConfigured || !supabase) {
        // In local in-memory development mode, seamlessly update password and log researcher in
        existingUser.password_hash = await hashPassword(password);
        existingUser.full_name = fullName;
        existingUser.organization = organization || existingUser.organization;

        const token = generateToken({
          userId: existingUser.id,
          email: existingUser.email,
          fullName: existingUser.full_name
        });

        return res.status(200).json({
          success: true,
          message: 'Account updated and signed in successfully.',
          token,
          user: {
            id: existingUser.id,
            email: existingUser.email,
            fullName: existingUser.full_name,
            organization: existingUser.organization,
            role: existingUser.role
          }
        });
      }

      return res.status(409).json({ success: false, message: 'An account with this email address already exists. Please log in.' });
    }

    const passwordHash = await hashPassword(password);
    const newUser = {
      id: uuidv4(),
      email,
      password_hash: passwordHash,
      full_name: fullName,
      organization: organization || 'Independent Researcher',
      role: 'researcher',
      created_at: new Date().toISOString()
    };

    if (isConfigured && supabase) {
      const { error } = await supabase.from('users').insert([newUser]);
      if (error) throw error;
    } else {
      memoryStore.users.push(newUser);
    }

    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
      fullName: newUser.full_name
    });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.full_name,
        organization: newUser.organization,
        role: newUser.role
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = null;
    if (isConfigured && supabase) {
      const { data } = await supabase.from('users').select('*').eq('email', email).single();
      user = data;
    } else {
      user = memoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'No account found with this email. Please register or check your email.' });
    }

    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect password. Please verify your credentials and try again.' });
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      fullName: user.full_name
    });

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        organization: user.organization,
        role: user.role
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const me = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  register,
  login,
  me
};
