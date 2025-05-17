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
                    quantity: Joi.number().integer().min(1).required()
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
            items: Joi.array().items(
                Joi.object({
                    name: Joi.string().required(),
                    quantity: Joi.number().integer().min(1).required()
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
                quantity: Joi.number().integer().min(1)
            })
        ),
        date: Joi.array().items(
            Joi.object({
                "start-date": Joi.date().iso(),
                "end-date": Joi.date().iso()
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
            if (!req.body.items || !Array.isArray(req.body.items)) {
                return res.status(400).json({ 
                    message: 'Leave requests must include an items array' 
                });
            }
            
            formattedBody.details.items = req.body.items;
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
        console.log('Getting request by ID:', req.params.id);
        
        // Ensure ID is a valid number
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid request ID' });
        }
        
        console.log(`Calling requestService.getById with ID: ${id}`);
        const request = await requestService.getById(id);
        
        // For debugging - log the request object
        console.log('Request found:', { 
            id: request.id, 
            type: request.type, 
            status: request.status,
            employeeId: request.employeeId
        });
        
        // Enhanced employee relation handling
        try {
            // Check if employee relation is present
            if (!request.employee && request.employeeId) {
                console.error('Employee relation missing in request:', {
                    id: request.id,
                    employeeId: request.employeeId
                });
                
                // Try to load the employee directly
                const employee = await db.Employee.findByPk(request.employeeId, {
                    include: [{ model: db.Account }]
                });
                
                if (employee) {
                    console.log('Employee loaded separately:', {
                        id: employee.id,
                        accountId: employee.accountId
                    });
                    request.employee = employee;
                } else {
                    console.log('Could not find employee with ID:', request.employeeId);
                    // Create a placeholder employee to avoid null reference errors
                    request.employee = { 
                        id: request.employeeId,
                        accountId: null, 
                        account: null 
                    };
                }
            }
            
            // Ensure we have employee object even if fetching failed
            if (!request.employee) {
                request.employee = { id: null, accountId: null, account: null };
            }
        } catch (employeeError) {
            console.error('Error loading employee relation:', employeeError);
            // Don't let this block the request from being returned
            request.employee = { id: null, accountId: null, account: null };
        }
        
        // Check if user has access to this request
        // For admins, always allow access
        if (req.auth.role === Role.Admin) {
            // Admin has full access, continue
            console.log('Admin access granted to request:', request.id);
        } else {
            // For non-admins, check if the request belongs to them
            console.log('Checking non-admin access:', {
                userAccountId: req.auth?.id,
                requestEmployeeAccountId: request.employee?.accountId
            });
            
            // Only check if both values exist
            if (req.auth && req.auth.id && request.employee && request.employee.accountId) {
                if (req.auth.id !== request.employee.accountId) {
                    return res.status(403).json({ message: 'Forbidden' });
                }
            }
        }
        
        return res.json(request);
    } catch (error) {
        console.error('Error in getById controller:', error);
        
        // Send a more descriptive error back to the client
        if (error === 'Request not found') {
            return res.status(404).json({ message: 'Request not found' });
        }
        
        if (error === 'Invalid request ID format') {
            return res.status(400).json({ message: 'Invalid request ID format' });
        }
        
        if (error === 'Error loading request details') {
            return res.status(500).json({ message: 'Error loading request details' });
        }
        
        return res.status(500).json({ message: 'Internal server error', error: error.toString() });
    }
}

async function getByEmployeeId(req, res, next) {
    try {
        const employeeId = parseInt(req.params.employeeId);
        
        // Get employee to check access
        const employee = await db.Employee.findByPk(employeeId);
        if (!employee) throw 'Employee not found';
        
        // Check if user has access to this employee's requests
        if (req.auth.role !== Role.Admin && req.auth.id !== employee.accountId) {
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