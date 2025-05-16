const db = require('../_helpers/db');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    // Return all departments, including inactive ones
    return await db.Department.findAll();
}

async function getById(id) {
    const department = await db.Department.findByPk(id);
    if (!department) throw 'Department not found';
    return department;
}

async function create(params) {
    console.log('Creating department with params in service:', params);
    
    try {
        // Validate
        if (await db.Department.findOne({ where: { name: params.name, isActive: true } })) {
            throw new Error(`Department with name "${params.name}" already exists`);
        }

        // Check if accountId exists
        if (!params.accountId) {
            throw new Error('Account ID is required');
        }

        // Check if the account exists
        const account = await db.Account.findByPk(params.accountId);
        if (!account) {
            throw new Error(`Account with ID ${params.accountId} not found`);
        }

        console.log('Creating department with validated params:', params);
        // Create department
        const department = await db.Department.create(params);
        console.log('Department created successfully:', department);
        
        return department;
    } catch (error) {
        console.error('Error in department service create:', error.message);
        throw error;
    }
}

async function update(id, params) {
    console.log('Updating department with ID:', id, 'and params:', params);
    
    try {
        const department = await getById(id);
        console.log('Found department to update:', department);

        // Validate
        if (params.name && department.name !== params.name && 
            await db.Department.findOne({ where: { name: params.name, isActive: true } })) {
            throw new Error(`Department with name "${params.name}" already exists`);
        }
        
        // Check if accountId exists
        if (params.accountId) {
            // Check if the account exists
            const account = await db.Account.findByPk(params.accountId);
            if (!account) {
                throw new Error(`Account with ID ${params.accountId} not found`);
            }
        }
        
        // Ensure isActive is properly handled
        if (params.isActive !== undefined) {
            console.log('Updating isActive to:', params.isActive);
        }
        
        console.log('Updating department with validated params:', params);
        
        // Update department
        Object.assign(department, params, { updated: new Date() });
        await department.save();
        
        console.log('Department updated successfully:', department);
        
        return department;
    } catch (error) {
        console.error('Error in department service update:', error.message);
        throw error;
    }
}

async function _delete(id) {
    try {
        const department = await getById(id);
        
        if (!department) {
            throw new Error('Department not found');
        }
        
        console.log(`Performing hard delete on department with ID: ${id}`);
        
        // Perform hard delete
        await department.destroy();
        
        console.log('Department deleted successfully');
        
        return { message: 'Department deleted successfully' };
    } catch (error) {
        console.error('Error in department service delete:', error.message);
        throw error;
    }
}