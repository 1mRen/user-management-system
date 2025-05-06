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
        where: { isActive: true }
    });
}

async function getById(id) {
    const department = await db.Department.findByPk(id);
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
    
    return department;
}

async function update(id, params) {
    const department = await getById(id);

    // Validate
    if (params.name && department.name !== params.name && 
        await db.Department.findOne({ where: { name: params.name, isActive: true } })) {
        throw `Department with name "${params.name}" already exists`;
    }
    
    // Update department
    Object.assign(department, params, { updated: new Date() });
    await department.save();

    return department;
}

async function _delete(id) {
    const department = await getById(id);
    
    // Soft delete by setting isActive to false
    Object.assign(department, { isActive: false, updated: new Date() });
    await department.save();
}