const express = require('express');
const router = express.Router();
const authorize = require('../_middleware/authorize');
const Role = require('../_helpers/role');
const db = require('../_helpers/db');

module.exports = router;

// Routes
router.post('/workflows', authorize(Role.Admin), create);
router.get('/workflows/employee/:employeeId', authorize(), getByEmployeeId);
router.put('/workflows/:id/status', authorize(Role.Admin), updateStatus);
router.post('/workflows/onboarding', authorize(Role.Admin), onboarding);

// Controller functions
async function create(req, res, next) {
    try {
        const workflow = await db.Workflow.create(req.body);
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
        
        await workflow.update({ status: req.body.status });
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
            status: 'Pending'
        });
        res.status(201).json(workflow);
    } catch (err) {
        next(err);
    }
}