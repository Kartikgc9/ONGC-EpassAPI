const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Visitor = sequelize.define('Visitor', {
  visitor_name: DataTypes.STRING,
  purpose_of_visit: DataTypes.STRING,
  location: DataTypes.STRING,
  employee_to_meet: DataTypes.STRING,
  date: DataTypes.DATEONLY
}, {
  tableName: 'visitors',
  timestamps: false
});

module.exports = Visitor;