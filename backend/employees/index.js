const express = require('express');
const router = express.Router();
const db = require('../_helpers/db');
const authorize = require('../_middleware/authorize');
const Role = require('../_helpers/role');

router.post('/', authorize(Role.Admin), create);
router.get('/', authorize(), getAll);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(Role.Admin), update);
router.delete('/:id', authorize(Role.Admin), _delete);
router.post('/:id/transfer', authorize(Role.Admin), transfer);

async function create(req, res, next) {
  try {
    // Validate required fields
    if (!req.body.departmentId) {
      return res.status(400).json({ message: 'Department ID is required' });
    }
    if (!req.body.position) {
      return res.status(400).json({ message: 'Position is required' });
    }
    if (!req.body.startDate) {
      req.body.startDate = new Date(); // Default to current date if not provided
    }

    const employee = await db.Employee.create(req.body);
    
    // If there's an accountId, check that the account exists
    if (req.body.accountId) {
      const account = await db.Account.findByPk(req.body.accountId);
      if (!account) {
        await employee.destroy();
        return res.status(400).json({ message: 'Account not found' });
      }
    }
    
    // Create onboarding workflow automatically
    await db.Workflow.create({
      employeeId: employee.id,
      type: 'Onboarding',
      status: 'Pending',
      details: { position: employee.position }
    });
    
    res.status(201).json(employee);
  } catch (err) { next(err); }
}

async function getAll(req, res, next) {
  try {
    // Allow filtering by department
    const where = {};
    if (req.query.departmentId) {
      where.departmentId = req.query.departmentId;
    }
    
    // Allow filtering by status
    if (req.query.status) {
      where.status = req.query.status;
    }
    
    const employees = await db.Employee.findAll({
      where,
      include: [
        { model: db.Department },
        { model: db.Account, attributes: ['firstName', 'lastName', 'email'] }
      ]
    });
    
    res.json(employees);
  } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try {
    const employee = await db.Employee.findByPk(req.params.id, {
      include: [
        { model: db.Department },
        { model: db.Account, attributes: ['firstName', 'lastName', 'email'] }
      ]
    });
    
    if (!employee) throw new Error('Employee not found');
    
    res.json(employee);
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const employee = await db.Employee.findByPk(req.params.id);
    
    if (!employee) throw new Error('Employee not found');
    
    // Update employee record
    Object.assign(employee, req.body);
    employee.updated = new Date();
    await employee.save();
    
    res.json(employee);
  } catch (err) { next(err); }
}

async function _delete(req, res, next) {
  try {
    const employee = await db.Employee.findByPk(req.params.id);
    
    if (!employee) throw new Error('Employee not found');
    
    // Check if employee has active workflows
    const activeWorkflows = await db.Workflow.count({ 
      where: { 
        employeeId: req.params.id,
        status: ['Pending', 'In Progress']
      }
    });
    
    if (activeWorkflows > 0) {
      throw new Error('Cannot delete employee with active workflows');
    }
    
    // Create offboarding workflow if employee is active
    if (employee.status === 'active') {
      await db.Workflow.create({
        employeeId: employee.id,
        type: 'Offboarding',
        status: 'Pending',
        details: { reason: req.body.reason || 'No reason provided' }
      });
    }
    
    // Soft delete - mark as inactive instead of deleting
    employee.isActive = false;
    employee.status = 'terminated';
    employee.endDate = new Date();
    employee.updated = new Date();
    await employee.save();
    
    res.json({ message: 'Employee deactivated successfully' });
  } catch (err) { next(err); }
}

async function transfer(req, res, next) {
  try {
    const employee = await db.Employee.findByPk(req.params.id);
    
    if (!employee) throw new Error('Employee not found');
    
    // Validate new department exists
    const department = await db.Department.findByPk(req.body.departmentId);
    if (!department) throw new Error('Target department not found');
    
    // Create transfer workflow
    await db.Workflow.create({
      employeeId: employee.id,
      type: 'Transfer',
      status: 'Pending',
      details: { 
        fromDepartmentId: employee.departmentId,
        toDepartmentId: req.body.departmentId,
        reason: req.body.reason || 'Organizational restructuring'
      }
    });
    
    // Update employee's department
    const oldDepartmentId = employee.departmentId;
    employee.departmentId = req.body.departmentId;
    employee.updated = new Date();
    await employee.save();
    
    res.json({ 
      message: 'Employee transferred successfully',
      from: oldDepartmentId,
      to: req.body.departmentId
    });
  } catch (err) { next(err); }
}

module.exports = router;