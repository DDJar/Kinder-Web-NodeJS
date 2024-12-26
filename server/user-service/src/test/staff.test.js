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

//   //thêm 1 trường hợp duplicate
//   //   describe("POST /CREATE TRANSPORTATION SCHOOL", () => {
//   // it("UTCID01: should return create trasport succcess", (done) => {
//   //   chai.request
//   //     .execute(app)
//   //     .post("/create-transportation-service")
//   //     .set("Authorization", `Bearer ${stafftoken}`)
//   //     .send({
//   //       name: "Xe buýt lớn 3",
//   //       driverId: "66fccc46f8f82a781e428242",
//   //       totalSeats: "16",
//   //       tuition: "500000",
//   //       busNumber: "43A-563.33",
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
//   //           "Create transportation service successfully!"
//   //         );

//   //         done();
//   //       } catch (error) {
//   //         done(error);
//   //       }
//   //     });
//   // });

//   // it("UTCID02: should return error when valid is required create trasport", (done) => {
//   //   chai.request
//   //     .execute(app)
//   //     .post("/create-transportation-service")
//   //     .set("Authorization", `Bearer ${stafftoken}`)
//   //     .send({
//   //       name: "",
//   //       driverId: "",
//   //       totalSeats: "",
//   //       tuition: "",
//   //       busNumber: "",
//   //     })
//   //     .end((err, res) => {
//   //       try {
//   //         if (err) {
//   //           throw err;
//   //         }
//   //         console.log("Res.body", res.body);

//   //         expect(res.body).to.have.property("status", 400);
//   //         expect(res.body).to.have.property("message", "Valid is required");

//   //         done();
//   //       } catch (error) {
//   //         done(error);
//   //       }
//   //     });
//   // });

//   // it("UTCID03: should return error when create trasport not permission!", (done) => {
//   //   chai.request
//   //     .execute(app)
//   //     .post("/create-transportation-service")
//   //     .set("Authorization", `Bearer ${token}`)
//   //     .send({
//   //       name: "Xe buýt lớn 3",
//   //       driverId: "66fccc46f8f82a781e428242",
//   //       totalSeats: "16",
//   //       tuition: "500000",
//   //       busNumber: "43A-563.33",
//   //     })
//   //     .end((err, res) => {
//   //       try {
//   //         if (err) {
//   //           throw err;
//   //         }
//   //         console.log("Res.body", res.body);

//   //         expect(res.body).to.have.property("status", 403);
//   //         expect(res.body).to.have.property("message", "Not permission!");

//   //         done();
//   //       } catch (error) {
//   //         done(error);
//   //       }
//   //     });
//   // });

//   // it("UTCID04: should return error when create trasport missing header", (done) => {
//   //   chai.request
//   //     .execute(app)
//   //     .post("/create-transportation-service")
//   //     .send({
//   //       name: "Xe buýt lớn 3",
//   //       driverId: "66fccc46f8f82a781e428242",
//   //       totalSeats: "16",
//   //       tuition: "500000",
//   //       busNumber: "43A-563.33",
//   //     })
//   //     .end((err, res) => {
//   //       try {
//   //         if (err) {
//   //           throw err;
//   //         }
//   //         console.log("Res.body", res.body);

//   //         expect(res.body).to.have.property("status", 401);
//   //         expect(res.body).to.have.property(
//   //           "message",
//   //           "Missing authorization header"
//   //         );

//   //         done();
//   //       } catch (error) {
//   //         done(error);
//   //       }
//   //     });
//   // });

//   // it("UTCID05: should return create trasport duplicate", (done) => {
//   //   chai.request
//   //     .execute(app)
//   //     .post("/create-transportation-service")
//   //     .set("Authorization", `Bearer ${stafftoken}`)
//   //     .send({
//   //       name: "Xe buýt lớn 3",
//   //       driverId: "66fccc46f8f82a781e428242",
//   //       totalSeats: "16",
//   //       tuition: "500000",
//   //       busNumber: "43A-563.33",
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
//   //           "Create transportation service successfully!"
//   //         );

//   //         done();
//   //       } catch (error) {
//   //         done(error);
//   //       }
//   //     });
//   // });
//   //   });

//   //   describe("POST /ARRANGE TRANSPORTATION SCHOOL", () => {
//   //     // it("UTCID01: should return arrange trasport succcess", (done) => {
//   //     //   chai.request
//   //     //     .execute(app)
//   //     //     .post("/arrange-child-transportation-service")
//   //     //     .set("Authorization", `Bearer ${stafftoken}`)
//   //     //     .send({
//   //     //       transportId: "673d92c65b0cc4621ab488bb",
//   //     //       selectedChildren: ["673b1814fc2181f90ec0fadd"],
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

//   //     // it("UTCID02: should return error when arrange trasport not found trasportID null", (done) => {
//   //     //   chai.request
//   //     //     .execute(app)
//   //     //     .post("/arrange-child-transportation-service")
//   //     //     .set("Authorization", `Bearer ${stafftoken}`)
//   //     //     .send({
//   //     //       transportId: "",
//   //     //       selectedChildren: ["673b1814fc2181f90ec0fadd"],
//   //     //     })
//   //     //     .end((err, res) => {
//   //     //       try {
//   //     //         if (err) {
//   //     //           throw err;
//   //     //         }
//   //     //         console.log("Res.body", res.body);

//   //     //         expect(res.body).to.have.property("status", 404);
//   //     //         expect(res.body).to.have.property("message", "Not found");

//   //     //         done();
//   //     //       } catch (error) {
//   //     //         done(error);
//   //     //       }
//   //     //     });
//   //     // });

//   //     // it("UTCID03: should return error when arrange trasport not found with wrong ID", (done) => {
//   //     //   chai.request
//   //     //     .execute(app)
//   //     //     .post("/arrange-child-transportation-service")
//   //     //     .set("Authorization", `Bearer ${stafftoken}`)
//   //     //     .send({
//   //     //       transportId: "673d92c65b0cc4621ab488bc", //wrong ID change b -> c
//   //     //       selectedChildren: ["673b1814fc2181f90ec0fadd"],
//   //     //     })
//   //     //     .end((err, res) => {
//   //     //       try {
//   //     //         if (err) {
//   //     //           throw err;
//   //     //         }
//   //     //         console.log("Res.body", res.body);

//   //     //         expect(res.body).to.have.property("status", 404);
//   //     //         expect(res.body).to.have.property("message", "Not found");

//   //     //         done();
//   //     //       } catch (error) {
//   //     //         done(error);
//   //     //       }
//   //     //     });
//   //     // });

//   //     // it("UTCID04: should return error when arrange trasport not found with lenght=0", (done) => {
//   //     //   chai.request
//   //     //     .execute(app)
//   //     //     .post("/arrange-child-transportation-service")
//   //     //     .set("Authorization", `Bearer ${stafftoken}`)
//   //     //     .send({
//   //     //       transportId: "673d92c65b0cc4621ab488bb",
//   //     //       selectedChildren: [], //test length = 0
//   //     //     })
//   //     //     .end((err, res) => {
//   //     //       try {
//   //     //         if (err) {
//   //     //           throw err;
//   //     //         }
//   //     //         console.log("Res.body", res.body);

//   //     //         expect(res.body).to.have.property("status", 404);
//   //     //         expect(res.body).to.have.property("message", "Not found");

//   //     //         done();
//   //     //       } catch (error) {
//   //     //         done(error);
//   //     //       }
//   //     //     });
//   //     // });

//   //     // it("UTCID05: should return error when arrange trasport not found with not permission", (done) => {
//   //     //   chai.request
//   //     //     .execute(app)
//   //     //     .post("/arrange-child-transportation-service")
//   //     //     .set("Authorization", `Bearer ${token}`)
//   //     //     .send({
//   //     //       transportId: "673d92c65b0cc4621ab488bb",
//   //     //       selectedChildren: ["673b1814fc2181f90ec0fadd"],
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

//   //     // it("UTCID06: should return error when arrange trasport not found with missing header", (done) => {
//   //     //   chai.request
//   //     //     .execute(app)
//   //     //     .post("/arrange-child-transportation-service")
//   //     //     .send({
//   //     //       transportId: "673d92c65b0cc4621ab488bb",
//   //     //       selectedChildren: ["673b1814fc2181f90ec0fadd"],
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

//   //   describe("GET /VIEW DETAIL TRANSPORTATION SCHOOL", () => {
//   //     // it("UTCID01: should return view detail trasport succcess", (done) => {
//   //     //   chai.request
//   //     //     .execute(app)
//   //     //     .get(
//   //     //       "/get-child-in-transportation?transportId=673d92c65b0cc4621ab488bb"
//   //     //     )
//   //     //     .set("Authorization", `Bearer ${stafftoken}`)
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

//   //     // it("UTCID02: should return error when view detail trasport with null ID", (done) => {
//   //     //   chai.request
//   //     //     .execute(app)
//   //     //     .get("/get-child-in-transportation?transportId=")
//   //     //     .set("Authorization", `Bearer ${stafftoken}`)
//   //     //     .end((err, res) => {
//   //     //       try {
//   //     //         if (err) {
//   //     //           throw err;
//   //     //         }
//   //     //         console.log("Res.body", res.body);

//   //     //         expect(res.body).to.have.property("status", 404);
//   //     //         expect(res.body).to.have.property("message", "Not found");

//   //     //         done();
//   //     //       } catch (error) {
//   //     //         done(error);
//   //     //       }
//   //     //     });
//   //     // });

//   //     // it("UTCID03: should return error when view detail trasport with not permission", (done) => {
//   //     //   chai.request
//   //     //     .execute(app)
//   //     //     .get(
//   //     //       "/get-child-in-transportation?transportId=673d92c65b0cc4621ab488bb"
//   //     //     )
//   //     //     .set("Authorization", `Bearer ${drivertoken}`)
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

//   //     // it("UTCID04: should return error when view detail trasport with missing header", (done) => {
//   //     //   chai.request
//   //     //     .execute(app)
//   //     //     .get(
//   //     //       "/get-child-in-transportation?transportId=673d92c65b0cc4621ab488bb"
//   //     //     )
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
// });
