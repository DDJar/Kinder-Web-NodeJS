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
//   let driver = {};
//   let drivertoken = {};
//   const invalid_token = "670de9da1d7f545256e5ee68";

//   describe("POST /login", () => {
//     // it("Login to get token ADMIN", (done) => {
//     //   chai.request
//     //     .execute(app)
//     //     .post("/login")
//     //     .send({ username: "admin@gmail.com", password: "1234567890" })
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

//     // it("Login to get token USER", (done) => {
//     //   chai.request
//     //     .execute(app)
//     //     .post("/login")
//     //     .send({ username: "user@gmail.com", password: "1234567890" })
//     //     .end((err, res) => {
//     //       try {
//     //         if (err) {
//     //           throw err;
//     //         }
//     //         expect(res.body).to.have.property("status", 200);
//     //         expect(res.body).to.have.property("message", "Login successfully!");
//     //         expect(res.body).to.have.property("token");
//     //         token = res.body.token;
//     //         const decoded = jwt.verify(token, jwtSecret);
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

//     // it("Login to get token TEACHER", (done) => {
//     //   chai.request
//     //     .execute(app)
//     //     .post("/login")
//     //     .send({ username: "teacher@gmail.com", password: "1234567890" })
//     //     .end((err, res) => {
//     //       try {
//     //         if (err) {
//     //           throw err;
//     //         }
//     //         expect(res.body).to.have.property("status", 200);
//     //         expect(res.body).to.have.property("message", "Login successfully!");
//     //         expect(res.body).to.have.property("token");
//     //         teachertoken = res.body.token;
//     //         const decoded = jwt.verify(teachertoken, jwtSecret);
//     //         teacher = {
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

//     it("Login to get token STAFF", (done) => {
//       chai.request
//         .execute(app)
//         .post("/login")
//         .send({ username: "staff@gmail.com", password: "1234567890" })
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

//     it("Login to get token DRIVER", (done) => {
//       chai.request
//         .execute(app)
//         .post("/login")
//         .send({ username: "driver@gmail.com", password: "1234567890" })
//         .end((err, res) => {
//           try {
//             if (err) {
//               throw err;
//             }
//             expect(res.body).to.have.property("status", 200);
//             expect(res.body).to.have.property("message", "Login successfully!");
//             expect(res.body).to.have.property("token");
//             drivertoken = res.body.token;
//             const decoded = jwt.verify(drivertoken, jwtSecret);
//             driver = {
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

//     // it("Login to get token BLOCKER", (done) => {
//     //   chai.request
//     //     .execute(app)
//     //     .post("/login")
//     //     .send({ username: "blocker@gmail.com", password: "1234567890" })
//     //     .end((err, res) => {
//     //       try {
//     //         if (err) {
//     //           throw err;
//     //         }
//     //         expect(res.body).to.have.property("status", 200);
//     //         expect(res.body).to.have.property("message", "Login successfully!");
//     //         expect(res.body).to.have.property("token");
//     //         blocktoken = res.body.token;
//     //         const decoded = jwt.verify(blocktoken, jwtSecret);
//     //         blocker = {
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
//   });

//   //   describe("POST /CHECK-IN TRANSPORTATION FOR CHILDREN SCHOOL", () => {
//   //     // it("UTCID01: should return check-in transportation for children succcess", (done) => {
//   //     //   chai.request
//   //     //     .execute(app)
//   //     //     .post("/check-in-child-in-transportation")
//   //     //     .set("Authorization", `Bearer ${drivertoken}`)
//   //     //     .send({
//   //     //       transportId: "673d92c65b0cc4621ab488bb",
//   //     //       childId: "673b1814fc2181f90ec0fadd",
//   //     //       isCheckIn: true,
//   //     //       type: "FIRST",
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
//   //     // it("UTCID02: should return error when check-in transportation with null", (done) => {
//   //     //   chai.request
//   //     //     .execute(app)
//   //     //     .post("/check-in-child-in-transportation")
//   //     //     .set("Authorization", `Bearer ${drivertoken}`)
//   //     //     .send({
//   //     //       transportId: "",
//   //     //       childId: "",
//   //     //       isCheckIn: null,
//   //     //       type: "",
//   //     //     })
//   //     //     .end((err, res) => {
//   //     //       try {
//   //     //         if (err) {
//   //     //           throw err;
//   //     //         }
//   //     //         console.log("Res.body", res.body);
//   //     //         expect(res.body).to.have.property("status", 404);
//   //     //         expect(res.body).to.have.property("message", "Not Found");
//   //     //         done();
//   //     //       } catch (error) {
//   //     //         done(error);
//   //     //       }
//   //     //     });
//   //     // });
//   //     // it("UTCID03: should return error when check-in transportation with not permission", (done) => {
//   //     //   chai.request
//   //     //     .execute(app)
//   //     //     .post("/check-in-child-in-transportation")
//   //     //     .set("Authorization", `Bearer ${stafftoken}`)
//   //     //     .send({
//   //     //       transportId: "673d92c65b0cc4621ab488bb",
//   //     //       childId: "673b1814fc2181f90ec0fadd",
//   //     //       isCheckIn: true,
//   //     //       type: "FIRST",
//   //     //     })
//   //     //     .end((err, res) => {
//   //     //       try {
//   //     //         if (err) {
//   //     //           throw err;
//   //     //         }
//   //     //         console.log("Res.body", res.body);
//   //     //         expect(res.body).to.have.property("status", 403);
//   //     //         expect(res.body).to.have.property("message", "Not permission!");
//   //     //         done();
//   //     //       } catch (error) {
//   //     //         done(error);
//   //     //       }
//   //     //     });
//   //     // });
//   //     // it("UTCID04: should return error when check-in transportation with mising header", (done) => {
//   //     //   chai.request
//   //     //     .execute(app)
//   //     //     .post("/check-in-child-in-transportation")
//   //     //     .send({
//   //     //       transportId: "673d92c65b0cc4621ab488bb",
//   //     //       childId: "673b1814fc2181f90ec0fadd",
//   //     //       isCheckIn: true,
//   //     //       type: "FIRST",
//   //     //     })
//   //     //     .end((err, res) => {
//   //     //       try {
//   //     //         if (err) {
//   //     //           throw err;
//   //     //         }
//   //     //         console.log("Res.body", res.body);
//   //     //         expect(res.body).to.have.property("status", 401);
//   //     //         expect(res.body).to.have.property(
//   //     //           "message",
//   //     //           "Missing authorization header"
//   //     //         );
//   //     //         done();
//   //     //       } catch (error) {
//   //     //         done(error);
//   //     //       }
//   //     //     });
//   //     // });
//   //   });

//   describe("POST /CHECK-OUT TRANSPORTATION FOR CHILDREN SCHOOL", () => {
//     // it("UTCID01: should return check-in transportation for children succcess", (done) => {
//     //   chai.request
//     //     .execute(app)
//     //     .post("/check-out-child-in-transportation")
//     //     .set("Authorization", `Bearer ${drivertoken}`)
//     //     .send({
//     //       transportId: "673d92c65b0cc4621ab488bb",
//     //       childId: "673b1814fc2181f90ec0fadd",
//     //       isCheckOut: true,
//     //       type: "SECOND",
//     //     })
//     //     .end((err, res) => {
//     //       try {
//     //         if (err) {
//     //           throw err;
//     //         }
//     //         console.log("Res.body", res.body);
//     //         expect(res.body).to.have.property("status", 200);
//     //         expect(res.body).to.have.property("message", "Successfully");
//     //         done();
//     //       } catch (error) {
//     //         done(error);
//     //       }
//     //     });
//     // });
//     // it("UTCID02: should return error when check-out transportation with null", (done) => {
//     //   chai.request
//     //     .execute(app)
//     //     .post("/check-out-child-in-transportation")
//     //     .set("Authorization", `Bearer ${drivertoken}`)
//     //     .send({
//     //       transportId: "",
//     //       childId: "",
//     //       isCheckOut: null,
//     //       type: "",
//     //     })
//     //     .end((err, res) => {
//     //       try {
//     //         if (err) {
//     //           throw err;
//     //         }
//     //         console.log("Res.body", res.body);
//     //         expect(res.body).to.have.property("status", 404);
//     //         expect(res.body).to.have.property("message", "Not Found");
//     //         done();
//     //       } catch (error) {
//     //         done(error);
//     //       }
//     //     });
//     // });

//     it("UTCID03: should return error when check-out transportation with not permission", (done) => {
//       chai.request
//         .execute(app)
//         .post("/check-out-child-in-transportation")
//         .set("Authorization", `Bearer ${stafftoken}`)
//         .send({
//           transportId: "673d92c65b0cc4621ab488bb",
//           childId: "673b1814fc2181f90ec0fadd",
//           isCheckOut: true,
//           type: "SECOND",
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

//     it("UTCID04: should return error when check-out transportation with mising header", (done) => {
//       chai.request
//         .execute(app)
//         .post("/check-out-child-in-transportation")
//         .send({
//           transportId: "673d92c65b0cc4621ab488bb",
//           childId: "673b1814fc2181f90ec0fadd",
//           isCheckOut: true,
//           type: "SECOND",
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
//   });
// });
