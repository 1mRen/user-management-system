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
        description: Joi.string(),
        managerId: Joi.number(),
        code: Joi.string(),
        location: Joi.string()
    });
    validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string(),
        description: Joi.string(),
        managerId: Joi.number().allow(null),
        code: Joi.string(),
        location: Joi.string()
    });
    validateRequest(req, next, schema);
}

// Controller functions
async function create(req, res, next) {
    try {
        const department = await departmentService.create(req.body);
        return res.json(department);
    } catch (error) {
        next(error);
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
        const department = await departmentService.update(req.params.id, req.body);
        return res.json(department);
    } catch (error) {
        next(error);
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