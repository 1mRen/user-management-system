const db = require('../_helpers/db');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    return await db.Department.findAll({
        where: { isActive: true },
        include: [
            {
                model: db.Employee,
                as: 'Manager',
                attributes: ['id', 'firstName', 'lastName', 'position']
            }
        ]
    });
}

async function getById(id) {
    const department = await db.Department.findByPk(id, {
        include: [
            {
                model: db.Employee,
                as: 'Manager',
                attributes: ['id', 'firstName', 'lastName', 'position']
            }
        ]
    });
    if (!department || !department.isActive) throw 'Department not found';
    return department;
}

async function create(params) {
    // Validate
    if (await db.Department.findOne({ where: { name: params.name, isActive: true } })) {
        throw `Department with name "${params.name}" already exists`;
    }

    // Create department
    const department = await db.Department.create(params);
    
    // Create workflow for department creation if manager is assigned
    if (params.managerId) {
        await db.Workflow.create({
            employeeId: params.managerId,
            type: 'Department Creation',
            status: 'Completed',
            details: {
                departmentId: department.id,
                departmentName: params.name,
                action: 'Created department',
                creationDate: new Date()
            }
        });
    }
    
    return department;
}

async function update(id, params) {
    const department = await getById(id);

    // Validate
    if (params.name && department.name !== params.name && 
        await db.Department.findOne({ where: { name: params.name, isActive: true } })) {
        throw `Department with name "${params.name}" already exists`;
    }
    
    // Store old manager for workflow if changing
    const oldManagerId = department.managerId;
    
    // Update department
    Object.assign(department, params, { updated: new Date() });
    await department.save();
    
    // Create workflow for manager change if applicable
    if (params.managerId && oldManagerId !== params.managerId) {
        // Workflow for the new manager
        await db.Workflow.create({
            employeeId: params.managerId,
            type: 'Department Management',
            status: 'Completed',
            details: {
                departmentId: department.id,
                departmentName: department.name,
                action: 'Assigned as department manager',
                assignmentDate: new Date()
            }
        });
        
        // Workflow for the old manager if they exist
        if (oldManagerId) {
            await db.Workflow.create({
                employeeId: oldManagerId,
                type: 'Department Management',
                status: 'Completed',
                details: {
                    departmentId: department.id,
                    departmentName: department.name,
                    action: 'Removed as department manager',
                    removalDate: new Date()
                }
            });
        }
    }

    return department;
}

async function _delete(id) {
    const department = await getById(id);
    
    // Soft delete by setting isActive to false
    Object.assign(department, { isActive: false, updated: new Date() });
    await department.save();
    
    // Create workflow for department deactivation if manager exists
    if (department.managerId) {
        await db.Workflow.create({
            employeeId: department.managerId,
            type: 'Department Deactivation',
            status: 'Completed',
            details: {
                departmentId: department.id,
                departmentName: department.name,
                action: 'Deactivated department',
                deactivationDate: new Date()
            }
        });
    }
}