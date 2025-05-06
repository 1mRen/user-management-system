// workflows.controller.js
const express = require('express');
const router = express.Router();
const authorize = require('../_middleware/authorize');
const Role = require('../_helpers/role');
const db = require('../_helpers/db');

// Routes - Notice we removed the '/workflows' prefix from these routes
router.post('/', authorize(Role.Admin), create);
router.get('/employees/:employeeId', authorize(), getByEmployeeId);
router.put('/:id/status', authorize(Role.Admin), updateStatus);
router.post('/onboarding', authorize(Role.Admin), onboarding);

// Controller functions
async function create(req, res, next) {
    try {
        // Ensure updated is null on creation
        const workflowData = {
            ...req.body,
            updated: null
        };
        const workflow = await db.Workflow.create(workflowData);
        res.status(201).json(workflow);
    } catch (err) {
        next(err);
    }
}

async function getByEmployeeId(req, res, next) {
    try {
        const workflows = await db.Workflow.findAll({
            where: { employeeId: req.params.employeeId }
        });
        res.json(workflows);
    } catch (err) {
        next(err);
    }
}

async function updateStatus(req, res, next) {
    try {
        const workflow = await db.Workflow.findByPk(req.params.id);
        if (!workflow) throw new Error('Workflow not found');
        
        // Set updated timestamp when status changes
        await workflow.update({ 
            status: req.body.status,
            updated: new Date()
        });
        res.json(workflow);
    } catch (err) {
        next(err);
    }
}

async function onboarding(req, res, next) {
    try {
        const workflow = await db.Workflow.create({
            employeeId: req.body.employeeId,
            type: 'Onboarding',
            details: req.body.details,
            status: 'Pending',
            updated: null // Explicitly set updated to null initially
        });
        res.status(201).json(workflow);
    } catch (err) {
        next(err);
    }
}

module.exports = router;