import {
    Transportation,
    TransportationApplication,
    TransportationService,
    AttendanceTransportation,
} from "../database/index.js";

async function createTransportationService(data) {
    try {
        return await TransportationService.create(data);
    } catch (error) {
        return {
            status: error.code || 500,
            message: error.keyPattern || "Internal server error",
        };
    }
}

async function getTransportationService(query, skip, limit, select, sort) {
    let result = {};
    try {
        const model = TransportationService;
        let queryBuilder = model
            .find(query || {})
            .select(select)
            .sort(sort);
        if (skip !== undefined) {
            queryBuilder = queryBuilder.skip(skip);
        }

        if (limit !== undefined) {
            queryBuilder = queryBuilder.limit(limit);
        }
        result = await queryBuilder;
        return result;
    } catch (error) {
        console.error(error);
    }
}

async function countTransportationService(query) {
    try {
        const count = await TransportationService.countDocuments(query);
        return count;
    } catch (error) {
        console.error("Error counting transportation:", error);
        throw error;
    }
}

async function updateTransportationService(id, updateData) {
    try {
        return await TransportationService.findByIdAndUpdate(
            {_id: id},
            updateData,
            {
                new: true,
                runValidators: true,
            }
        );
    } catch (error) {
        return {
            status: error.code || 500,
            message: error.keyPattern || "Internal server error",
        };
    }
}

async function GetTransport(id) {
    return await Transportation.findById({_id: id});
}

async function GetDriver(id) {
    try {
        const result = await TransportationService.findById({_id: id}).populate({
            path: "driverId",
            select: "firstName lastName phone",
        });

        return result;
    } catch (error) {
        throw new Error(`Error fetching driver: ${error.message}`);
    }
}

async function saveTransportation(data) {
    return await data.save();
}

async function findTransportationService(condition, select) {
    return await TransportationService.findById(condition).select(select);
}

async function findTransportation(condition, select) {
    return await Transportation.find(condition).select(select);
}

async function findOneAttendanceTransportation(condition, select) {
    return await AttendanceTransportation.findOne(condition).select(select);
}

async function findAndUpdateTransportation(transportationId, condition) {
    return await Transportation.findByIdAndUpdate(transportationId, condition);
}

async function findTransportationlication(condition, select) {
    return await TransportationApplication.find(condition).select(select);
}

async function createTransportation(data) {
    return await Transportation.create(data);
}

async function getTransportationServiceById(transportationId) {
    return await TransportationService.findById(transportationId);
}

async function findAttendanceTransportation(condition, select) {
    return await AttendanceTransportation.find(condition).select(select);
}

async function findAttendanceTransportationsAndUpdate(
    condition,
    update,
    select
) {
    return await AttendanceTransportation.findOneAndUpdate(condition, update, {
        new: true,
        fields: select,
    });
}

async function getTransportationDetailDriverById(transportationId) {
    return await TransportationService.findById(transportationId).populate({
        path: "driverId",
    });
}

export {
    createTransportationService,
    getTransportationService,
    countTransportationService,
    updateTransportationService,
    findTransportationService,
    findTransportationlication,
    findTransportation,
    findAndUpdateTransportation,
    createTransportation,
    findAttendanceTransportation,
    findOneAttendanceTransportation,
    saveTransportation,
    findAttendanceTransportationsAndUpdate,
    getTransportationServiceById,
    GetTransport,
    GetDriver,
    getTransportationDetailDriverById
};
