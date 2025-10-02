const User = require('../models/user');
const Role = require('../models/role');

exports.getAll = async (req, res) => {
  try {
    const { username, fullName } = req.query;
    const filter = { isDelete: false };
    if (username) filter.username = new RegExp(username, 'i');
    if (fullName) filter.fullName = new RegExp(fullName, 'i');

    const users = await User.find(filter).populate('role', 'name');
    res.json({ success:true, data: users });
  } catch (err) {
    res.status(500).json({ success:false, error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const u = await User.findById(req.params.id).populate('role', 'name');
    if (!u) return res.status(404).json({ success:false, message: 'Not found' });
    res.json({ success:true, data: u });
  } catch (err) {
    res.status(400).json({ success:false, error: err.message });
  }
};

exports.getByUsername = async (req, res) => {
  try {
    const u = await User.findOne({ username: req.params.username, isDelete:false }).populate('role', 'name');
    if (!u) return res.status(404).json({ success:false, message: 'Not found' });
    res.json({ success:true, data: u });
  } catch (err) {
    res.status(400).json({ success:false, error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    // optional: validate role exists if provided
    if (req.body.role) {
      const r = await Role.findById(req.body.role);
      if (!r) return res.status(400).json({ success:false, message: 'Invalid role id' });
    }
    const u = new User({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      fullName: req.body.fullName || "",
      avatarUrl: req.body.avatarUrl || "",
      role: req.body.role || null,
      loginCount: req.body.loginCount || 0
    });
    await u.save();
    res.json({ success:true, data: u });
  } catch (err) {
    // duplicate key handling
    if (err.code === 11000) {
      return res.status(400).json({ success:false, error: 'Duplicate field', details: err.keyValue });
    }
    res.status(400).json({ success:false, error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const update = {
      username: req.body.username,
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      status: req.body.status,
      role: req.body.role,
      loginCount: req.body.loginCount
    };
    // remove undefined fields
    Object.keys(update).forEach(k => update[k] === undefined && delete update[k]);
    const u = await User.findByIdAndUpdate(req.params.id, update, { new:true }).populate('role', 'name');
    res.json({ success:true, data: u });
  } catch (err) {
    res.status(400).json({ success:false, error: err.message });
  }
};

// soft delete user
exports.softDelete = async (req, res) => {
  try {
    const u = await User.findByIdAndUpdate(req.params.id, { isDelete: true }, { new:true });
    res.json({ success:true, data: u });
  } catch (err) {
    res.status(400).json({ success:false, error: err.message });
  }
};

// verify endpoint: given username + email -> set status true
exports.verifyUser = async (req, res) => {
  try {
    const { username, email } = req.body;
    if (!username || !email) return res.status(400).json({ success:false, message: 'username and email required' });

    const u = await User.findOne({ username: username, email: email });
    if (!u) return res.status(404).json({ success:false, message: 'User not found or mismatch' });

    u.status = true;
    await u.save();
    res.json({ success:true, data: u });
  } catch (err) {
    res.status(500).json({ success:false, error: err.message });
  }
};
