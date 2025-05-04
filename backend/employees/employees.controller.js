const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../_middleware/validate-request');
const authorize = require('../_middleware/authorize');
const Role = require('../_helpers/role');
const employeeService = require('./employee.service');

// Routes
router.post('/', authorize(Role.Admin), createSchema, create);
router.get('/', authorize(), getAll);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(Role.Admin), updateSchema, update);
router.delete('/:id', authorize(Role.Admin), _delete);
router.post('/:id/transfer', authorize(Role.Admin), transferSchema, transfer);

module.exports = router;

// Schema validation rules
function createSchema(req, res, next) {
    const schema = Joi.object({
        employeeId: Joi.string(),
        accountId: Joi.number(),
        position: Joi.string().required(),
        departmentId: Joi.number().required(),
        startDate: Joi.date().default(new Date()),
        salary: Joi.number(),
        employeeNumber: Joi.string(),
        manager: Joi.boolean()
    });
    validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        position: Joi.string(),
        departmentId: Joi.number(),
        salary: Joi.number(),
        employeeNumber: Joi.string(),
        manager: Joi.boolean(),
        status: Joi.string().valid('active', 'on_leave', 'terminated', 'suspended'),
        endDate: Joi.date()
    });
    validateRequest(req, next, schema);
}

function transferSchema(req, res, next) {
    const schema = Joi.object({
        departmentId: Joi.number().required(),
        reason: Joi.string()
    });
    validateRequest(req, next, schema);
}

// Controller functions
async function create(req, res, next) {
    try {
        const employee = await employeeService.create(req.body);
        return res.json(employee);
    } catch (error) {
        next(error);
    }
}

async function getAll(req, res, next) {
    try {
        const employees = await employeeService.getAll();
        return res.json(employees);
    } catch (error) {
        next(error);
    }
}

async function getById(req, res, next) {
    try {
        const employee = await employeeService.getById(req.params.id);
        return res.json(employee);
    } catch (error) {
        next(error);
    }
}

async function update(req, res, next) {
    try {
        const employee = await employeeService.update(req.params.id, req.body);
        return res.json(employee);
    } catch (error) {
        next(error);
    }
}

async function _delete(req, res, next) {
    try {
        await employeeService.delete(req.params.id);
        return res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        next(error);
    }
}

async function transfer(req, res, next) {
    try {
        const employee = await employeeService.transferEmployee(req.params.id, req.body);
        return res.json(employee);
    } catch (error) {
        next(error);
    }
}