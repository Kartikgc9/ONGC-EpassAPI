const { readEpassData } = require('../config/db');

exports.getAllVisitors = async (req, res) => {
  const visitors = await readEpassData();
  res.json(visitors);
};

exports.filterVisitors = async (req, res) => {
  const { purpose, date } = req.query;
  let visitors = await readEpassData();
  
  if (purpose) {
    visitors = visitors.filter(v => v.purpose_of_visit === purpose);
  }
  if (date) {
    visitors = visitors.filter(v => v.date === date);
  }
  
  res.json(visitors);
};

exports.getTotalVisitors = async (req, res) => {
  const visitors = await readEpassData();
  res.json({ totalVisitors: visitors.length });
};

exports.getVisitsPerEmployee = async (req, res) => {
  const visitors = await readEpassData();
  const visitsPerEmployee = visitors.reduce((acc, visitor) => {
    const employee = visitor.employee_to_meet;
    acc[employee] = (acc[employee] || 0) + 1;
    return acc;
  }, {});
  res.json(visitsPerEmployee);
};

exports.getPurposeBreakdown = async (req, res) => {
  const visitors = await readEpassData();
  const purposeBreakdown = visitors.reduce((acc, visitor) => {
    const purpose = visitor.purpose_of_visit;
    acc[purpose] = (acc[purpose] || 0) + 1;
    return acc;
  }, {});
  res.json(purposeBreakdown);
};

exports.getVisitsByDate = async (req, res) => {
  const visitors = await readEpassData();
  const visitsByDate = visitors.reduce((acc, visitor) => {
    const date = visitor.date;
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});
  res.json(visitsByDate);
};

exports.getVisitsByLocation = async (req, res) => {
  const visitors = await readEpassData();
  const visitsByLocation = visitors.reduce((acc, visitor) => {
    const location = visitor.location;
    acc[location] = (acc[location] || 0) + 1;
    return acc;
  }, {});
  res.json(visitsByLocation);
};