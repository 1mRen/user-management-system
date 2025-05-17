const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../_middleware/validate-request');
const authorize = require('../_middleware/authorize');
const Role = require('../_helpers/role');
const departmentService = require('./department.service');

// Routes
router.post('/', authorize(Role.Admin), createSchema, create);
router.get('/', authorize(), getAll);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(Role.Admin), updateSchema, update);
router.delete('/:id', authorize(Role.Admin), _delete);

module.exports = router;

// Schema validation rules
function createSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().allow('', null),
        code: Joi.string().allow('', null),
        location: Joi.string().allow('', null),
        accountId: Joi.number().integer(),
        isActive: Joi.boolean()
    });
    validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string(),
        description: Joi.string().allow('', null),
        code: Joi.string().allow('', null),
        location: Joi.string().allow('', null),
        accountId: Joi.number().integer(),
        isActive: Joi.boolean()
    });
    validateRequest(req, next, schema);
}

// Controller functions
async function create(req, res, next) {
    try {
        console.log('Creating department, received data:', req.body);
        
        // If accountId is not provided, use the authenticated user's account ID
        const params = { ...req.body };
        
        console.log('Current user:', req.user);
        
        if (!params.accountId && req.user) {
            params.accountId = req.user.accountId || req.user.id;
            console.log('Using user account ID:', params.accountId);
        }
        
        if (!params.accountId) {
            console.log('No accountId found, returning 400');
            return res.status(400).json({ message: "Account ID is required" });
        }
        
        console.log('Creating department with params:', params);
        const department = await departmentService.create(params);
        console.log('Department created:', department);
        return res.json(department);
    } catch (error) {
        console.error('Error creating department:', error);
        // Return a more detailed error message
        return res.status(500).json({ 
            message: error.message || "Validation error",
            details: error.toString()
        });
    }
}

async function getAll(req, res, next) {
    try {
        const departments = await departmentService.getAll();
        return res.json(departments);
    } catch (error) {
        next(error);
    }
}

async function getById(req, res, next) {
    try {
        const department = await departmentService.getById(req.params.id);
        return res.json(department);
    } catch (error) {
        next(error);
    }
}

async function update(req, res, next) {
    try {
        console.log('Updating department, received data:', req.body);
        
        // If accountId is not provided, use the authenticated user's account ID
        const params = { ...req.body };
        
        console.log('Current user:', req.user);
        
        if (params.accountId === undefined && req.user) {
            params.accountId = req.user.accountId || req.user.id;
            console.log('Using user account ID:', params.accountId);
        }
        
        console.log('Updating department with params:', params);
        const department = await departmentService.update(req.params.id, params);
        console.log('Department updated:', department);
        return res.json(department);
    } catch (error) {
        console.error('Error updating department:', error);
        // Return a more detailed error message
        return res.status(500).json({ 
            message: error.message || "Validation error",
            details: error.toString()
        });
    }
}

async function _delete(req, res, next) {
    try {
        await departmentService.delete(req.params.id);
        return res.json({ message: 'Department deleted successfully' });
    } catch (error) {
        next(error);
    }
}