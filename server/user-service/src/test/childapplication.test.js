// import { use, expect } from "chai";
// import chaiHttp from "chai-http";
// import app from "../server.js";
// import config from "../config/config.js";
// import jwt from "jsonwebtoken";

// const jwtSecret = config.JWT_SECRET;
// const chai = use(chaiHttp);
// const valid_documentId = "671860b30e4e5c14fe73020f";
// const invalid_documentId = "671860b30e4e5c14fe73020d";
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
// it("Login to get token admin", (done) => {
//   chai.request
//     .execute(app)
//     .post("/login")
//     .send({ username: "test@gmail.com", password: "1234567890" })
//     .end((err, res) => {
//       try {
//         if (err) {
//           throw err;
//         }
//         expect(res.body).to.have.property("status", 200);
//         expect(res.body).to.have.property("message", "Login successfully!");
//         expect(res.body).to.have.property("token");
//         admintoken = res.body.token;
//         const decoded = jwt.verify(admintoken, jwtSecret);
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

//     it("Login to get token user", (done) => {
//       chai.request
//         .execute(app)
//         .post("/login")
//         .send({ username: "test11@gmail.com", password: "1234567890" })
//         .end((err, res) => {
//           try {
//             if (err) {
//               throw err;
//             }
//             expect(res.body).to.have.property("status", 200);
//             expect(res.body).to.have.property("message", "Login successfully!");
//             expect(res.body).to.have.property("token");
//             token = res.body.token;
//             const decoded = jwt.verify(token, jwtSecret);
//             user = {
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

//     it("Login to get token teacher", (done) => {
//       chai.request
//         .execute(app)
//         .post("/login")
//         .send({ username: "test14@gmail.com", password: "1234567890" })
//         .end((err, res) => {
//           try {
//             if (err) {
//               throw err;
//             }
//             expect(res.body).to.have.property("status", 200);
//             expect(res.body).to.have.property("message", "Login successfully!");
//             expect(res.body).to.have.property("token");
//             teachertoken = res.body.token;
//             const decoded = jwt.verify(teachertoken, jwtSecret);
//             teacher = {
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

// describe("PUT /UPDATE REGISTER FOR SCHOOL", () => {
//   it("UTCID01: should return admission application update successfully", (done) => {
//     chai.request
//       .execute(app)
//       .put("/children/670d2d758256f3c1802a7f84/register/update")
//       .set("Authorization", `Bearer ${token}`)
//       .send({
//         childId: "670d2d758256f3c1802a7f84",
//       })
//       .end((err, res) => {
//         try {
//           if (err) {
//             throw err;
//           }
//           console.log("Res.body", res.body);
//           expect(res.body).to.have.property("status", 200);
//           expect(res.body).to.have.property(
//             "message",
//             "Admission application updated successfully!"
//           );
//           done();
//         } catch (error) {
//           done(error);
//         }
//       });
//   });
// it("UTCID02: should return admission application update invalid child ID", (done) => {
//   chai.request
//     .execute(app)
//     .put("/children/670d2d758256f3c1802a7f84saine/register/update")
//     .set("Authorization", `Bearer ${token}`)
//     .send({
//       childId: "670d2d758256f3c1802a7f83",
//     })
//     .end((err, res) => {
//       try {
//         if (err) {
//           throw err;
//         }
//         console.log("Res.body", res.body);
//         expect(res.body).to.have.property("status", 404);
//         expect(res.body).to.have.property(
//           "message",
//           "Admission application not found"
//         );
//         done();
//       } catch (error) {
//         done(error);
//       }
//     });
// });
//   //   it("UTCID03: should return admission application update missing header", (done) => {
//   //     chai.request
//   //       .execute(app)
//   //       .put("/children/670d2d758256f3c1802a7f84/register/update")
//   //       // .set("Authorization", `Bearer ${token}`)
//   //       .send({
//   //         childId: "670d2d758256f3c1802a7f84",
//   //       })
//   //       .end((err, res) => {
//   //         try {
//   //           if (err) {
//   //             throw err;
//   //           }
//   //           console.log("Res.body", res.body);
//   //           expect(res.body).to.have.property("status", 401);
//   //           expect(res.body).to.have.property(
//   //             "message",
//   //             "Missing authorization header"
//   //           );
//   //           done();
//   //         } catch (error) {
//   //           done(error);
//   //         }
//   //       });
//   //   });
//   //   it("UTCID04: should return admission application update not role user", (done) => {
//   //     chai.request
//   //       .execute(app)
//   //       .put("/children/670d2d758256f3c1802a7f84/register/update")
//   //       .set("Authorization", `Bearer ${teachertoken}`)
//   //       .send({
//   //         childId: "670d2d758256f3c1802a7f84",
//   //       })
//   //       .end((err, res) => {
//   //         try {
//   //           if (err) {
//   //             throw err;
//   //           }
//   //           console.log("Res.body", res.body);
//   //           expect(res.body).to.have.property("status", 403);
//   //           expect(res.body).to.have.property("message", "Not permission!");
//   //           done();
//   //         } catch (error) {
//   //           done(error);
//   //         }
//   //       });
//   //   });
//   // });
//   // describe("PUT /UPDATE DOCUMENT", () => {
//   //   it("UTCID01: should return admission application update document successfully", (done) => {
//   //     chai.request
//   //       .execute(app)
//   //       .put("/children/670d2d758256f3c1802a7f84/upload/update")
//   //       .set("Authorization", `Bearer ${token}`)
//   //       .send({
//   //         documentId: "671860b30e4e5c14fe73020f",
//   //         title: "HEALTH_CHECK",
//   //         description: "sổ khám sức khỏe của trẻ đã được xác nhận",
//   //         img: "https://kinderstorageblob.blob.core.windows.net/kinderblobby/hinh-kham-suc-khoe.jpg?sv=2022-11-02&ss=b&srt=sco&sp=rwlactfx&se=2024-10-23T22:52:54Z&st=2024-10-23T14:52:54Z&spr=https,http&sig=Fc9rDz7rf0pFMLFlB4FkdvN2ybLANr9d3qHq1sNjW4Y%3D",
//   //       })
//   //       .end((err, res) => {
//   //         try {
//   //           if (err) {
//   //             throw err;
//   //           }
//   //           console.log("Res.body", res.body);
//   //           expect(res.body).to.have.property("status", 200);
//   //           expect(res.body).to.have.property(
//   //             "message",
//   //             "Document updated successfully!"
//   //           );
//   //           done();
//   //         } catch (error) {
//   //           done(error);
//   //         }
//   //       });
//   //   });
//   //   it("UTCID02: should return admission application update document invalid", (done) => {
//   //     chai.request
//   //       .execute(app)
//   //       .put("/children/670d2d758256f3c1802a7f84/upload/update")
//   //       .set("Authorization", `Bearer ${token}`)
//   //       .send({
//   //         documentId: invalid_documentId,
//   //         title: "HEALTH_CHECK",
//   //         description: "sổ khám sức khỏe của trẻ đã được xác nhận",
//   //         img: "https://kinderstorageblob.blob.core.windows.net/kinderblobby/hinh-kham-suc-khoe.jpg?sv=2022-11-02&ss=b&srt=sco&sp=rwlactfx&se=2024-10-23T22:52:54Z&st=2024-10-23T14:52:54Z&spr=https,http&sig=Fc9rDz7rf0pFMLFlB4FkdvN2ybLANr9d3qHq1sNjW4Y%3D",
//   //       })
//   //       .end((err, res) => {
//   //         try {
//   //           if (err) {
//   //             throw err;
//   //           }
//   //           console.log("Res.body", res.body);
//   //           expect(res.body).to.have.property("status", 404);
//   //           expect(res.body).to.have.property(
//   //             "message",
//   //             `No admission document found with ID: ${invalid_documentId}`
//   //           );
//   //           done();
//   //         } catch (error) {
//   //           done(error);
//   //         }
//   //       });
//   //   });
//   //   it("UTCID03: should return admission application update document missing authorization header", (done) => {
//   //     chai.request
//   //       .execute(app)
//   //       .put("/children/670d2d758256f3c1802a7f84/upload/update")
//   //       //   .set("Authorization", `Bearer ${token}`)
//   //       .send({
//   //         documentId: "671860b30e4e5c14fe73020f",
//   //         title: "HEALTH_CHECK",
//   //         description: "sổ khám sức khỏe của trẻ đã được xác nhận",
//   //         img: "https://kinderstorageblob.blob.core.windows.net/kinderblobby/hinh-kham-suc-khoe.jpg?sv=2022-11-02&ss=b&srt=sco&sp=rwlactfx&se=2024-10-23T22:52:54Z&st=2024-10-23T14:52:54Z&spr=https,http&sig=Fc9rDz7rf0pFMLFlB4FkdvN2ybLANr9d3qHq1sNjW4Y%3D",
//   //       })
//   //       .end((err, res) => {
//   //         try {
//   //           if (err) {
//   //             throw err;
//   //           }
//   //           console.log("Res.body", res.body);
//   //           expect(res.body).to.have.property("status", 401);
//   //           expect(res.body).to.have.property(
//   //             "message",
//   //             "Missing authorization header"
//   //           );
//   //           done();
//   //         } catch (error) {
//   //           done(error);
//   //         }
//   //       });
//   //   });
//   //   it("UTCID04: should return admission application update document null", (done) => {
//   //     chai.request
//   //       .execute(app)
//   //       .put("/children/670d2d758256f3c1802a7f84/upload/update")
//   //       .set("Authorization", `Bearer ${token}`)
//   //       .send({
//   //         documentId: "",
//   //         title: "",
//   //         description: "",
//   //         img: "",
//   //       })
//   //       .end((err, res) => {
//   //         try {
//   //           if (err) {
//   //             throw err;
//   //           }
//   //           console.log("Res.body", res.body);
//   //           expect(res.body).to.have.property("status", 400);
//   //           expect(res.body).to.have.property(
//   //             "message",
//   //             "Document ID is required"
//   //           );
//   //           done();
//   //         } catch (error) {
//   //           done(error);
//   //         }
//   //       });
//   //   });
//   //   it("UTCID05: should return admission application update document not permission", (done) => {
//   //     chai.request
//   //       .execute(app)
//   //       .put("/children/670d2d758256f3c1802a7f84/upload/update")
//   //       .set("Authorization", `Bearer ${teachertoken}`)
//   //       .send({
//   //         documentId: "671860b30e4e5c14fe73020f",
//   //         title: "HEALTH_CHECK",
//   //         description: "sổ khám sức khỏe của trẻ đã được xác nhận",
//   //         img: "https://kinderstorageblob.blob.core.windows.net/kinderblobby/hinh-kham-suc-khoe.jpg?sv=2022-11-02&ss=b&srt=sco&sp=rwlactfx&se=2024-10-23T22:52:54Z&st=2024-10-23T14:52:54Z&spr=https,http&sig=Fc9rDz7rf0pFMLFlB4FkdvN2ybLANr9d3qHq1sNjW4Y%3D",
//   //       })
//   //       .end((err, res) => {
//   //         try {
//   //           if (err) {
//   //             throw err;
//   //           }
//   //           console.log("Res.body", res.body);
//   //           expect(res.body).to.have.property("status", 403);
//   //           expect(res.body).to.have.property("message", "Not permission!");
//   //           done();
//   //         } catch (error) {
//   //           done(error);
//   //         }
//   //       });
//   //   });
// });

// describe("POST /REGISTER TRANSPORTATION SCHOOL", () => {
//   // it("UTCID01: should return transport application created successfully!", (done) => {
//   //   chai.request
//   //     .execute(app)
//   //     .post("/register-transport")
//   //     .set("Authorization", `Bearer ${token}`)
//   //     .send({
//   //       userId: "66fcbe67cfe0eae741dcf5c5",
//   //       childId: "670d2d758256f3c1802a7f84",
//   //       address: "456 Nguyen Cong Tru St, Da Nang",
//   //       startTime: "2024",
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
//   //           "Transport application created successfully!"
//   //         );
//   //         done();
//   //       } catch (error) {
//   //         done(error);
//   //       }
//   //     });
//   // });

//   it("UTCID02: should return transport application null childID", (done) => {
//     chai.request
//       .execute(app)
//       .post("/register-transport")
//       .set("Authorization", `Bearer ${token}`)
//       .send({
//         userId: "66fcbe67cfe0eae741dcf5c5",
//         childId: "",
//         address: "456 Nguyen Cong Tru St, Da Nang",
//         startTime: "2024",
//       })
//       .end((err, res) => {
//         try {
//           if (err) {
//             throw err;
//           }
//           console.log("Res.body", res.body);
//           expect(res.body).to.have.property("status", 400);
//           expect(res.body).to.have.property(
//             "message",
//             "userId, childId, address, and startTime are required"
//           );
//           done();
//         } catch (error) {
//           done(error);
//         }
//       });
//   });

//   it("UTCID03: should return transport application null users", (done) => {
//     chai.request
//       .execute(app)
//       .post("/register-transport")
//       .set("Authorization", `Bearer ${token}`)
//       .send({
//         userId: "",
//         childId: "670d2d758256f3c1802a7f84",
//         address: "456 Nguyen Cong Tru St, Da Nang",
//         startTime: "2024",
//       })
//       .end((err, res) => {
//         try {
//           if (err) {
//             throw err;
//           }
//           console.log("Res.body", res.body);
//           expect(res.body).to.have.property("status", 400);
//           expect(res.body).to.have.property(
//             "message",
//             "userId, childId, address, and startTime are required"
//           );
//           done();
//         } catch (error) {
//           done(error);
//         }
//       });
//   });

//   it("UTCID04: should return transport application missing authorization header", (done) => {
//     chai.request
//       .execute(app)
//       .post("/register-transport")
//       // .set("Authorization", `Bearer ${token}`)
//       .send({
//         userId: "66fcbe67cfe0eae741dcf5c5",
//         childId: "670d2d758256f3c1802a7f84",
//         address: "456 Nguyen Cong Tru St, Da Nang",
//         startTime: "2024",
//       })
//       .end((err, res) => {
//         try {
//           if (err) {
//             throw err;
//           }
//           console.log("Res.body", res.body);
//           expect(res.body).to.have.property("status", 401);
//           expect(res.body).to.have.property(
//             "message",
//             "Missing authorization header"
//           );
//           done();
//         } catch (error) {
//           done(error);
//         }
//       });
//   });

//   it("UTCID05: should return transport application not permission", (done) => {
//     chai.request
//       .execute(app)
//       .post("/register-transport")
//       .set("Authorization", `Bearer ${teachertoken}`)
//       .send({
//         userId: "66fcbe67cfe0eae741dcf5c5",
//         childId: "670d2d758256f3c1802a7f84",
//         address: "456 Nguyen Cong Tru St, Da Nang",
//         startTime: "2024",
//       })
//       .end((err, res) => {
//         try {
//           if (err) {
//             throw err;
//           }
//           console.log("Res.body", res.body);
//           expect(res.body).to.have.property("status", 403);
//           expect(res.body).to.have.property("message", "Not permission!");
//           done();
//         } catch (error) {
//           done(error);
//         }
//       });
//   });
// });

//   describe("GET /VIEW LIST REGISTER TRANSPORTATION", () => {
//     it("UTCID01: should return view list register transportation fetched history register successfully", (done) => {
//       chai.request
//         .execute(app)
//         .get("/get-all-transport")
//         .set("Authorization", `Bearer ${stafftoken}`)
//         .end((err, res) => {
//           try {
//             if (err) {
//               throw err;
//             }
//             console.log("Res.body", res.body);
//             expect(res.body).to.have.property("status", 200);
//             expect(res.body).to.have.property(
//               "message",
//               "Fetched history register successfully"
//             );
//             done();
//           } catch (error) {
//             done(error);
//           }
//         });
//     });

//   it("UTCID02: should return transport missing authorization header", (done) => {
//     chai.request
//       .execute(app)
//       .get("/get-all-transport")
//       // .set("Authorization", `Bearer ${stafftoken}`)
//       .end((err, res) => {
//         try {
//           if (err) {
//             throw err;
//           }
//           console.log("Res.body", res.body);
//           expect(res.body).to.have.property("status", 401);
//           expect(res.body).to.have.property(
//             "message",
//             "Missing authorization header"
//           );
//           done();
//         } catch (error) {
//           done(error);
//         }
//       });
//   });

//   it("UTCID03: should return transport not permission", (done) => {
//     chai.request
//       .execute(app)
//       .get("/get-all-transport")
//       .set("Authorization", `Bearer ${teachertoken}`)
//       .end((err, res) => {
//         try {
//           if (err) {
//             throw err;
//           }
//           console.log("Res.body", res.body);
//           expect(res.body).to.have.property("status", 403);
//           expect(res.body).to.have.property("message", "Not permission!");
//           done();
//         } catch (error) {
//           done(error);
//         }
//       });
//   });
// });

//   describe("GET /VIEW HISTORY REGISTER TRANSPORTATION", () => {
//     it("UTCID01: should return transport fetched history register successfully", (done) => {
//       chai.request
//         .execute(app)
//         .get("/get-transport")
//         .set("Authorization", `Bearer ${token}`)
//         .send({
//           userId: "66fcbe67cfe0eae741dcf5c5",
//         })
//         .end((err, res) => {
//           try {
//             if (err) {
//               throw err;
//             }
//             console.log("Res.body", res.body);
//             expect(res.body).to.have.property("status", 200);
//             expect(res.body).to.have.property(
//               "message",
//               "Fetched history register successfully"
//             );
//             done();
//           } catch (error) {
//             done(error);
//           }
//         });
//     });

// it("UTCID03: should return view history missing header", (done) => {
//   chai.request
//     .execute(app)
//     .get("/get-transport")
//     // .set("Authorization", `Bearer ${stafftoken}`)
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

// it("UTCID04: should return view history not permission", (done) => {
//   chai.request
//     .execute(app)
//     .get("/get-transport")
//     .set("Authorization", `Bearer ${teachertoken}`)
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
//   });
// });
