const Visitor = require('../models/Visitor');

exports.getAllVisitors = async (req, res) => {
  const visitors = await Visitor.findAll();
  res.json(visitors);
};

exports.filterVisitors = async (req, res) => {
  const { purpose, date } = req.query;
  const where = {};
  if (purpose) where.purpose_of_visit = purpose;
  if (date) where.date = date;
  const visitors = await Visitor.findAll({ where });
  res.json(visitors);
};
