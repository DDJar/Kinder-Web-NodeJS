import mongoose from "mongoose";

export const initDataClass = [
    {
        "_id": new mongoose.Types.ObjectId("675583fda08faf99d85dc2e6"),
        "name": "Lớp Mầm",
        "teacherId": new mongoose.Types.ObjectId("6755835fe6f39cda34a300ae"),
        "totalSeats": 35,
        "startTime": new Date("2024-09-08T00:00:00.000Z"),
        "endTime": new Date("2025-06-08T00:00:00.000Z"),
        "tuition": 1000,
        "condition": 2,
        "availableSeats": 34,
        "room": new mongoose.Types.ObjectId("675583e8a08faf99d85dc2df"),
        "status": "ACTIVE",
        "createdAt": new Date("2024-09-08T11:33:17.027Z"),
        "updatedAt": new Date("2024-09-08T11:37:10.308Z"),
        "__v": 0
    }
];

export const initDataCurriculum = [
    {
        "_id": new mongoose.Types.ObjectId("675583c8a08faf99d85dc2db"),
        "name": "Mầm",
        "totalSeats": 35,
        "tuition": 1000,
        "condition": 2,
        "durationOfStudy": 9,
        "status": "ACTIVE",
        "createdAt": new Date("2024-09-08T11:32:24.108Z"),
        "updatedAt": new Date("2024-09-08T11:32:24.108Z"),
        "__v": 0
    }
];

export const initDataRoom = [
    {
        "_id": new mongoose.Types.ObjectId("675583e8a08faf99d85dc2df"),
        "name": "P101",
        "totalSeats": 50,
        "cameraUrl": "http://pendelcam.kip.uni-heidelberg.de/mjpg/video.mjpg",
        "status": "ACTIVE",
        "createdAt": new Date("2024-09-08T11:32:56.320Z"),
        "updatedAt": new Date("2024-09-08T11:32:56.320Z"),
        "__v": 0
    }
];
