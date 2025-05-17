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
    const requests = await db.Request.findAll({
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
        order: [['created', 'DESC']]
    });
    
    // Process all requests to remove purpose field from items
    for (const request of requests) {
        if (request.details && request.details.items && Array.isArray(request.details.items)) {
            request.details.items = request.details.items.map(item => {
                // Safely remove purpose field from each item if it exists
                if (item && typeof item === 'object') {
                    const newItem = { ...item };
                    delete newItem.purpose;
                    return newItem;
                }
                return item;
            });
        }
    }
    
    return requests;
}

async function getById(id) {
    try {
        console.log(`Looking for request with ID: ${id}, type: ${typeof id}`);
        
        // Make sure we're looking for a valid ID
        const requestId = parseInt(id);
        if (isNaN(requestId)) {
            console.error(`Invalid request ID format: ${id}`);
            throw 'Invalid request ID format';
        }
        
        // First try to find the basic request to debug
        const basicRequest = await db.Request.findByPk(requestId);
        if (!basicRequest) {
            console.error(`Request with ID ${requestId} not found in database`);
            throw 'Request not found';
        }
        
        console.log(`Found basic request: ${JSON.stringify({
            id: basicRequest.id,
            type: basicRequest.type,
            status: basicRequest.status
        })}`);
        
        // Now get the full request with all associations
        const request = await db.Request.findOne({
            where: { id: requestId },
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
    
        if (!request) {
            console.error(`Found basic request but couldn't load with associations, ID: ${requestId}`);
            throw 'Error loading request details';
        }
        
        // Ensure details is an object if it's null or undefined
        if (!request.details) {
            request.details = {};
        }
        
        // Handle existing items with purpose field in equipment/resources requests
        if (request.details && request.details.items && Array.isArray(request.details.items)) {
            // Safely remove purpose field from each item if it exists
            request.details.items = request.details.items.map(item => {
                // Create a new object without the purpose property
                // Handle case where item might be null or not an object
                if (item && typeof item === 'object') {
                    const newItem = { ...item };
                    delete newItem.purpose;
                    return newItem;
                }
                return item;
            });
        }
        
    return request;
    } catch (error) {
        console.error('Error getting request by ID:', error);
        console.error('Error stack:', error.stack);
        
        // Send a more detailed error for debugging
        if (typeof error === 'object') {
            throw new Error(`Request error: ${error.message || JSON.stringify(error)}`);
        } else {
            throw error;
        }
    }
}

async function getByEmployeeId(employeeId) {
    const requests = await db.Request.findAll({
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
    
    // Process all requests to remove purpose field from items
    for (const request of requests) {
        if (request.details && request.details.items && Array.isArray(request.details.items)) {
            request.details.items = request.details.items.map(item => {
                // Safely remove purpose field from each item if it exists
                if (item && typeof item === 'object') {
                    const newItem = { ...item };
                    delete newItem.purpose;
                    return newItem;
                }
                return item;
            });
        }
    }
    
    return requests;
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
    try {
    const request = await getById(id);

    // Handle updates for specific request types
    if (params.items && Array.isArray(params.items)) {
        // If we're updating items for equipment or resources
            if (request.type && request.type.toLowerCase && 
                (request.type.toLowerCase() === 'equipment' || request.type.toLowerCase() === 'resources')) {
            // Update the details in the request
            request.details = request.details || {};
                
                // Make sure any purpose fields are removed from items
                request.details.items = params.items.map(item => {
                    if (item && typeof item === 'object') {
                        const newItem = { ...item };
                        delete newItem.purpose;
                        return newItem;
                    }
                    return item;
                });
        }
    }
    
    // If updating dates for leave requests
    if (request.type && request.type.toLowerCase && 
        request.type.toLowerCase() === 'leave' && params.items && Array.isArray(params.items)) {
        // Update the details in the request
        request.details = request.details || {};
        request.details.items = params.items.map(item => {
            if (item && typeof item === 'object') {
                const newItem = { ...item };
                delete newItem.purpose;
                return newItem;
            }
            return item;
        });
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
    } catch (error) {
        console.error('Error in update function:', error);
        throw error;
    }
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