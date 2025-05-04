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
        ]
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
}

async function create(params) {
    // Validate employee exists
    const employee = await db.Employee.findByPk(params.employeeId);
    if (!employee || !employee.isActive) throw 'Employee not found';

    // Create request
    const request = await db.Request.create(params);
    return await getById(request.id);
}

async function update(id, params) {
    const request = await getById(id);

    // Update request
    Object.assign(request, params, { updated: new Date() });
    
    // If status is changed to completed, set completion date
    if (params.status === 'completed' && request.status !== 'completed') {
        request.completionDate = new Date();
    }
    
    await request.save();
    return await getById(id);
}

async function _delete(id) {
    const request = await getById(id);
    await request.destroy();
}