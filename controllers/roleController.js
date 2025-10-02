const Role = require('../models/role');

exports.getAll = async (req, res) => {
  try {
    // nếu muốn filter theo name chứa: ?name=abc
    const { name } = req.query;
    const filter = { isDelete: false };
    if (name) filter.name = new RegExp(name, 'i');
    const roles = await Role.find(filter);
    res.json({ success: true, data: roles });
  } catch (err) {
    res.status(500).json({ success:false, error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ success:false, message: 'Not found' });
    res.json({ success:true, data: role });
  } catch (err) {
    res.status(400).json({ success:false, error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const r = new Role({ name: req.body.name, description: req.body.description });
    await r.save();
    res.json({ success:true, data: r });
  } catch (err) {
    res.status(400).json({ success:false, error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await Role.findByIdAndUpdate(req.params.id, { name: req.body.name, description: req.body.description }, { new:true });
    res.json({ success:true, data: updated });
  } catch (err) {
    res.status(400).json({ success:false, error: err.message });
  }
};

// soft-delete
exports.softDelete = async (req, res) => {
  try {
    const updated = await Role.findByIdAndUpdate(req.params.id, { isDelete: true }, { new:true });
    res.json({ success:true, data: updated });
  } catch (err) {
    res.status(400).json({ success:false, error: err.message });
  }
};
