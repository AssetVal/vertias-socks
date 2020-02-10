const User = require('../models/userModel');
const Client = require('../models/clientModel.js');
const Realtor = require('../models/realtorModel');
const TempRealtor = require('../models/tempRealtorModel');
const Employee = require('../models/employeeModel');

class RoleController {
  async find(ctx) { ctx.body = await User.find();} // Get all clients
  async findRole(ctx){
    try {
      const token = await ctx.headers.authorization.substring(7, ctx.headers.authorization.length).toString();
      const user = await User.findOne({jsonAuth: token});
      let role;
      if (user.roles === 'realtor'){
        role = await Realtor.findOne({user: user._id}).populate('user');
      } else if (user.roles === 'tempRealtor'){
        role = await TempRealtor.findOne({user: user._id}).populate('user');
      } else if (user.roles === 'employee' || user.roles === 'Admin' || user.roles === 'isIt' || user.roles === 'analyst'){
        role = await Employee.findOne({user: user._id}).populate('user');
      } else if (user.roles ==='client') {
        role = await Client.findOne({user: user._id}).populate('user');
      }
      ctx.body = role;
    } catch (err) {
      if (err.name === 'CastError' || err.name === 'NotFoundError') { ctx.throw(404); }
      ctx.throw(500);
    }
  }
  async findRoleAndReturn(ctx){
    try {
      const token = await ctx.headers.authorization.substring(7, ctx.headers.authorization.length).toString();
      const user = await User.findOne({jsonAuth: token});
      let role;
      if (user.roles === 'realtor'){
        role = await Realtor.findOne({user: user._id}).populate('user');
      } else if (user.roles === 'tempRealtor'){
        role = await TempRealtor.findOne({user: user._id}).populate('user');
      } else if (user.roles === 'employee' || user.roles === 'Admin' || user.roles === 'isIt' || user.roles === 'analyst'){
        role = await Employee.findOne({user: user._id}).populate('user');
      } else if (user.roles ==='client') {
        role = await Client.findOne({user: user._id}).populate('user');
      }
      return role;
    } catch (err) {
      if (err.name === 'CastError' || err.name === 'NotFoundError') { return err }
      return err;
    }
  }
  async findRoleById(id){
    try {
      const user = await User.findOne({jsonAuth: id});
      let role;
      if (user.roles === 'realtor'){
        role = await Realtor.findOne({user: user._id}).populate('user');
      } else if (user.roles === 'tempRealtor'){
        role = await TempRealtor.findOne({user: user._id}).populate('user');
      } else if (user.roles === 'employee' || user.roles === 'Admin' || user.roles === 'isIt' || user.roles === 'analyst'){
        role = await Employee.findOne({user: user._id}).populate('user');
      } else if (user.roles ==='client') {
        role = await Client.findOne({user: user._id}).populate('user');
      }
      return role;
    } catch (err) {
      if (err.name === 'CastError' || err.name === 'NotFoundError') { return err }
      return err
    }
  }
  async findRoleAndKey(ctx, key, userOnly = false){
    try {
      const token = await ctx.headers.authorization.substring(7, ctx.headers.authorization.length).toString();
      const user = await User.findOne({jsonAuth: token});
      let role;
      if (user.roles === 'realtor'){
        role = await Realtor.findOne({user: user._id}).populate('user');
      } else if (user.roles === 'tempRealtor'){
        role = await TempRealtor.findOne({user: user._id}).populate('user');
      } else if (user.roles === 'employee' || user.roles === 'Admin' || user.roles === 'isIt' || user.roles === 'analyst'){
        role = await Employee.findOne({user: user._id}).populate('user');
      } else if (user.roles ==='client') {
        role = await Client.findOne({user: user._id}).populate('user');
      } else if (user.roles ==='client') {
        role = await Client.findOne({user: user._id}).populate('user');
      }
      if (userOnly === true){
        return user[key]
      }
      return role[key];
    } catch (err) {
      if (err.name === 'CastError' || err.name === 'NotFoundError') { return err }
      return err
    }
  }
  async findRoleAndKeys(ctx, keys){
    try {
      const token = await ctx.headers.authorization.substring(7, ctx.headers.authorization.length).toString();
      const user = await User.findOne({jsonAuth: token});
      const tempUser = {};
      let role;
      if (user.roles === 'realtor'){
        role = await Realtor.findOne({user: user._id}).populate('user');
      } else if (user.roles === 'tempRealtor'){
        role = await TempRealtor.findOne({user: user._id}).populate('user');
      } else if (user.roles === 'employee' || user.roles === 'Admin' || user.roles === 'isIt' || user.roles === 'analyst'){
        role = await Employee.findOne({user: user._id}).populate('user');
      } else if (user.roles ==='client') {
        role = await Client.findOne({user: user._id}).populate('user');
      } else if (user.roles ==='client') {
        role = await Client.findOne({user: user._id}).populate('user');
      }
      keys.forEach((key) => { tempUser[key] = role[key]; });
      return tempUser;
    } catch (err) {
      if (err.name === 'CastError' || err.name === 'NotFoundError') { return err }
      return err
    }
  }
}
module.exports = new RoleController();
