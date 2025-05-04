const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../_middleware/validate-request');
const authorize = require('../_middleware/authorize');
const Role = require('../_helpers/role');
const workflowService = require('./workflow.service');

// Routes
router.post('/', authorize(Role.Admin), createSchema, create);
router.get('/employee/:employeeId', authorize(), getByEmployeeId);
router.put('/:id/status', authorize(Role.Admin), updateStatusSchema, updateStatus);
router.post('/onboarding', authorize(Role.Admin), onboardingSchema, initiateOnboarding);

module.exports = router;

// Schema validation rules
function createSchema(req, res, next) {
    const schema = Joi.object({
        employeeId: Joi.number().required(),
        type: Joi.string().valid('onboarding', 'offboarding', 'promotion', 'transfer', 'other').required(),
        details: Joi.object(),
        notes: Joi.string(),
        assignedTo: Joi.number()
    });
    validateRequest(req, next, schema);
}

function updateStatusSchema(req, res, next) {
    const schema = Joi.object({
        status: Joi.string().valid('pending', 'in_progress', 'completed', 'cancelled').required()
    });
    validateRequest(req, next, schema);
}

function onboardingSchema(req, res, next) {
    const schema = Joi.object({
        employeeId: Joi.number().required(),
        details: Joi.object({
            task: Joi.string(),
            tasks: Joi.array().items(Joi.object({
                name: Joi.string().required(),
                completed: Joi.boolean().default(false)
            }))
        })
    });
    validateRequest(req, next, schema);
}

// Controller functions
async function create(req, res, next) {
    try {
        const workflow = await workflowService.create(req.body);
        return res.json(workflow);
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
        
        // Check if user has access to this employee's workflows
        if (req.role !== Role.Admin && req.account.id !== employee.accountId) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        
        const workflows = await workflowService.getByEmployeeId(employeeId);
        return res.json(workflows);
    } catch (error) {
        next(error);
    }
}

async function updateStatus(req, res, next) {
    try {
        const workflow = await workflowService.updateStatus(req.params.id, req.body);
        return res.json(workflow);
    } catch (error) {
        next(error);
    }
}

async function initiateOnboarding(req, res, next) {
    try {
        const workflow = await workflowService.initiateOnboarding(req.body);
        return res.json(workflow);
    } catch (error) {
        next(error);
    }
}