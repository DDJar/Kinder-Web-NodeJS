import mongoose from "mongoose";

export const initDataAdmissionDocs = [
    {
        "_id": new mongoose.Types.ObjectId("675584a4e6f39cda34a300f3"),
        "title": "HOUSEHOLD_BOOK",
        "description": "",
        "img": "https://kinderstorageblob.blob.core.windows.net/kinderblobby/khai%20sinh.jpeg?sv=2022-11-02&ss=b&srt=sco&sp=rwlactfx&se=2025-10-24T21:23:28Z&st=2024-10-24T13:23:28Z&spr=https,http&sig=oCm7MdTKONNeyvNRA2ivuwl%2Fi%2FmmKdh3ki0TikY79Nw%3D",
        "status": "ACTIVE",
        "createdAt": new Date("2024-11-08T11:36:04.942Z"),
        "updatedAt": new Date("2024-11-08T11:36:04.942Z"),
        "__v": 0
    },
    {
        "_id": new mongoose.Types.ObjectId("675584a4e6f39cda34a300f5"),
        "title": "HEALTH_MONITORING",
        "description": "",
        "img": null,
        "status": "ACTIVE",
        "createdAt": new Date("2024-11-08T11:36:04.947Z"),
        "updatedAt": new Date("2024-11-08T11:36:04.947Z"),
        "__v": 0
    },
    {
        "_id": new mongoose.Types.ObjectId("675584a4e6f39cda34a300f7"),
        "title": "HEALTH_CHECK",
        "description": "",
        "img": null,
        "status": "ACTIVE",
        "createdAt": new Date("2024-11-08T11:36:04.950Z"),
        "updatedAt": new Date("2024-11-08T11:36:04.950Z"),
        "__v": 0
    },
    {
        "_id": new mongoose.Types.ObjectId("675584a4e6f39cda34a300f9"),
        "title": "HEALTH_INSURANCE",
        "description": "",
        "img": null,
        "status": "ACTIVE",
        "createdAt": new Date("2024-11-08T11:36:04.951Z"),
        "updatedAt": new Date("2024-11-08T11:36:04.951Z"),
        "__v": 0
    },
    {
        "_id": new mongoose.Types.ObjectId("675584a4e6f39cda34a300fe"),
        "title": "BIRTH_CER",
        "description": "",
        "img": "https://kinderstorageblob.blob.core.windows.net/kinderblobby/khai%20sinh.jpeg?sv=2022-11-02&ss=b&srt=sco&sp=rwlactfx&se=2025-10-24T21:23:28Z&st=2024-10-24T13:23:28Z&spr=https,http&sig=oCm7MdTKONNeyvNRA2ivuwl%2Fi%2FmmKdh3ki0TikY79Nw%3D",
        "status": "ACTIVE",
        "createdAt": new Date("2024-11-08T11:36:04.956Z"),
        "updatedAt": new Date("2024-11-08T11:36:04.956Z"),
        "__v": 0
    },
    {
        "_id": new mongoose.Types.ObjectId("675584a4e6f39cda34a30101"),
        "title": "PSYCHOLOGICAL",
        "description": "",
        "img": null,
        "status": "ACTIVE",
        "createdAt": new Date("2024-11-08T11:36:04.961Z"),
        "updatedAt": new Date("2024-11-08T11:36:04.961Z"),
        "__v": 0
    }
]

export const initDataAdmisionApplication = [
    {
        "_id": new mongoose.Types.ObjectId("675584a4e6f39cda34a30105"),
        "userId": new mongoose.Types.ObjectId("67558360e6f39cda34a300bb"),
        "childId": new mongoose.Types.ObjectId("67558477e6f39cda34a300e2"),
        "startTime": 2024,
        "noteByStaff": "",
        "status": "ACCEPT",
        "createdAt": new Date("2024-11-08T11:36:04.970Z"),
        "updatedAt": new Date("2024-11-08T11:36:55.343Z"),
        "__v": 0
    }
]

export const initDataAttendence = [
    {
        "_id": new mongoose.Types.ObjectId("675585c0e6f39cda34a3019a"),
        "teacherId": new mongoose.Types.ObjectId("6755835fe6f39cda34a300ae"),
        "classId": new mongoose.Types.ObjectId("675583fda08faf99d85dc2e6"),
        "childId": new mongoose.Types.ObjectId("67558477e6f39cda34a300e2"),
        "receiver": "USER",
        "receiverUrl": "https://kinderstorageblob.blob.core.windows.net/kinderblobby/captured-image-1733658098808-453.png?sv=2022-11-02&ss=b&srt=sco&sp=rwlactfx&se=2025-10-24T21:23:28Z&st=2024-10-24T13:23:28Z&spr=https,http&sig=oCm7MdTKONNeyvNRA2ivuwl%2Fi%2FmmKdh3ki0TikY79Nw%3D",
        "attendDay": 8,
        "attendMonth": 11,
        "attendYear": 2024,
        "isCheckIn": true,
        "createdCheckInAt": new Date("2024-11-08T11:40:48.826Z"),
        "isCheckOut": true,
        "createdCheckOutAt": new Date("2024-11-08T11:41:43.887Z"),
        "createdAt": new Date("2024-11-08T11:40:48.843Z"),
        "updatedAt": new Date("2024-11-08T11:41:43.894Z"),
        "__v": 0
    },
    {
        "_id": new mongoose.Types.ObjectId("675595c07dd11e1e5ac6d3ed"),
        "teacherId": new mongoose.Types.ObjectId("6755835fe6f39cda34a300ae"),
        "classId": new mongoose.Types.ObjectId("675583fda08faf99d85dc2e6"),
        "childId": new mongoose.Types.ObjectId("67558477e6f39cda34a300e2"),
        "receiver": "USER",
        "receiverUrl": "https://kinderstorageblob.blob.core.windows.net/kinderblobby/captured-image-1733658098808-453.png?sv=2022-11-02&ss=b&srt=sco&sp=rwlactfx&se=2025-10-24T21:23:28Z&st=2024-10-24T13:23:28Z&spr=https,http&sig=oCm7MdTKONNeyvNRA2ivuwl%2Fi%2FmmKdh3ki0TikY79Nw%3D",
        "attendDay": 9,
        "attendMonth": 11,
        "attendYear": 2024,
        "isCheckIn": true,
        "createdCheckInAt": new Date("2024-11-09T11:40:48.826Z"),
        "isCheckOut": true,
        "createdCheckOutAt": new Date("2024-11-09T11:41:43.887Z"),
        "createdAt": new Date("2024-11-09T11:40:48.843Z"),
        "updatedAt": new Date("2024-11-08T11:41:43.894Z"),
        "__v": 0
    },
    {
        "_id": new mongoose.Types.ObjectId("675596017dd11e1e5ac6d3ee"),
        "teacherId": new mongoose.Types.ObjectId("6755835fe6f39cda34a300ae"),
        "classId": new mongoose.Types.ObjectId("675583fda08faf99d85dc2e6"),
        "childId": new mongoose.Types.ObjectId("67558477e6f39cda34a300e2"),
        "receiver": "USER",
        "receiverUrl": "https://kinderstorageblob.blob.core.windows.net/kinderblobby/captured-image-1733658098808-453.png?sv=2022-11-02&ss=b&srt=sco&sp=rwlactfx&se=2025-10-24T21:23:28Z&st=2024-10-24T13:23:28Z&spr=https,http&sig=oCm7MdTKONNeyvNRA2ivuwl%2Fi%2FmmKdh3ki0TikY79Nw%3D",
        "attendDay": 11,
        "attendMonth": 11,
        "attendYear": 2024,
        "isCheckIn": true,
        "createdCheckInAt": new Date("2024-11-11T11:40:48.826Z"),
        "isCheckOut": true,
        "createdCheckOutAt": new Date("2024-11-11T11:41:43.887Z"),
        "createdAt": new Date("2024-11-11T11:40:48.843Z"),
        "updatedAt": new Date("2024-11-11T11:41:43.894Z"),
        "__v": 0
    },
    {
        "_id": new mongoose.Types.ObjectId("675596877dd11e1e5ac6d3ef"),
        "teacherId": new mongoose.Types.ObjectId("6755835fe6f39cda34a300ae"),
        "classId": new mongoose.Types.ObjectId("675583fda08faf99d85dc2e6"),
        "childId": new mongoose.Types.ObjectId("67558477e6f39cda34a300e2"),
        "receiver": "USER",
        "receiverUrl": "https://kinderstorageblob.blob.core.windows.net/kinderblobby/captured-image-1733658098808-453.png?sv=2022-11-02&ss=b&srt=sco&sp=rwlactfx&se=2025-10-24T21:23:28Z&st=2024-10-24T13:23:28Z&spr=https,http&sig=oCm7MdTKONNeyvNRA2ivuwl%2Fi%2FmmKdh3ki0TikY79Nw%3D",
        "attendDay": 20,
        "attendMonth": 11,
        "attendYear": 2024,
        "isCheckIn": true,
        "createdCheckInAt": new Date("2024-11-20T11:40:48.826Z"),
        "isCheckOut": true,
        "createdCheckOutAt": new Date("2024-11-20T11:41:43.887Z"),
        "createdAt": new Date("2024-11-20T11:40:48.843Z"),
        "updatedAt": new Date("2024-11-28T11:41:43.894Z"),
        "__v": 0
    },
    {
        "_id": new mongoose.Types.ObjectId("6755970338660d5b7e0b0252"),
        "teacherId": new mongoose.Types.ObjectId("6755835fe6f39cda34a300ae"),
        "classId": new mongoose.Types.ObjectId("675583fda08faf99d85dc2e6"),
        "childId": new mongoose.Types.ObjectId("67558477e6f39cda34a300e2"),
        "receiver": "USER",
        "receiverUrl": "https://kinderstorageblob.blob.core.windows.net/kinderblobby/captured-image-1733662475124-690.png?sv=2022-11-02&ss=b&srt=sco&sp=rwlactfx&se=2025-10-24T21:23:28Z&st=2024-10-24T13:23:28Z&spr=https,http&sig=oCm7MdTKONNeyvNRA2ivuwl%2Fi%2FmmKdh3ki0TikY79Nw%3D",
        "attendDay": 8,
        "attendMonth": 12,
        "attendYear": 2024,
        "isCheckIn": true,
        "createdCheckInAt": new Date("2024-12-08T12:54:27.760Z"),
        "isCheckOut": true,
        "createdCheckOutAt": new Date("2024-12-08T12:54:39.802Z"),
        "createdAt": new Date("2024-12-08T12:54:27.767Z"),
        "updatedAt": new Date("2024-12-08T12:54:39.807Z"),
        "__v": 0
    }
];

export const initDataChild = [
    {
        "_id": new mongoose.Types.ObjectId("67558477e6f39cda34a300e2"),
        "firstName": "Bùi Hoàng",
        "lastName": "Thiên Ân",
        "dateOfBirth": new Date("2020-12-25T00:00:00.000Z"),
        "favourite": "",
        "parentNote": "",
        "avatar": "https://kinderstorageblob.blob.core.windows.net/kinderblobby/canvas.png?sv=2022-11-02&ss=b&srt=sco&sp=rwlactfx&se=2025-10-24T21:23:28Z&st=2024-10-24T13:23:28Z&spr=https,http&sig=oCm7MdTKONNeyvNRA2ivuwl%2Fi%2FmmKdh3ki0TikY79Nw%3D",
        "birthCertificate": "",
        "class": [
            new mongoose.Types.ObjectId("675584d7e6f39cda34a30119")
        ],
        "skill": [],
        "eatFees": [
            new mongoose.Types.ObjectId("675584d7e6f39cda34a3011b")
        ],
        "transportation": [
            new mongoose.Types.ObjectId("67558518e6f39cda34a30147")
        ],
        "docs": [
            new mongoose.Types.ObjectId("675584a4e6f39cda34a300f3"),
            new mongoose.Types.ObjectId("675584a4e6f39cda34a300f5"),
            new mongoose.Types.ObjectId("675584a4e6f39cda34a300f7"),
            new mongoose.Types.ObjectId("675584a4e6f39cda34a300f9"),
            new mongoose.Types.ObjectId("675584a4e6f39cda34a300fe"),
            new mongoose.Types.ObjectId("675584a4e6f39cda34a30101")
        ],
        "__v": 1
    }
];

export const initDataClass = [
    {
        "_id": new mongoose.Types.ObjectId("675584d7e6f39cda34a30119"),
        "status": "ACTIVE",
        "name": "Lớp Mầm",
        "payment": "NO",
        "payments": [
            new mongoose.Types.ObjectId("67558559e6f39cda34a3017b")
        ],
        "createdAt": new Date("2024-11-08T11:36:55.358Z"),
        "updatedAt": new Date("2024-11-08T11:39:05.840Z"),
        "__v": 0,
        "classId": new mongoose.Types.ObjectId("675583fda08faf99d85dc2e6")
    }
];

export const initDataEatFees = [
    {
        "_id": new mongoose.Types.ObjectId("675584d7e6f39cda34a3011b"),
        "status": "ACTIVE",
        "payments": [
            new mongoose.Types.ObjectId("67558559e6f39cda34a3017e")
        ],
        "createdAt": new Date("2024-11-08T11:36:55.361Z"),
        "updatedAt": new Date("2024-11-08T11:39:05.842Z"),
        "__v": 0
    }
];

export const initDatahealthLogs = [
    {
        "_id": new mongoose.Types.ObjectId("6755975138660d5b7e0b0272"),
        "height": 90,
        "weight": 15,
        "note": "Cháu thích hát",
        "childId": new mongoose.Types.ObjectId("67558477e6f39cda34a300e2"),
        "noteBy": new mongoose.Types.ObjectId("6755835fe6f39cda34a300ae"),
        "status": "ACTIVE",
        "createdAt": new Date("2024-11-08T12:55:45.841Z"),
        "updatedAt": new Date("2024-11-08T12:55:45.841Z"),
        "__v": 0
    },
    {
        "_id": new mongoose.Types.ObjectId("675597af7dd11e1e5ac6d3f1"),
        "height": 91,
        "weight": 16,
        "note": "Cháu thích hát",
        "childId": new mongoose.Types.ObjectId("67558477e6f39cda34a300e2"),
        "noteBy": new mongoose.Types.ObjectId("6755835fe6f39cda34a300ae"),
        "status": "ACTIVE",
        "createdAt": new Date("2024-11-15T12:55:45.841Z"),
        "updatedAt": new Date("2024-11-15T12:55:45.841Z"),
        "__v": 0
    },
    {
        "_id": new mongoose.Types.ObjectId("675598107dd11e1e5ac6d3f2"),
        "height": 95,
        "weight": 16,
        "note": "Cháu thích hát",
        "childId": new mongoose.Types.ObjectId("67558477e6f39cda34a300e2"),
        "noteBy": new mongoose.Types.ObjectId("6755835fe6f39cda34a300ae"),
        "status": "ACTIVE",
        "createdAt": new Date("2024-11-22T12:55:45.841Z"),
        "updatedAt": new Date("2024-11-22T12:55:45.841Z"),
        "__v": 0
    },
    {
        "_id": new mongoose.Types.ObjectId("6755982f7dd11e1e5ac6d3f3"),
        "height": 100,
        "weight": 18,
        "note": "Cháu thích hát",
        "childId": new mongoose.Types.ObjectId("67558477e6f39cda34a300e2"),
        "noteBy": new mongoose.Types.ObjectId("6755835fe6f39cda34a300ae"),
        "status": "ACTIVE",
        "createdAt": new Date("2024-11-29T12:55:45.841Z"),
        "updatedAt": new Date("2024-11-29T12:55:45.841Z"),
        "__v": 0
    },
    {
        "_id": new mongoose.Types.ObjectId("675598487dd11e1e5ac6d3f4"),
        "height": 105,
        "weight": 19,
        "note": "Cháu thích hát",
        "childId": new mongoose.Types.ObjectId("67558477e6f39cda34a300e2"),
        "noteBy": new mongoose.Types.ObjectId("6755835fe6f39cda34a300ae"),
        "status": "ACTIVE",
        "createdAt": new Date("2024-12-06T12:55:45.841Z"),
        "updatedAt": new Date("2024-12-06T12:55:45.841Z"),
        "__v": 0
    },
    {
        "_id": new mongoose.Types.ObjectId("6755986b7dd11e1e5ac6d3f5"),
        "height": 110,
        "weight": 20,
        "note": "Cháu thích hát",
        "childId": new mongoose.Types.ObjectId("67558477e6f39cda34a300e2"),
        "noteBy": new mongoose.Types.ObjectId("6755835fe6f39cda34a300ae"),
        "status": "ACTIVE",
        "createdAt": new Date("2024-12-14T12:55:45.841Z"),
        "updatedAt": new Date("2024-12-14T12:55:45.841Z"),
        "__v": 0
    }
];

export const initDataPayment = [
    {
        "_id": new mongoose.Types.ObjectId("67558559e6f39cda34a3017b"),
        "amount": 1002820,
        "month": 11,
        "year": 2024,
        "isPaid": true,
        "payMethod": "ONLINE",
        "transactionId": "",
        "createdAt": new Date("2024-11-08T11:39:05.838Z"),
        "updatedAt": new Date("2024-11-08T11:39:05.838Z"),
        "__v": 0
    },
    {
        "_id": new mongoose.Types.ObjectId("67558559e6f39cda34a3017e"),
        "amount": 1002820,
        "month": 11,
        "year": 2024,
        "isPaid": true,
        "payMethod": "ONLINE",
        "transactionId": "",
        "createdAt": new Date("2024-11-08T11:39:05.841Z"),
        "updatedAt": new Date("2024-11-08T11:39:05.841Z"),
        "__v": 0
    },
    {
        "_id": new mongoose.Types.ObjectId("67558559e6f39cda34a30181"),
        "amount": 1002820,
        "month": 11,
        "year": 2024,
        "isPaid": true,
        "payMethod": "ONLINE",
        "transactionId": "",
        "createdAt": new Date("2024-11-08T11:39:05.843Z"),
        "updatedAt": new Date("2024-11-08T11:39:05.843Z"),
        "__v": 0
    }
];

export const initDataTransportationApplication = [
    {
        "_id": new mongoose.Types.ObjectId("6755850be6f39cda34a3013d"),
        "userId": new mongoose.Types.ObjectId("67558360e6f39cda34a300bb"),
        "childId": new mongoose.Types.ObjectId("67558477e6f39cda34a300e2"),
        "startTime": new Date("2024-11-08T00:00:00.000Z"),
        "noteByStaff": "",
        "status": "ACCEPT",
        "address": "nhà ông Vĩnh, Ngối Cáy, Mường Ảng, Điện Biên",
        "createdAt": new Date("2024-11-08T11:37:47.821Z"),
        "updatedAt": new Date("2024-11-08T11:38:00.892Z"),
        "__v": 0
    }
];

export const initDataTransportation = [
    {
        "_id": new mongoose.Types.ObjectId("67558518e6f39cda34a30147"),
        "status": "ACTIVE",
        "payments": [
            new mongoose.Types.ObjectId("67558559e6f39cda34a30181")
        ],
        "createdAt": new Date("2024-11-08T11:38:00.900Z"),
        "updatedAt": new Date("2024-11-08T11:39:05.844Z"),
        "__v": 0,
        "transportationId": new mongoose.Types.ObjectId("6755842ee6f39cda34a300d5")
    }
];

export const initDataTransportationService = [
    {
        "_id": new mongoose.Types.ObjectId("6755842ee6f39cda34a300d5"),
        "name": "Bus a",
        "driverId": new mongoose.Types.ObjectId("6755835fe6f39cda34a300b1"),
        "totalSeats": 16,
        "availableSeats": 15,
        "tuition": 1000000,
        "busNumber": "92y1-12345",
        "status": "ACTIVE",
        "createdAt": new Date("2024-09-08T11:34:06.629Z"),
        "updatedAt": new Date("2024-09-08T11:38:43.040Z"),
        "__v": 0
    }
];

export const initDataUsers = [
    {
        "_id": new mongoose.Types.ObjectId("6755835ee6f39cda34a300a5"),
        "firstName": "Đinh Sỹ",
        "lastName": "Quốc Việt",
        "username": "vietdsqde160184@fpt.edu.vn",
        "email": "vietdsqde160184@fpt.edu.vn",
        "password": "$2a$12$11rwPdQzyfs5sTGBvfxfUOxyLY0N5z3SuLuTyRyB0jTAWtJ3.mUhm",
        "avatar": "",
        "address": "",
        "role": "USER",
        "status": "ACTIVE",
        "children": [],
        "createdAt": new Date("2024-10-08T11:30:38.108Z"),
        "updatedAt": new Date("2024-10-08T11:30:38.108Z"),
        "__v": 0
    },
    {
        "_id": new mongoose.Types.ObjectId("6755835ee6f39cda34a300a8"),
        "firstName": "John",
        "lastName": "Doe",
        "username": "blocker@gmail.com",
        "email": "blocker@gmail.com",
        "password": "$2a$12$f9ZCWkvEYrVXtsGQeB4/m.TKTZbjnncGaWc32NX8Dlr4EAFD0WIea",
        "avatar": "",
        "address": "",
        "role": "USER",
        "status": "ACTIVE",
        "children": [],
        "createdAt": new Date("2024-10-08T11:30:38.432Z"),
        "updatedAt": new Date("2024-10-08T11:30:38.432Z"),
        "__v": 0
    },
    {
        "_id": new mongoose.Types.ObjectId("6755835ee6f39cda34a300ab"),
        "firstName": "Nguyễn",
        "lastName": "Tuyết Nhi",
        "username": "teacher1@gmail.com",
        "email": "teacher1@gmail.com",
        "password": "$2a$12$VTWalrDG12CcqL0RvNLO1eQj7r57pjBalSWh6cqdw8.le0WOKUJzq",
        "avatar": "",
        "address": "",
        "role": "TEACHER",
        "status": "ACTIVE",
        "children": [],
        "createdAt": new Date("2024-10-08T11:30:38.702Z"),
        "updatedAt": new Date("2024-10-08T11:30:38.702Z"),
        "__v": 0
    },
    {
        "_id": new mongoose.Types.ObjectId("6755835fe6f39cda34a300ae"),
        "firstName": "Đinh Thị",
        "lastName": "Cát Tường",
        "username": "teacher2@gmail.com",
        "email": "teacher2@gmail.com",
        "password": "$2a$12$cwJNtCYo4SnoDFhuJ/YrK.6DA9Va7oReAq6ydB8f6H2bOgBNfhfkW",
        "avatar": "",
        "address": "",
        "role": "TEACHER",
        "status": "ACTIVE",
        "children": [],
        "createdAt": new Date("2024-10-08T11:30:39.083Z"),
        "updatedAt": new Date("2024-10-08T11:30:39.083Z"),
        "__v": 0
    },
    {
        "_id": new mongoose.Types.ObjectId("6755835fe6f39cda34a300b1"),
        "firstName": "Bùi",
        "lastName": "Tuấn Dũng",
        "username": "dungbtde160632@fpt.edu.vn",
        "email": "dungbtde160632@fpt.edu.vn",
        "password": "$2a$12$YBgxo3k3xP.46WtcnzJn5.HHSlqGC4HHamcrRnapZlEn2TOmDI/RC",
        "avatar": "",
        "address": "",
        "role": "DRIVER",
        "status": "ACTIVE",
        "children": [],
        "createdAt": new Date("2024-10-08T11:30:39.362Z"),
        "updatedAt": new Date("2024-10-08T11:30:39.362Z"),
        "__v": 0
    },
    {
        "_id": new mongoose.Types.ObjectId("6755835fe6f39cda34a300b4"),
        "firstName": "Nguyễn",
        "lastName": "Quỳnh",
        "username": "staff@gmail.com",
        "email": "staff@gmail.com",
        "password": "$2a$12$fpFW.R/Q3vlQ3MMAMQNV4OkjDKACpXljO6dPaW8zJf/5frRvDF04y",
        "avatar": "",
        "address": "",
        "role": "STAFF",
        "status": "ACTIVE",
        "children": [],
        "createdAt": new Date("2024-10-08T11:30:39.634Z"),
        "updatedAt": new Date("2024-10-08T11:30:39.634Z"),
        "__v": 0
    },
    {
        "_id": new mongoose.Types.ObjectId("6755835fe6f39cda34a300b8"),
        "firstName": "Bùi",
        "lastName": "Hoàng",
        "username": "accountant@gmail.com",
        "email": "accountant@gmail.com",
        "password": "$2a$12$qifOFSnBhFfEWZCPYz4Kke6fN.hPJMwNLd.9Ov9joe6MSYOTFvqy6",
        "avatar": "",
        "address": "",
        "role": "ACCOUNTANT",
        "status": "ACTIVE",
        "children": [],
        "createdAt": new Date("2024-10-08T11:30:39.888Z"),
        "updatedAt": new Date("2024-10-08T11:30:39.888Z"),
        "__v": 0
    },
    {
        "_id": new mongoose.Types.ObjectId("67558360e6f39cda34a300bb"),
        "firstName": "Hoàng",
        "lastName": "Ý",
        "username": "hoangy761exe@gmail.com",
        "email": "hoangy761exe@gmail.com",
        "password": "$2a$12$GnGCTBfNhtr7BfZtyV9JBOgYD9pevL1XqRLtelums.sFnyznZRyW2",
        "avatar": "",
        "address": "nhà ông Vĩnh, Ngối Cáy, Mường Ảng, Điện Biên",
        "role": "USER",
        "status": "ACTIVE",
        "children": [
            new mongoose.Types.ObjectId("67558477e6f39cda34a300e2")
        ],
        "createdAt": new Date("2024-10-08T11:30:40.139Z"),
        "updatedAt": new Date("2024-10-08T11:35:19.468Z"),
        "__v": 0,
        "phone": "0981456014"
    }
];
