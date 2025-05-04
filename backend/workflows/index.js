const express = require('express');
const router = express.Router();
const db = require('../_helpers/db');
const authorize = require('../_middleware/authorize');
const Role = require('../_helpers/role');

router.post('/', authorize(Role.Admin), create);
router.get('/', authorize(Role.Admin), getAll);
router.get('/employee/:employeeId', authorize(), getByEmployeeId);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(Role.Admin), update);
router.put('/:id/status', authorize(Role.Admin), updateStatus);
router.post('/onboarding', authorize(Role.Admin), onboarding);
router.post('/offboarding', authorize(Role.Admin), offboarding);

async function create(req, res, next) {
  try {
    // Validate required fields
    if (!req.body.employeeId) {
      return res.status(400).json({ message: 'Employee ID is required' });
    }
    if (!req.body.type) {
      return res.status(400).json({ message: 'Workflow type is required' });
    }

    // Check if employee exists
    const employee = await db.Employee.findByPk(req.body.employeeId);
    if (!employee) {
      return res.status(400).json({ message: 'Employee not found' });
    }

    // Create workflow with default values
    const workflow = await db.Workflow.create({
      ...req.body,
      status: req.body.status || 'Pending',
      startDate: req.body.startDate || new Date()
    });

    res.status(201).json(workflow);
  } catch (err) { next(err); }
}

async function getAll(req, res, next) {
  try {
    // Apply filters if provided
    const where = {};

    if (req.query.type) {
      where.type = req.query.type;
    }
    if (req.query.status) {
      where.status = req.query.status;
    }

    const workflows = await db.Workflow.findAll({
      where,
      include: [
        { 
          model: db.Employee,
          include: [
            { model: db.Account, attributes: ['firstName', 'lastName'] },
            { model: db.Department }
          ]
        }
      ],
      order: [
        ['status', 'ASC'],
        ['startDate', 'DESC']
      ]
    });

    res.json(workflows);
  } catch (err) { next(err); }
}

async function getByEmployeeId(req, res, next) {
  try {
    const workflows = await db.Workflow.findAll({
      where: { employeeId: req.params.employeeId },
      order: [['startDate', 'DESC']]
    });

    res.json(workflows);
  } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try {
    const workflow = await db.Workflow.findByPk(req.params.id, {
      include: [
        { 
          model: db.Employee,
          include: [
            { model: db.Account, attributes: ['firstName', 'lastName'] },
            { model: db.Department }
          ]
        }
      ]
    });

    if (!workflow) throw new Error('Workflow not found');

    res.json(workflow);
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const workflow = await db.Workflow.findByPk(req.params.id);

    if (!workflow) throw new Error('Workflow not found');

    // Update workflow
    Object.assign(workflow, req.body);
    workflow.updated = new Date();
    await workflow.save();

    res.json(workflow);
  } catch (err) { next(err); }
}

async function updateStatus(req, res, next) {
  try {
    const workflow = await db.Workflow.findByPk(req.params.id);

    if (!workflow) throw new Error('Workflow not found');

    // Update status
    workflow.status = req.body.status;
    workflow.notes = req.body.notes || workflow.notes;
    
    // If completing the workflow
    if (req.body.status === 'Completed') {
      workflow.completionDate = new Date();
    }

    workflow.updated = new Date();
    await workflow.save();

    // Handle special cases based on workflow type and new status
    if (workflow.status === 'Completed') {
      // For offboarding, mark employee as inactive when workflow is completed
      if (workflow.type === 'Offboarding') {
        const employee = await db.Employee.findByPk(workflow.employeeId);
        if (employee) {
          employee.isActive = false;
          employee.status = 'terminated';
          employee.endDate = new Date();
          employee.updated = new Date();
          await employee.save();
        }
      }
      
      // For onboarding, mark employee as active when workflow is completed
      if (workflow.type === 'Onboarding') {
        const employee = await db.Employee.findByPk(workflow.employeeId);
        if (employee) {
          employee.isActive = true;
          employee.status = 'active';
          employee.updated = new Date();
          await employee.save();
        }
      }
    }

    res.json(workflow);
  } catch (err) { next(err); }
}

async function onboarding(req, res, next) {
  try {
    // Check if employee exists
    const employee = await db.Employee.findByPk(req.body.employeeId);
    if (!employee) {
      return res.status(400).json({ message: 'Employee not found' });
    }

    // Create onboarding workflow
    const workflow = await db.Workflow.create({
      employeeId: req.body.employeeId,
      type: 'Onboarding',
      status: 'Pending',
      details: req.body.details || {
        position: employee.position,
        department: employee.departmentId
      },
      startDate: new Date(),
      dueDate: req.body.dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Default due date 2 weeks from now
      assignedTo: req.body.assignedTo || null
    });

    res.status(201).json(workflow);
  } catch (err) { next(err); }
}

async function offboarding(req, res, next) {
  try {
    // Check if employee exists
    const employee = await db.Employee.findByPk(req.body.employeeId);
    if (!employee) {
      return res.status(400).json({ message: 'Employee not found' });
    }

    // Create offboarding workflow
    const workflow = await db.Workflow.create({
      employeeId: req.body.employeeId,
      type: 'Offboarding',
      status: 'Pending',
      details: req.body.details || {
        position: employee.position,
        department: employee.departmentId,
        reason: req.body.reason || 'Not specified'
      },
      startDate: new Date(),
      dueDate: req.body.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default due date 1 week from now
      assignedTo: req.body.assignedTo || null
    });

    res.status(201).json(workflow);
  } catch (err) { next(err); }
}

module.exports = router;