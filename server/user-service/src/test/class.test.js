// import { use, expect } from "chai";
// import chaiHttp from "chai-http";
// import app from "../server.js";
// import config from "../config/config.js";
// import jwt from "jsonwebtoken";

// const jwtSecret = config.JWT_SECRET;
// const chai = use(chaiHttp);

// describe("User API", () => {
//   let admintoken = {};
//   let teachertoken = {};
//   let user = {};
//   let token = {};
//   let teacher = {};
//   let blocktoken = {};
//   let blocker = {};
//   let staff = {};
//   let stafftoken = {};

//   describe("POST /login", () => {
//     // it("Login to get token admin", (done) => {
//     //   chai.request
//     //     .execute(app)
//     //     .post("/login")
//     //     .send({ username: "test@gmail.com", password: "1234567890" })
//     //     .end((err, res) => {
//     //       try {
//     //         if (err) {
//     //           throw err;
//     //         }
//     //         expect(res.body).to.have.property("status", 200);
//     //         expect(res.body).to.have.property("message", "Login successfully!");
//     //         expect(res.body).to.have.property("token");
//     //         admintoken = res.body.token;
//     //         const decoded = jwt.verify(admintoken, jwtSecret);
//     //         user = {
//     //           _id: decoded._id,
//     //           role: decoded.role,
//     //           firstName: decoded.firstName,
//     //           lastName: decoded.lastName,
//     //           password: "",
//     //         };

//     //         done();
//     //       } catch (error) {
//     //         done(error);
//     //       }
//     //     });
//     // });

// it("Login to get token USER", (done) => {
//   chai.request
//     .execute(app)
//     .post("/login")
//     .send({ username: "user@gmail.com", password: "1234567890" })
//     .end((err, res) => {
//       try {
//         if (err) {
//           throw err;
//         }
//         expect(res.body).to.have.property("status", 200);
//         expect(res.body).to.have.property("message", "Login successfully!");
//         expect(res.body).to.have.property("token");
//         token = res.body.token;
//         const decoded = jwt.verify(token, jwtSecret);
//         user = {
//           _id: decoded._id,
//           role: decoded.role,
//           firstName: decoded.firstName,
//           lastName: decoded.lastName,
//           password: "",
//         };

//         done();
//       } catch (error) {
//         done(error);
//       }
//     });
// });

// it("Login to get token TEACHER", (done) => {
//   chai.request
//     .execute(app)
//     .post("/login")
//     .send({ username: "teacher@gmail.com", password: "1234567890" })
//     .end((err, res) => {
//       try {
//         if (err) {
//           throw err;
//         }
//         expect(res.body).to.have.property("status", 200);
//         expect(res.body).to.have.property("message", "Login successfully!");
//         expect(res.body).to.have.property("token");
//         teachertoken = res.body.token;
//         const decoded = jwt.verify(teachertoken, jwtSecret);
//         teacher = {
//           _id: decoded._id,
//           role: decoded.role,
//           firstName: decoded.firstName,
//           lastName: decoded.lastName,
//           password: "",
//         };

//         done();
//       } catch (error) {
//         done(error);
//       }
//     });
// });

//     it("Login to get token STAFF", (done) => {
//       chai.request
//         .execute(app)
//         .post("/login")
//         .send({ username: "test3@gmail.com", password: "1234567890" })
//         .end((err, res) => {
//           try {
//             if (err) {
//               throw err;
//             }
//             expect(res.body).to.have.property("status", 200);
//             expect(res.body).to.have.property("message", "Login successfully!");
//             expect(res.body).to.have.property("token");
//             stafftoken = res.body.token;
//             const decoded = jwt.verify(stafftoken, jwtSecret);
//             staff = {
//               _id: decoded._id,
//               role: decoded.role,
//               firstName: decoded.firstName,
//               lastName: decoded.lastName,
//               password: "",
//             };

//             done();
//           } catch (error) {
//             done(error);
//           }
//         });
//     });
//   });

//   //   describe("POST /Arrange class", () => {
//   //     // it("UTCID01: should return a users have update", (done) => {
//   //     //   chai.request
//   //     //     .execute(app)
//   //     //     .post("/arrange-child")
//   //     //     .set("Authorization", `Bearer ${stafftoken}`)
//   //     //     .send({
//   //     //       academyId: "66838aa172f33c83690189ae",
//   //     //       selectedChildren: ["671a541148097639eeb357f7"],
//   //     //       type: "class",
//   //     //     })
//   //     //     .end((err, res) => {
//   //     //       try {
//   //     //         if (err) {
//   //     //           throw err;
//   //     //         }
//   //     //         console.log("Res.body", res.body);

//   //     //         expect(res.body).to.have.property("status", 200);
//   //     //         expect(res.body).to.have.property(
//   //     //           "message",
//   //     //           "Arrange successfully"
//   //     //         );

//   //     //         done();
//   //     //       } catch (error) {
//   //     //         done(error);
//   //     //       }
//   //     //     });
//   //     // });

//   //     it("UTCID02: should return a null", (done) => {
//   //       chai.request
//   //         .execute(app)
//   //         .post("/arrange-child")
//   //         .set("Authorization", `Bearer ${stafftoken}`)
//   //         .send({
//   //           academyId: "",
//   //           selectedChildren: [""],
//   //           type: "",
//   //         })
//   //         .end((err, res) => {
//   //           try {
//   //             if (err) {
//   //               throw err;
//   //             }
//   //             console.log("Res.body", res.body);

//   //             expect(res.body).to.have.property("status", 404);
//   //             expect(res.body).to.have.property("message", "Not found");

//   //             done();
//   //           } catch (error) {
//   //             done(error);
//   //           }
//   //         });
//   //     });

//   //     it("UTCID03: should return a null", (done) => {
//   //       chai.request
//   //         .execute(app)
//   //         .post("/arrange-child")
//   //         .set("Authorization", `Bearer ${stafftoken}`)
//   //         .send({
//   //           academyId: "66838aa172f33c83690189ae",
//   //           selectedChildren: [""],
//   //           type: "",
//   //         })
//   //         .end((err, res) => {
//   //           try {
//   //             if (err) {
//   //               throw err;
//   //             }
//   //             console.log("Res.body", res.body);

//   //             expect(res.body).to.have.property("status", 404);
//   //             expect(res.body).to.have.property("message", "Not found");

//   //             done();
//   //           } catch (error) {
//   //             done(error);
//   //           }
//   //         });
//   //     });

//   //     it("UTCID04: should return not permition", (done) => {
//   //       chai.request
//   //         .execute(app)
//   //         .post("/arrange-child")
//   //         .set("Authorization", `Bearer ${teachertoken}`)
//   //         .send({
//   //           academyId: "66838aa172f33c83690189ae",
//   //           selectedChildren: ["671a541148097639eeb357f7"],
//   //           type: "class",
//   //         })
//   //         .end((err, res) => {
//   //           try {
//   //             if (err) {
//   //               throw err;
//   //             }
//   //             console.log("Res.body", res.body);

//   //             expect(res.body).to.have.property("status", 403);
//   //             expect(res.body).to.have.property("message", "Not permission!");

//   //             done();
//   //           } catch (error) {
//   //             done(error);
//   //           }
//   //         });
//   //     });

//   //     it("UTCID05: should return missing header", (done) => {
//   //       chai.request
//   //         .execute(app)
//   //         .post("/arrange-child")
//   //         //   .set("Authorization", `Bearer ${teachertoken}`)
//   //         .send({
//   //           academyId: "66838aa172f33c83690189ae",
//   //           selectedChildren: ["671a541148097639eeb357f7"],
//   //           type: "class",
//   //         })
//   //         .end((err, res) => {
//   //           try {
//   //             if (err) {
//   //               throw err;
//   //             }
//   //             console.log("Res.body", res.body);

//   //             expect(res.body).to.have.property("status", 401);
//   //             expect(res.body).to.have.property(
//   //               "message",
//   //               "Missing authorization header"
//   //             );

//   //             done();
//   //           } catch (error) {
//   //             done(error);
//   //           }
//   //         });
//   //     });
//   //   });

//   //   describe("POST /Change class", () => {
//   // it("UTCID01: should return a change success", (done) => {
//   //   chai.request
//   //     .execute(app)
//   //     .post("/change-class-child")
//   //     .set("Authorization", `Bearer ${stafftoken}`)
//   //     .send({
//   //       oldAcademyId: "66838aa172f33c83690189ae",
//   //       newAcademyId: "66838aa172f33c83690189af",
//   //       childId: "671a541148097639eeb357f7",
//   //       type: "class",
//   //     })
//   //     .end((err, res) => {
//   //       try {
//   //         if (err) {
//   //           throw err;
//   //         }
//   //         console.log("Res.body", res.body);

//   //         expect(res.body).to.have.property("status", 200);
//   //         expect(res.body).to.have.property(
//   //           "message",
//   //           "Change class successfully"
//   //         );

//   //         done();
//   //       } catch (error) {
//   //         done(error);
//   //       }
//   //     });
//   // });

//   // it("UTCID02: should return a null", (done) => {
//   //   chai.request
//   //     .execute(app)
//   //     .post("/change-class-child")
//   //     .set("Authorization", `Bearer ${stafftoken}`)
//   //     .send({
//   //       oldAcademyId: "",
//   //       newAcademyId: "",
//   //       childId: "",
//   //       type: "",
//   //     })
//   //     .end((err, res) => {
//   //       try {
//   //         if (err) {
//   //           throw err;
//   //         }
//   //         console.log("Res.body", res.body);

//   //         expect(res.body).to.have.property("status", 404);
//   //         expect(res.body).to.have.property("message", "Not Found");

//   //         done();
//   //       } catch (error) {
//   //         done(error);
//   //       }
//   //     });
//   // });

//   //     it("UTCID03: should return a permision", (done) => {
//   //       chai.request
//   //         .execute(app)
//   //         .post("/change-class-child")
//   //         .set("Authorization", `Bearer ${teachertoken}`)
//   //         .send({
//   //           oldAcademyId: "66838aa172f33c83690189ae",
//   //           newAcademyId: "66838aa172f33c83690189af",
//   //           childId: "671a541148097639eeb357f7",
//   //           type: "class",
//   //         })
//   //         .end((err, res) => {
//   //           try {
//   //             if (err) {
//   //               throw err;
//   //             }
//   //             console.log("Res.body", res.body);

//   //             expect(res.body).to.have.property("status", 403);
//   //             expect(res.body).to.have.property("message", "Not permission!");

//   //             done();
//   //           } catch (error) {
//   //             done(error);
//   //           }
//   //         });
//   //     });

//   //     it("UTCID03: should return mising header", (done) => {
//   //       chai.request
//   //         .execute(app)
//   //         .post("/change-class-child")
//   //         .send({
//   //           oldAcademyId: "66838aa172f33c83690189ae",
//   //           newAcademyId: "66838aa172f33c83690189af",
//   //           childId: "671a541148097639eeb357f7",
//   //           type: "class",
//   //         })
//   //         .end((err, res) => {
//   //           try {
//   //             if (err) {
//   //               throw err;
//   //             }
//   //             console.log("Res.body", res.body);

//   //             expect(res.body).to.have.property("status", 401);
//   //             expect(res.body).to.have.property(
//   //               "message",
//   //               "Missing authorization header"
//   //             );

//   //             done();
//   //           } catch (error) {
//   //             done(error);
//   //           }
//   //         });
//   //     });
//   // });

//   //   describe("POST /CHECK IN", () => {
//   //     // it("UTCID01: should return a check in success", (done) => {
//   //     //   chai.request
//   //     //     .execute(app)
//   //     //     .post("/check-in-child-in-class")
//   //     //     .set("Authorization", `Bearer ${teachertoken}`)
//   //     //     .send({
//   //     //       isCheckIn: "true",
//   //     //       childId: "671a541148097639eeb357f7",
//   //     //       classId: "66838aa172f33c83690189ae",
//   //     //     })
//   //     //     .end((err, res) => {
//   //     //       try {
//   //     //         if (err) {
//   //     //           throw err;
//   //     //         }
//   //     //         console.log("Res.body", res.body);

//   //     //         expect(res.body).to.have.property("status", 200);
//   //     //         expect(res.body).to.have.property("message", "Successfully");

//   //     //         done();
//   //     //       } catch (error) {
//   //     //         done(error);
//   //     //       }
//   //     //     });
//   //     // });

//   //     it("UTCID02: should return checkin null", (done) => {
//   //       chai.request
//   //         .execute(app)
//   //         .post("/check-in-child-in-class")
//   //         .set("Authorization", `Bearer ${teachertoken}`)
//   //         .send({
//   //           isCheckIn: "",
//   //           childId: "",
//   //           classId: "",
//   //         })
//   //         .end((err, res) => {
//   //           try {
//   //             if (err) {
//   //               throw err;
//   //             }
//   //             console.log("Res.body", res.body);

//   //             expect(res.body).to.have.property("status", 404);
//   //             expect(res.body).to.have.property("message", "Not Found");

//   //             done();
//   //           } catch (error) {
//   //             done(error);
//   //           }
//   //         });
//   //     });

//   //     it("UTCID03: should return checkin not permission", (done) => {
//   //       chai.request
//   //         .execute(app)
//   //         .post("/check-in-child-in-class")
//   //         .set("Authorization", `Bearer ${stafftoken}`)
//   //         .send({
//   //           isCheckIn: "true",
//   //           childId: "671a541148097639eeb357f7",
//   //           classId: "66838aa172f33c83690189ae",
//   //         })
//   //         .end((err, res) => {
//   //           try {
//   //             if (err) {
//   //               throw err;
//   //             }
//   //             console.log("Res.body", res.body);

//   //             expect(res.body).to.have.property("status", 403);
//   //             expect(res.body).to.have.property("message", "Not permission!");

//   //             done();
//   //           } catch (error) {
//   //             done(error);
//   //           }
//   //         });
//   //     });

//   //     it("UTCID04: should return checkin missing header", (done) => {
//   //       chai.request
//   //         .execute(app)
//   //         .post("/check-in-child-in-class")
//   //         //   .set("Authorization", `Bearer ${stafftoken}`)
//   //         .send({
//   //           isCheckIn: "true",
//   //           childId: "671a541148097639eeb357f7",
//   //           classId: "66838aa172f33c83690189ae",
//   //         })
//   //         .end((err, res) => {
//   //           try {
//   //             if (err) {
//   //               throw err;
//   //             }
//   //             console.log("Res.body", res.body);

//   //             expect(res.body).to.have.property("status", 401);
//   //             expect(res.body).to.have.property(
//   //               "message",
//   //               "Missing authorization header"
//   //             );

//   //             done();
//   //           } catch (error) {
//   //             done(error);
//   //           }
//   //         });
//   //     });
//   //   });

//   describe("POST /CHECK OUT", () => {
//     it("UTCID01: should return a check out success", (done) => {
//       chai.request
//         .execute(app)
//         .post("/check-out-child-in-class")
//         .set("Authorization", `Bearer ${teachertoken}`)
//         .send({
//           isCheckOut: "true",
//           childId: "671a541148097639eeb357f7",
//           classId: "66838aa172f33c83690189ae",
//         })
//         .end((err, res) => {
//           try {
//             if (err) {
//               throw err;
//             }
//             console.log("Res.body", res.body);
//             expect(res.body).to.have.property("status", 200);
//             expect(res.body).to.have.property("message", "Successfully");
//             done();
//           } catch (error) {
//             done(error);
//           }
//         });
//     });

//     it("UTCID02: should return check out null", (done) => {
//       chai.request
//         .execute(app)
//         .post("/check-out-child-in-class")
//         .set("Authorization", `Bearer ${teachertoken}`)
//         .send({
//           isCheckIn: "",
//           childId: "",
//           classId: "",
//         })
//         .end((err, res) => {
//           try {
//             if (err) {
//               throw err;
//             }
//             console.log("Res.body", res.body);
//             expect(res.body).to.have.property("status", 404);
//             expect(res.body).to.have.property("message", "Not Found");
//             done();
//           } catch (error) {
//             done(error);
//           }
//         });
//     });

//     it("UTCID03: should return checkin not permission", (done) => {
//       chai.request
//         .execute(app)
//         .post("/check-out-child-in-class")
//         .set("Authorization", `Bearer ${stafftoken}`)
//         .send({
//           isCheckIn: "true",
//           childId: "671a541148097639eeb357f7",
//           classId: "66838aa172f33c83690189ae",
//         })
//         .end((err, res) => {
//           try {
//             if (err) {
//               throw err;
//             }
//             console.log("Res.body", res.body);
//             expect(res.body).to.have.property("status", 403);
//             expect(res.body).to.have.property("message", "Not permission!");
//             done();
//           } catch (error) {
//             done(error);
//           }
//         });
//     });

//     it("UTCID04: should return checkin missing header", (done) => {
//       chai.request
//         .execute(app)
//         .post("/check-out-child-in-class")
//         //   .set("Authorization", `Bearer ${stafftoken}`)
//         .send({
//           isCheckIn: "true",
//           childId: "671a541148097639eeb357f7",
//           classId: "66838aa172f33c83690189ae",
//         })
//         .end((err, res) => {
//           try {
//             if (err) {
//               throw err;
//             }
//             console.log("Res.body", res.body);
//             expect(res.body).to.have.property("status", 401);
//             expect(res.body).to.have.property(
//               "message",
//               "Missing authorization header"
//             );
//             done();
//           } catch (error) {
//             done(error);
//           }
//         });
//     });

//   describe("GET /VIEW LIST CHILDREN IN CLASS", () => {
// it("UTCID01: should return view list children in class successful", (done) => {
//   chai.request
//     .execute(app)
//     .get(
//       "/get-child-by-classes?classId=66974e9767d3fd2f3bcb63bf&attendDay=21&attendMonth=11&attendYear=2024"
//     )
//     .set("Authorization", `Bearer ${teachertoken}`)
//     .end((err, res) => {
//       try {
//         if (err) {
//           throw err;
//         }
//         console.log("Res.body", res.body);
//         expect(res.body).to.have.property("status", 200);
//         expect(res.body).to.have.property(
//           "message",
//           "Children fetched successfully!"
//         );
//         done();
//       } catch (error) {
//         done(error);
//       }
//     });
// });
// it("UTCID02: should return error when class has no children", (done) => {
//   chai.request
//     .execute(app)
//     .get(
//       "/get-child-by-classes?classId=66838aa172f33c83690189b0&attendDay=21&attendMonth=11&attendYear=2024" // dùng id lớp Web Development
//     )
//     .set("Authorization", `Bearer ${teachertoken}`)
//     .end((err, res) => {
//       try {
//         if (err) {
//           throw err;
//         }
//         console.log("Res.body", res.body);
//         expect(res.body).to.have.property("status", 200);
//         expect(res.body).to.have.property(
//           "message",
//           "No children found in class"
//         );
//         done();
//       } catch (error) {
//         done(error);
//       }
//     });
// });
// it("UTCID03: should return error when class has invalid classId or null", (done) => {
//   chai.request
//     .execute(app)
//     .get(
//       "/get-child-by-classes?classId=66974e9767d3fd2f3bcb63bg&attendDay=21&attendMonth=11&attendYear=2024" // invalid classId change f -> g
//     )
//     .set("Authorization", `Bearer ${teachertoken}`)
//     .end((err, res) => {
//       try {
//         if (err) {
//           throw err;
//         }
//         console.log("Res.body", res.body);
//         expect(res.body).to.have.property("status", 400);
//         expect(res.body).to.have.property(
//           "message",
//           "ClassId is required or invalid"
//         );
//         done();
//       } catch (error) {
//         done(error);
//       }
//     });
// });
// it("UTCID04: should return error when class has not role teacher", (done) => {
//   chai.request
//     .execute(app)
//     .get(
//       "/get-child-by-classes?classId=66974e9767d3fd2f3bcb63bf&attendDay=21&attendMonth=11&attendYear=2024"
//     )
//     .set("Authorization", `Bearer ${token}`)
//     .end((err, res) => {
//       try {
//         if (err) {
//           throw err;
//         }
//         console.log("Res.body", res.body);
//         expect(res.body).to.have.property("status", 403);
//         expect(res.body).to.have.property("message", "Not permission!");
//         done();
//       } catch (error) {
//         done(error);
//       }
//     });
// });
// it("UTCID05: should return error when class has missing header", (done) => {
//   chai.request
//     .execute(app)
//     .get(
//       "/get-child-by-classes?classId=66974e9767d3fd2f3bcb63bf&attendDay=21&attendMonth=11&attendYear=2024"
//     )
//     .end((err, res) => {
//       try {
//         if (err) {
//           throw err;
//         }
//         console.log("Res.body", res.body);
//         expect(res.body).to.have.property("status", 401);
//         expect(res.body).to.have.property(
//           "message",
//           "Missing authorization header"
//         );
//         done();
//       } catch (error) {
//         done(error);
//       }
//     });
// });
//   });

//   describe("GET /VIEW LIST CHILDREN IN CLASS", () => {
//     it("UTCID01: should return view list children in class successful", (done) => {
//       chai.request
//         .execute(app)
//         .get(
//           "/get-child-by-classes?classId=66974e9767d3fd2f3bcb63bf&attendDay=21&attendMonth=11&attendYear=2024"
//         )
//         .set("Authorization", `Bearer ${teachertoken}`)
//         .end((err, res) => {
//           try {
//             if (err) {
//               throw err;
//             }
//             console.log("Res.body", res.body);
//             expect(res.body).to.have.property("status", 200);
//             expect(res.body).to.have.property(
//               "message",
//               "Children fetched successfully!"
//             );
//             done();
//           } catch (error) {
//             done(error);
//           }
//         });
//     });
//   });
// });
