const db = require('../_helpers/db');

module.exports = {
    getAll,
    getById,
    getByEmployeeId,
    create,
    update,
    delete: _delete
};

async function getAll() {
    return await db.Request.findAll({
        include: [
            { 
                model: db.Employee,
                include: [
                    { model: db.Account, attributes: ['id', 'firstName', 'lastName', 'email'] }
                ]
            },
            {
                model: db.Employee, 
                as: 'Approver',
                include: [
                    { model: db.Account, attributes: ['id', 'firstName', 'lastName', 'email'] }
                ]
            }
        ],
        order: [['createdAt', 'DESC']]
    });
}

async function getById(id) {
    const request = await db.Request.findByPk(id, {
        include: [
            { 
                model: db.Employee,
                include: [
                    { model: db.Account, attributes: ['id', 'firstName', 'lastName', 'email'] }
                ]
            },
            {
                model: db.Employee, 
                as: 'Approver',
                include: [
                    { model: db.Account, attributes: ['id', 'firstName', 'lastName', 'email'] }
                ]
            }
        ]
    });
    
    if (!request) throw 'Request not found';
    return request;
}

async function getByEmployeeId(employeeId) {
    return await db.Request.findAll({
        where: { employeeId },
        include: [
            { 
                model: db.Employee,
                attributes: ['id'], // Only include the employee ID
                include: [
                    { model: db.Account, attributes: ['id', 'firstName', 'lastName', 'email'] }
                ]
            },
            {
                model: db.Employee, 
                as: 'Approver',
                attributes: ['id'], // Only include the approver ID
                include: [
                    { model: db.Account, attributes: ['id', 'firstName', 'lastName', 'email'] }
                ]
            }
        ] 
    });
}

async function create(params) {
    // Validate employee exists
    const employee = await db.Employee.findByPk(params.employeeId);
    if (!employee || !employee.isActive) throw 'Employee not found';

    // Create request
    const request = await db.Request.create(params);
    
    // Create workflow for certain request types that require workflow tracking
    const workflowTypes = ['equipment', 'leave', 'resources'];
    const requestType = params.type.toLowerCase();
    
    if (workflowTypes.includes(requestType)) {
        await db.Workflow.create({
            employeeId: params.employeeId,
            type: `Request: ${params.type}`,
            status: 'Pending',
            details: {
                requestId: request.id,
                requestType: params.type,
                requestDate: new Date(),
                description: params.description || 'New request'
            }
        });
    }
    
    return await getById(request.id);
}

async function update(id, params) {
    const request = await getById(id);

    // Handle updates for specific request types
    if (params.items && Array.isArray(params.items)) {
        // If we're updating items for equipment or resources
        if (request.type.toLowerCase() === 'equipment' || request.type.toLowerCase() === 'resources') {
            // Update the details in the request
            request.details = request.details || {};
            request.details.items = params.items;
        }
    }
    
    // If updating dates for leave requests
    if (request.type.toLowerCase() === 'leave' && params.date && Array.isArray(params.date)) {
        // Calculate days for each leave period
        const datesWithDays = params.date.map(period => {
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
        
        // Update the details in the request
        request.details = request.details || {};
        request.details.date = params.date;
        request.details.calculatedDays = datesWithDays;
    }
    
    // Handle other updates to the request entity
    if (params.status !== undefined) request.status = params.status;
    if (params.priority !== undefined) request.priority = params.priority;
    if (params.description !== undefined) request.description = params.description;
    if (params.approverId !== undefined) request.approverId = params.approverId;
    if (params.details !== undefined && params.items === undefined && params.date === undefined) {
        // Only update details directly if not already updating items or dates
        request.details = params.details;
    }
    
    request.updated = new Date();
    
    // Handle status changes and workflow updates
    if (params.status) {
        if (params.status === 'completed' && request.status !== 'completed') {
            request.completionDate = new Date();
            
            // Update associated workflow if it exists
            const workflow = await db.Workflow.findOne({
                where: {
                    employeeId: request.employeeId,
                    'details.requestId': request.id
                }
            });
            
            if (workflow) {
                workflow.status = 'Completed';
                workflow.updated = new Date();
                await workflow.save();
            }
        } else if (params.status === 'rejected' && request.status !== 'rejected') {
            // Update associated workflow if it exists
            const workflow = await db.Workflow.findOne({
                where: {
                    employeeId: request.employeeId,
                    'details.requestId': request.id
                }
            });
            
            if (workflow) {
                workflow.status = 'Cancelled';
                workflow.updated = new Date();
                await workflow.save();
            }
        }
    }
    
    await request.save();
    return await getById(id);
}

async function _delete(id) {
    const request = await getById(id);
    
    // Find and update associated workflow if it exists
    const workflow = await db.Workflow.findOne({
        where: {
            employeeId: request.employeeId,
            'details.requestId': request.id
        }
    });
    
    if (workflow) {
        workflow.status = 'Cancelled';
        workflow.updated = new Date();
        await workflow.save();
    }
    
    await request.destroy();
}