const express = require('express');
const router = express.Router();
const db = require('../_helpers/db');
const authorize = require('../_middleware/authorize');
const Role = require('../_helpers/role');

// Routes
router.post('/', authorize(Role.Admin), create);
router.get('/', authorize(), getAll);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(Role.Admin), update);
router.delete('/:id', authorize(Role.Admin), _delete);

// Create new department
async function create(req, res, next) {
  try {
    // Validate required fields
    if (!req.body.name) {
      return res.status(400).json({ message: 'Department name is required' });
    }
    
    const department = await db.Department.create(req.body);
    res.status(201).json(department);
  } catch (err) { 
    next(err); 
  }
}

// Get all departments
async function getAll(req, res, next) {
  try {
    const departments = await db.Department.findAll({
      include: [{ model: db.Employee, attributes: ['id'] }]
    });
    
    res.json(departments.map(d => ({
      ...d.toJSON(),
      employeeCount: d.Employees ? d.Employees.length : 0
    })));
  } catch (err) { 
    next(err); 
  }
}

// Get department by id
async function getById(req, res, next) {
  try {
    const department = await db.Department.findByPk(req.params.id, {
      include: [{ model: db.Employee, attributes: ['id', 'firstName', 'lastName', 'position'] }]
    });
    
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    
    res.json({
      ...department.toJSON(), 
      employeeCount: department.Employees ? department.Employees.length : 0
    });
  } catch (err) { 
    next(err); 
  }
}

// Update department
async function update(req, res, next) {
  try {
    const department = await db.Department.findByPk(req.params.id);
    
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    
    // Validate required fields
    if (req.body.name === '') {
      return res.status(400).json({ message: 'Department name cannot be empty' });
    }
    
    Object.assign(department, req.body);
    department.updated = new Date();
    await department.save();
    
    res.json(department);
  } catch (err) { 
    next(err); 
  }
}

// Delete department
async function _delete(req, res, next) {
  try { 
    const department = await db.Department.findByPk(req.params.id);
    
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    
    // Check if department has employees
    const employeeCount = await db.Employee.count({ where: { departmentId: req.params.id } });
    if (employeeCount > 0) {
      return res.status(400).json({ message: 'Cannot delete department with active employees' });
    }
    
    await department.destroy();
    res.json({ message: 'Department deleted successfully' });
  } catch (err) { 
    next(err); 
  }
}

module.exports = router;