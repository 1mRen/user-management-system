const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../_middleware/validate-request');
const authorize = require('../_middleware/authorize');
const Role = require('../_helpers/role');
const requestService = require('./request.service');
const db = require('../_helpers/db');

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
    // Base schema
    const baseSchema = {
        employeeId: Joi.number().required(),
        type: Joi.string().valid('leave', 'transfer', 'promotion', 'equipment', 'resources', 'other').required(),
        title: Joi.string().required(),
        description: Joi.string(),
        priority: Joi.string().valid('low', 'medium', 'high', 'urgent').default('medium')
    };

    // Different schemas based on request type
    let schema;
    
    if (req.body.type === 'equipment') {
        schema = Joi.object({
            ...baseSchema,
            items: Joi.array().items(
                Joi.object({
                    name: Joi.string().required(),
                    quantity: Joi.number().integer().min(1).required(),
                    purpose: Joi.string().required()
                })
            ).required()
        });
    } else if (req.body.type === 'resources') {
        schema = Joi.object({
            ...baseSchema,
            items: Joi.array().items(
                Joi.object({
                    name: Joi.string().required(),
                    quantity: Joi.number().integer().min(1).required()
                })
            ).required()
        });
    } else if (req.body.type === 'leave') {
        schema = Joi.object({
            ...baseSchema,
            date: Joi.array().items(
                Joi.object({
                    "start-date": Joi.date().iso().required(),
                    "end-date": Joi.date().iso().min(Joi.ref('start-date')).required(),
                    purpose: Joi.string().required()
                })
            ).required()
        });
    } else {
        schema = Joi.object({
            ...baseSchema,
            details: Joi.object()
        });
    }

    validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        status: Joi.string().valid('pending', 'approved', 'rejected', 'in_progress', 'completed', 'cancelled'),
        priority: Joi.string().valid('low', 'medium', 'high', 'urgent'),
        description: Joi.string(),
        approverId: Joi.number(),
        details: Joi.object(),
        items: Joi.array().items(
            Joi.object({
                name: Joi.string(),
                quantity: Joi.number().integer().min(1),
                purpose: Joi.string()
            })
        ),
        date: Joi.array().items(
            Joi.object({
                "start-date": Joi.date().iso(),
                "end-date": Joi.date().iso(),
                purpose: Joi.string()
            })
        )
    });
    validateRequest(req, next, schema);
}

// Controller functions
async function create(req, res, next) {
    try {
        // Format request body based on request type
        let formattedBody = {
            employeeId: req.body.employeeId,
            type: req.body.type,
            title: req.body.title || `New ${req.body.type} request`,
            description: req.body.description,
            priority: req.body.priority || 'medium',
            details: {}
        };

        // Handle different request types
        if (req.body.type === 'equipment') {
            if (!req.body.items || !Array.isArray(req.body.items)) {
                return res.status(400).json({ 
                    message: 'Equipment requests must include an items array' 
                });
            }
            formattedBody.details.items = req.body.items;
        } else if (req.body.type === 'resources') {
            if (!req.body.items || !Array.isArray(req.body.items)) {
                return res.status(400).json({ 
                    message: 'Resource requests must include an items array' 
                });
            }
            formattedBody.details.items = req.body.items;
        } else if (req.body.type === 'leave') {
            if (!req.body.date || !Array.isArray(req.body.date)) {
                return res.status(400).json({ 
                    message: 'Leave requests must include a date array' 
                });
            }
            
            // Calculate days for each leave period
            const datesWithDays = req.body.date.map(period => {
                const startDate = new Date(period["start-date"]);
                const endDate = new Date(period["end-date"]);
                const diffTime = Math.abs(endDate - startDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
                
                return {
                    startDate: period["start-date"],
                    endDate: period["end-date"],
                    purpose: period.purpose,
                    days: diffDays
                };
            });
            
            formattedBody.details.date = req.body.date;
            formattedBody.details.calculatedDays = datesWithDays;
        } else {
            // For other request types
            formattedBody.details = req.body.details || {};
        }
        
        const request = await requestService.create(formattedBody);
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