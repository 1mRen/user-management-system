const express = require('express');
const router = express.Router();
const db = require('../_helpers/db');
const authorize = require('../_middleware/authorize');
const Role = require('../_helpers/role');

// Routes for requests
router.post('/', authorize(), create);
router.get('/', authorize(), getAll);
router.get('/employee/:employeeId', authorize(), getByEmployeeId);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(), update);
router.put('/:id/status', authorize(Role.Admin), updateStatus);
router.delete('/:id', authorize(Role.Admin), _delete);

async function create(req, res, next) {
  try {
    // Validate required fields
    if (!req.body.employeeId) {
      return res.status(400).json({ message: 'Employee ID is required' });
    }
    if (!req.body.type) {
      return res.status(400).json({ message: 'Request type is required' });
    }
    if (!req.body.title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    // Check if employee exists
    const employee = await db.Employee.findByPk(req.body.employeeId);
    if (!employee) {
      return res.status(400).json({ message: 'Employee not found' });
    }

    // Create request
    const request = await db.Request.create({
      ...req.body,
      requestDate: new Date(),
      status: 'pending'
    });

    // For transfer requests, automatically create a workflow
    if (req.body.type === 'transfer' && req.body.details?.departmentId) {
      await db.Workflow.create({
        employeeId: req.body.employeeId,
        type: 'Transfer',
        status: 'Pending',
        details: { 
          requestId: request.id,
          fromDepartmentId: employee.departmentId,
          toDepartmentId: req.body.details.departmentId
        }
      });
    }

    res.status(201).json(request);
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
    if (req.query.priority) {
      where.priority = req.query.priority;
    }

    const requests = await db.Request.findAll({
      where,
      include: [
        { 
          model: db.Employee,
          include: [{ model: db.Account, attributes: ['firstName', 'lastName'] }]
        }
      ],
      order: [
        ['priority', 'DESC'],
        ['requestDate', 'DESC']
      ]
    });

    res.json(requests);
  } catch (err) { next(err); }
}

async function getByEmployeeId(req, res, next) {
  try {
    const requests = await db.Request.findAll({
      where: { employeeId: req.params.employeeId },
      order: [['requestDate', 'DESC']]
    });

    res.json(requests);
  } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try {
    const request = await db.Request.findByPk(req.params.id, {
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

    if (!request) throw new Error('Request not found');

    res.json(request);
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const request = await db.Request.findByPk(req.params.id);

    if (!request) throw new Error('Request not found');

    // Check if the user is allowed to update this request
    // Only allow updates if request is pending or in_progress
    if (!['pending', 'in_progress'].includes(request.status)) {
      return res.status(400).json({ 
        message: 'Cannot update a request that is already completed, approved, or rejected' 
      });
    }

    // Update request
    Object.assign(request, req.body);
    request.updated = new Date();
    await request.save();

    res.json(request);
  } catch (err) { next(err); }
}

async function updateStatus(req, res, next) {
  try {
    const request = await db.Request.findByPk(req.params.id);

    if (!request) throw new Error('Request not found');

    // Update status
    request.status = req.body.status;
    request.approverId = req.body.approverId || null;

    // If completing the request
    if (['approved', 'rejected', 'completed'].includes(req.body.status)) {
      request.completionDate = new Date();
    }

    request.updated = new Date();
    await request.save();

    // Handle special case for transfer requests
    if (request.type === 'transfer' && request.status === 'approved' && request.details?.departmentId) {
      const employee = await db.Employee.findByPk(request.employeeId);
      if (employee) {
        employee.departmentId = request.details.departmentId;
        employee.updated = new Date();
        await employee.save();
      }
    }

    res.json(request);
  } catch (err) { next(err); }
}

async function _delete(req, res, next) {
  try {
    const request = await db.Request.findByPk(req.params.id);

    if (!request) throw new Error('Request not found');

    // Only allow deletion of pending requests
    if (request.status !== 'pending') {
      return res.status(400).json({ 
        message: 'Only pending requests can be deleted' 
      });
    }

    await request.destroy();

    res.json({ message: 'Request deleted successfully' });
  } catch (err) { next(err); }
}

module.exports = router;