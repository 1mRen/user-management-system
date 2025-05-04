const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../_middleware/validate-request');
const authorize = require('../_middleware/authorize');
const Role = require('../_helpers/role');
const requestService = require('./request.service');

// Routes
router.post('/', authorize(), createSchema, create);
router.get('/', authorize(Role.Admin), getAll);
router.get('/:id', authorize(), getById);
router.get('/employee/:employeeId', authorize(), getByEmployeeId);
router.put('/:id', authorize(Role.Admin), updateSchema, update);
router.delete('/:id', authorize(Role.Admin), _delete);

module.exports = router;

// Schema validation rules
function createSchema(req, res, next) {
    const schema = Joi.object({
        employeeId: Joi.number().required(),
        type: Joi.string().valid('leave', 'transfer', 'promotion', 'equipment', 'other').required(),
        title: Joi.string().required(),
        description: Joi.string(),
        priority: Joi.string().valid('low', 'medium', 'high', 'urgent').default('medium'),
        details: Joi.object()
    });
    validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        status: Joi.string().valid('pending', 'approved', 'rejected', 'in_progress', 'completed', 'cancelled'),
        priority: Joi.string().valid('low', 'medium', 'high', 'urgent'),
        description: Joi.string(),
        approverId: Joi.number(),
        details: Joi.object()
    });
    validateRequest(req, next, schema);
}

// Controller functions
async function create(req, res, next) {
    try {
        // For equipment requests, validate the items array
        if (req.body.type === 'equipment') {
            if (!req.body.details || !req.body.details.items || !Array.isArray(req.body.details.items)) {
                return res.status(400).json({ 
                    message: 'Equipment requests must include an items array in details' 
                });
            }
        }
        
        const request = await requestService.create(req.body);
        return res.json(request);
    } catch (error) {
        next(error);
    }
}

async function getAll(req, res, next) {
    try {
        const requests = await requestService.getAll();
        return res.json(requests);
    } catch (error) {
        next(error);
    }
}

async function getById(req, res, next) {
    try {
        const request = await requestService.getById(req.params.id);
        
        // Check if user has access to this request
        if (req.role !== Role.Admin && req.account.id !== request.employee.accountId) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        
        return res.json(request);
    } catch (error) {
        next(error);
    }
}

async function getByEmployeeId(req, res, next) {
    try {
        const employeeId = parseInt(req.params.employeeId);
        
        // Get employee to check access
        const employee = await db.Employee.findByPk(employeeId);
        if (!employee) throw 'Employee not found';
        
        // Check if user has access to this employee's requests
        if (req.role !== Role.Admin && req.account.id !== employee.accountId) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        
        const requests = await requestService.getByEmployeeId(employeeId);
        return res.json(requests);
    } catch (error) {
        next(error);
    }
}

async function update(req, res, next) {
    try {
        const request = await requestService.update(req.params.id, req.body);
        return res.json(request);
    } catch (error) {
        next(error);
    }
}

async function _delete(req, res, next) {
    try {
        await requestService.delete(req.params.id);
        return res.json({ message: 'Request deleted successfully' });
    } catch (error) {
        next(error);
    }
}