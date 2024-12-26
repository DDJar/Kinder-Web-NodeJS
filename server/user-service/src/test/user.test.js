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
//   const invalid_token = "670de9da1d7f545256e5ee68";

//   describe("POST /login", () => {
//     it("Login to get token ADMIN", (done) => {
//       chai.request
//         .execute(app)
//         .post("/login")
//         .send({ username: "admin@gmail.com", password: "1234567890" })
//         .end((err, res) => {
//           try {
//             if (err) {
//               throw err;
//             }
//             expect(res.body).to.have.property("status", 200);
//             expect(res.body).to.have.property("message", "Login successfully!");
//             expect(res.body).to.have.property("token");
//             admintoken = res.body.token;
//             const decoded = jwt.verify(admintoken, jwtSecret);
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

// it("Login to get token STAFF", (done) => {
//   chai.request
//     .execute(app)
//     .post("/login")
//     .send({ username: "staff@gmail.com", password: "1234567890" })
//     .end((err, res) => {
//       try {
//         if (err) {
//           throw err;
//         }
//         expect(res.body).to.have.property("status", 200);
//         expect(res.body).to.have.property("message", "Login successfully!");
//         expect(res.body).to.have.property("token");
//         stafftoken = res.body.token;
//         const decoded = jwt.verify(stafftoken, jwtSecret);
//         staff = {
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

// it("Login to get token blocker", (done) => {
//   chai.request
//     .execute(app)
//     .post("/login")
//     .send({ username: "test15@gmail.com", password: "1234567890" })
//     .end((err, res) => {
//       try {
//         if (err) {
//           throw err;
//         }
//         expect(res.body).to.have.property("status", 200);
//         expect(res.body).to.have.property("message", "Login successfully!");
//         expect(res.body).to.have.property("token");
//         blocktoken = res.body.token;
//         const decoded = jwt.verify(blocktoken, jwtSecret);
//         blocker = {
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
//   });

// describe("GET /get-users", () => {
//   it("UTCID 01: should return a list of USER", (done) => {
//     chai.request
//       .execute(app)
//       .get("/get-users?role=ADMIN&tab=1")
//       .set("Authorization", `Bearer ${admintoken}`)
//       .end((err, res) => {
//         try {
//           if (err) {
//             throw err;
//           }
//           console.log("res.body ", res.body);

//           expect(res.body).to.have.property("status", 200);
//           expect(res.body).to.have.property("data");
//           expect(res.body).to.have.property(
//             "message",
//             "Users fetched successfully"
//           );
//           done();
//         } catch (error) {
//           done(error);
//         }
//       });
//   });

//   it("UTCID 02: should return a list of USER when empty role and type", (done) => {
//     chai.request
//       .execute(app)
//       .get("/get-users")
//       .set("Authorization", `Bearer ${admintoken}`)
//       .end((err, res) => {
//         try {
//           if (err) {
//             throw err;
//           }
//           console.log("res.body ", res.body);

//           expect(res.body).to.have.property("status", 200);
//           expect(res.body).to.have.property("data");
//           expect(res.body).to.have.property(
//             "message",
//             "Users fetched successfully"
//           );
//           done();
//         } catch (error) {
//           done(error);
//         }
//       });
//   });

//   it("UTCID 03: should return Not permission!", (done) => {
//     chai.request
//       .execute(app)
//       .get("/get-users?role=ADMIN&tab=1")
//       .set("Authorization", `Bearer ${teachertoken}`)
//       .end((err, res) => {
//         try {
//           if (err) {
//             throw err;
//           }
//           console.log("res.body ", res.body);

//           expect(res.body).to.have.property("status", 403);
//           expect(res.body).to.have.property("message", "Not permission!");
//           done();
//         } catch (error) {
//           done(error);
//         }
//       });
//   });

//   it("UTCID 04: should return Missing Token", (done) => {
//     chai.request
//       .execute(app)
//       .get("/get-users?role=ADMIN&tab=1")
//       .set("Authorization", `Bearer`)
//       .end((err, res) => {
//         try {
//           if (err) {
//             throw err;
//           }
//           console.log("res.body ", res.body);

//           expect(res.body).to.have.property("status", 401);
//           expect(res.body).to.have.property("message", "Missing Token");
//           done();
//         } catch (error) {
//           done(error);
//         }
//       });
//   });

//   // it("should return a list of Teacher mà khong phai admin", (done) => {
//   //   chai.request
//   //     .execute(app)
//   //     .get("/get-users?role=TEACHER&tab=1")
//   //     .set("Authorization", `Bearer abc`)
//   //     .end((err, res) => {
//   //       try {
//   //         if (err) {
//   //           throw err;
//   //         }
//   //         console.log("res.body ", res.body);

//   //         expect(res.body).to.have.property("status", 401);
//   //         expect(res.body).to.have.property("message", "jwt malformed");
//   //         done();
//   //       } catch (error) {
//   //         done(error);
//   //       }
//   //     });
//   // });

//   // it("should return a list ADMIN mà người get co role USER", (done) => {
//   //   var token2 = "";
//   //   chai.request
//   //     .execute(app)
//   //     .post("/login")
//   //     .send({ username: "test12@gmail.com", password: "1234567890" })
//   //     .end((err, res) => {
//   //       try {
//   //         if (err) {
//   //           throw err;
//   //         }

//   //         token2 = res.body.token;
//   //         token2 = "";
//   //         chai.request
//   //           .execute(app)
//   //           .get("/get-users?role=ADMIN&tab=1")
//   //           .set("Authorization", `Bearer ${token2}`)
//   //           .end((err, res) => {
//   //             try {
//   //               if (err) {
//   //                 throw err;
//   //               }

//   //               expect(res.body).to.have.property("code", 401);
//   //               // expect(res.body).to.have.property("status", 401);
//   //               done();
//   //             } catch (error) {
//   //               done(error);
//   //             }
//   //           });
//   //         expect(res).to.have.status(200);
//   //         expect(res.body).to.have.property("data");
//   //         expect(res.body.data).to.be.an("object");
//   //         expect(res.body.data.users).to.be.an("array");
//   //         expect(res.body).to.have.property(
//   //           "message",
//   //           "Users fetched successfully"
//   //         );
//   //         done();
//   //       } catch (error) {
//   //         done(error);
//   //       }
//   //     });
//   // });

//   // it("should return a list of users not have query", (done) => {
//   //   chai.request
//   //     .execute(app)
//   //     .get("/get-users")
//   //     .set("Authorization", `Bearer ${admintoken}`)
//   //     .end((err, res) => {
//   //       try {
//   //         if (err) {
//   //           throw err;
//   //         }
//   //         console.log(res.body);
//   //         expect(res).to.have.status(200);
//   //         expect(res.body).to.have.property("data");
//   //         expect(res.body.data).to.be.an("object");
//   //         expect(res.body.data.users).to.be.an("array");
//   //         expect(res.body).to.have.property(
//   //           "message",
//   //           "Users fetched successfully"
//   //         );
//   //         done();
//   //       } catch (error) {
//   //         done(error);
//   //       }
//   //     });
//   // });
// });

//   describe("UPDATE /update-user", () => {
//     it("should return a users have update", (done) => {
//       chai.request
//         .execute(app)
//         .put("/update-user/" + user._id)
//         .send({
//           firstName: "John",
//           lastName: "Doe",
//           username: "test@gmail.com",
//           email: "test@gmail.com",
//           phone: "",
//           role: "ADMIN",
//         })
//         .end((err, res) => {
//           try {
//             if (err) {
//               throw err;
//             }
//             expect(res).to.have.status(200);
//             expect(res.body).to.have.property("data");
//             expect(res.body.data).to.have.property("user");
//             expect(res.body.data.user).to.include({
//               firstName: "John",
//               lastName: "Doe",
//               username: "test@gmail.com",
//               email: "test@gmail.com",
//               phone: "",
//               role: "ADMIN",
//             });
//             done();
//           } catch (error) {
//             done(error);
//           }
//         });
//     });
//   });

// describe("PUT /lock-user/:userId", () => {
//   it("UTCID01: User with ID updated successfully", (done) => {
//     chai.request
//       .execute(app)
//       .put("/lock-user/" + blocker._id)
//       .set("Authorization", `Bearer ${admintoken}`)
//       .send({ role: "BLOCK" })
//       .end((err, res) => {
//         console.log("Response body:", res.body);
//         try {
//           if (err) {
//             throw err;
//           }
//           expect(res.body).to.have.property("status", 200);
//           expect(res.body).to.have.property(
//             "message",
//             `User with ID ${blocker._id} updated successfully`
//           );
//           expect(res.body.data).to.have.property("user");
//           expect(res.body.data.user).to.include({
//             role: "BLOCK",
//           });
//           done();
//         } catch (error) {
//           done(error);
//         }
//       });
//   });

//   it("UTCID02: should return 404 have userId  with ID  not found", (done) => {
//     chai.request
//       .execute(app)
//       .put("/lock-user/" + blocker._id)
//       .set("Authorization", `Bearer ${admintoken}`)
//       .send({ role: "" })
//       .end((err, res) => {
//         console.log("Response body:", res.body);
//         try {
//           if (err) {
//             throw err;
//           }
//           console.log("res.body", res.body);

//           expect(res.body).to.have.property("status", 404);
//           expect(res.body).to.have.property(
//             "message",
//             "User with ID not found"
//           );
//           done();
//         } catch (error) {
//           done(error);
//         }
//       });
//   });

//   it("UTCID03: should return 404 user with ID not found", (done) => {
//     chai.request
//       .execute(app)
//       .put("/lock-user/null")
//       .set("Authorization", `Bearer ${admintoken}`)
//       .send({ role: "BLOCK" })
//       .end((err, res) => {
//         console.log("Response body:", res.body);
//         try {
//           if (err) {
//             throw err;
//           }

//           expect(res.body).to.have.property("status", 404);
//           expect(res.body).to.have.property(
//             "message",
//             `User with ID not found`
//           );
//           // expect(res.body.data).to.have.property("");
//           // expect(res.body.data.user).to.include({
//           //   role: "BLOCK",
//           // });
//           done();
//         } catch (error) {
//           done(error);
//         }
//       });
//   });

//   it("UTCID04: should return 403 Not permission!", (done) => {
//     chai.request
//       .execute(app)
//       .put("/lock-user/" + blocker._id)
//       .set("Authorization", `Bearer ${teachertoken}`)
//       .send({ role: "BLOCK" })
//       .end((err, res) => {
//         console.log("Response body:", res.body);
//         try {
//           if (err) {
//             throw err;
//           }

//           //sửa expected code: 403 thành status
//           expect(res.body).to.have.property("status", 401);
//           expect(res.body).to.have.property("message", `Not permission!`);
//           // expect(res.body.data).to.have.property("user");
//           // expect(res.body.data.user).to.include({
//           //   role: "BLOCK",
//           // });
//           done();
//         } catch (error) {
//           done(error);
//         }
//       });
//   });

//   it("UTCID05: should return 401 Missing Token", (done) => {
//     chai.request
//       .execute(app)
//       .put("/lock-user/670d06f8bc10772d33e71009")
//       //   .set("Authorization", `Bearer ${teachertoken}`)
//       .send({ role: "BLOCK" })
//       .end((err, res) => {
//         console.log("Response body:", res.body);
//         try {
//           if (err) {
//             throw err;
//           }

//           //sửa expected code: 401 thành status
//           expect(res.body).to.have.property("status", 401);
//           expect(res.body).to.have.property(
//             "message",
//             `Missing authorization header`
//           );
//           // expect(res.body.data).to.have.property("user");
//           // expect(res.body.data.user).to.include({
//           //   role: "BLOCK",
//           // });
//           done();
//         } catch (error) {
//           done(error);
//         }
//       });
//   });
// });

// describe("CHANGE PASSWORD", () => {
//template
// it("should return a users have update", (done) => {
//   chai.request
//     .execute(app)
//     .put("/update-user/" + user._id)
//     .send({
//       firstName: "John",
//       lastName: "Doe",
//       username: "test@gmail.com",
//       email: "test@gmail.com",
//       phone: "",
//       role: "ADMIN",
//     })
//     .end((err, res) => {
//       try {
//         if (err) {
//           throw err;
//         }
//         expect(res).to.have.status(200);
//         expect(res.body).to.have.property("data");
//         expect(res.body.data).to.have.property("user");
//         expect(res.body.data.user).to.include({
//           firstName: "John",
//           lastName: "Doe",
//           username: "test@gmail.com",
//           email: "test@gmail.com",
//           phone: "",
//           role: "ADMIN",
//         });
//         done();
//       } catch (error) {
//         done(error);
//       }
//     });
// });

// it("UTCID 01: should return successfully change password when all inputs are valid", (done) => {
//   chai.request
//     .execute(app)
//     .put("/profile/change-password")
//     .set("Authorization", `Bear ${token}`)
//     .send({
//       currentPassword: "",
//       newPassword: "1234567890",
//       confirmPassword: "1234567890",
//     })
//     .end((err, res) => {
//       try {
//         if (err) {
//           throw err;
//         }
//         console.log("res.body", res.body);
//         expect(res.body).to.have.property("status", 200);
//         expect(res.body.data).to.have.property("user");
//         done();
//       } catch (error) {
//         done(error);
//       }
//     });
// });

//lỗi chưa confirm new pass, chưa đồng nhất message trên unit test
// it("UTCID 02: should return invalid password when wrong password", (done) => {
//   chai.request
//     .execute(app)
//     .put("/profile/change-password")
//     .set("Authorization", `Bear ${token}`)
//     .send({
//       currentPassword: "1234567890",
//       newPassword: "1234567890",
//       confirmPassword: "123456",
//     })
//     .end((err, res) => {
//       try {
//         if (err) {
//           throw err;
//         }
//         console.log("res.body", res.body);
//         expect(res.body).to.have.property("status", 400);
//         expect(res.body).to.have.property(
//           "message",
//           "Current password is incorrect"
//         );
//         expect(res.body.data).to.have.property("user");
//         done();
//       } catch (error) {
//         done(error);
//       }
//     });
// });

//chưa check confirm rỗng
// it("UTCID 03: should return invalid password when null confirm password", (done) => {
//   chai.request
//     .execute(app)
//     .put("/profile/change-password")
//     .set("Authorization", `Bear ${token}`)
//     .send({
//       currentPassword: "1234567890",
//       newPassword: "1234567890",
//       confirmPassword: "",
//     })
//     .end((err, res) => {
//       try {
//         if (err) {
//           throw err;
//         }
//         console.log("res.body", res.body);
//         expect(res.body).to.have.property("status", 400);
//         expect(res.body).to.have.property(
//           "message",
//           "Current password is incorrect"
//         );
//         expect(res.body.data).to.have.property("user");
//         done();
//       } catch (error) {
//         done(error);
//       }
//     });
// });

// chưa validate khi để null new password thì lại cập nhật thành công
// it("UTCID 04: should return invalid password when null new password", (done) => {
//   chai.request
//     .execute(app)
//     .put("/profile/change-password")
//     .set("Authorization", `Bear ${token}`)
//     .send({
//       currentPassword: "1234567890",
//       newPassword: null,
//       confirmPassword: "1234567890",
//     })
//     .end((err, res) => {
//       try {
//         if (err) {
//           throw err;
//         }
//         console.log("res.body", res.body);
//         expect(res.body).to.have.property("status", 400);
//         expect(res.body).to.have.property(
//           "message",
//           "Current password is incorrect"
//         );
//         expect(res.body.data).to.have.property("user");
//         done();
//       } catch (error) {
//         done(error);
//       }
//     });
// });

// it("UTCID 05: should return invalid password when wrong current", (done) => {
//   chai.request
//     .execute(app)
//     .put("/profile/change-password")
//     .set("Authorization", `Bear ${token}`)
//     .send({
//       currentPassword: "1234567890abc",
//       newPassword: "1234567890",
//       confirmPassword: "1234567890",
//     })
//     .end((err, res) => {
//       try {
//         if (err) {
//           throw err;
//         }
//         console.log("res.body", res.body);
//         expect(res.body).to.have.property("status", 400);
//         expect(res.body).to.have.property(
//           "message",
//           "Current password is incorrect"
//         );
//         done();
//       } catch (error) {
//         done(error);
//       }
//     });
// });

// thêm một check null cho current pass
// it("UTCID 06: should return invalid password when null current", (done) => {
//   chai.request
//     .execute(app)
//     .put("/profile/change-password")
//     .set("Authorization", `Bear ${token}`)
//     .send({
//       currentPassword: "",
//       newPassword: "1234567890",
//       confirmPassword: "1234567890",
//     })
//     .end((err, res) => {
//       try {
//         if (err) {
//           throw err;
//         }
//         console.log("res.body", res.body);
//         expect(res.body).to.have.property("status", 400);
//         expect(res.body).to.have.property(
//           "message",
//           "Current password is incorrect"
//         );
//         done();
//       } catch (error) {
//         done(error);
//       }
//     });
// });

//khi trả về phải trẻ về status -> đang trả về code
//   it("UTCID 07: should return missing header", (done) => {
//     chai.request
//       .execute(app)
//       .put("/profile/change-password")
//       // .set("Authorization", `Bear ${token}`)
//       .send({
//         currentPassword: "1234567890",
//         newPassword: "1234567890",
//         confirmPassword: "1234567890",
//       })
//       .end((err, res) => {
//         try {
//           if (err) {
//             throw err;
//           }
//           console.log("res.body", res.body);
//           expect(res.body).to.have.property("code", 401);
//           expect(res.body).to.have.property(
//             "message",
//             "Missing authorization header"
//           );
//           // expect(res.body.data).to.have.property("user");
//           done();
//         } catch (error) {
//           done(error);
//         }
//       });
//   });
// });

// describe("POST /PROCESS REGISTER FOR SCHOOL", () => {
//   it("UTCID01: should return a users have update", (done) => {
//     chai.request
//       .execute(app)
//       .post("/process-register-for-school")
//       .set("Authorization", `Bearer ${stafftoken}`)
//       .send({
//         admissionApplicationId: "67177ae71aaca5fb5133e18e",
//         status: "ACTIVE",
//         noteByStaff: "Hẹn gặp phụ huynh và trẻ tại trường lúc 7h 25/10/2024",
//       })
//       .end((err, res) => {
//         try {
//           if (err) {
//             throw err;
//           }
//           console.log("Res.body", res.body);

//           expect(res.body).to.have.property("status", 200);
//           // expect(res.body).to.have.property("data");
//           // expect(res.body.data).to.have.property("user");
//           expect(res.body).to.have.property(
//             "message",
//             "Processing successfully!"
//           );

//           done();
//         } catch (error) {
//           done(error);
//         }
//       });
//   });

//   it("UTCID02: should return admissionApplicationId null", (done) => {
//     chai.request
//       .execute(app)
//       .post("/process-register-for-school")
//       .set("Authorization", `Bearer ${stafftoken}`)
//       .send({
//         admissionApplicationId: "",
//         status: "ACTIVE",
//         noteByStaff: "Hẹn gặp phụ huynh và trẻ tại trường lúc 7h 25/10/2024",
//       })
//       .end((err, res) => {
//         try {
//           if (err) {
//             throw err;
//           }
//           console.log("Res.body", res.body);

//           expect(res.body).to.have.property("status", 404);
//           // expect(res.body).to.have.property("data");
//           // expect(res.body.data).to.have.property("user");
//           expect(res.body).to.have.property(
//             "message",
//             "Adnission spplication with ID  not found"
//           );

//           done();
//         } catch (error) {
//           done(error);
//         }
//       });
//   });

//   it("UTCID03: should return id wrong ", (done) => {
//     chai.request
//       .execute(app)
//       .post("/process-register-for-school")
//       .set("Authorization", `Bearer ${stafftoken}`)
//       .send({
//         admissionApplicationId: "123",
//         status: "ACTIVE",
//         noteByStaff: "Hẹn gặp phụ huynh và trẻ tại trường lúc 7h 25/10/2024",
//       })
//       .end((err, res) => {
//         try {
//           if (err) {
//             throw err;
//           }
//           console.log("Res.body", res.body);

//           expect(res.body).to.have.property("status", 404);
//           // expect(res.body).to.have.property("data");
//           // expect(res.body.data).to.have.property("user");
//           expect(res.body).to.have.property(
//             "message",
//             "Adnission spplication with ID 123 not found"
//           );

//           done();
//         } catch (error) {
//           done(error);
//         }
//       });
//   });

//   it("UTCID04: should return status null ", (done) => {
//     chai.request
//       .execute(app)
//       .post("/process-register-for-school")
//       .set("Authorization", `Bearer ${stafftoken}`)
//       .send({
//         admissionApplicationId: "67177ae71aaca5fb5133e18e",
//         status: "",
//         noteByStaff: "Hẹn gặp phụ huynh và trẻ tại trường lúc 7h 25/10/2024",
//       })
//       .end((err, res) => {
//         try {
//           if (err) {
//             throw err;
//           }
//           console.log("Res.body", res.body);

//           expect(res.body).to.have.property("status", 404);
//           // expect(res.body).to.have.property("data");
//           // expect(res.body.data).to.have.property("user");
//           expect(res.body).to.have.property("message", "Status not found");

//           done();
//         } catch (error) {
//           done(error);
//         }
//       });
//   });

//   it("UTCID05: should return diff role", (done) => {
//     chai.request
//       .execute(app)
//       .post("/process-register-for-school")
//       .set("Authorization", `Bearer ${teachertoken}`)
//       .send({
//         admissionApplicationId: "67177ae71aaca5fb5133e18e",
//         status: "ACTIVE",
//         noteByStaff: "Hẹn gặp phụ huynh và trẻ tại trường lúc 7h 25/10/2024",
//       })
//       .end((err, res) => {
//         try {
//           if (err) {
//             throw err;
//           }
//           console.log("Res.body", res.body);

//           expect(res.body).to.have.property("status", 403);
//           // expect(res.body).to.have.property("data");
//           // expect(res.body.data).to.have.property("user");
//           expect(res.body).to.have.property("message", "Not permission!");

//           done();
//         } catch (error) {
//           done(error);
//         }
//       });
//   });

//   it("UTCID06: should return missing header", (done) => {
//     chai.request
//       .execute(app)
//       .post("/process-register-for-school")
//       // .set("Authorization", `Bearer ${teachertoken}`)
//       .send({
//         admissionApplicationId: "67177ae71aaca5fb5133e18e",
//         status: "ACTIVE",
//         noteByStaff: "Hẹn gặp phụ huynh và trẻ tại trường lúc 7h 25/10/2024",
//       })
//       .end((err, res) => {
//         try {
//           if (err) {
//             throw err;
//           }
//           console.log("Res.body", res.body);

//           expect(res.body).to.have.property("status", 401);
//           // expect(res.body).to.have.property("data");
//           // expect(res.body.data).to.have.property("user");
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
// });

//   describe("POST /REGISTER FOR SCHOOL", () => {
//     it("UTCID01: should return admission application created successfully", (done) => {
//       chai.request
//         .execute(app)
//         .post("/children/668bd94f445c2856f61d6824/register")
//         .set("Authorization", `Bearer ${token}`)
//         .send({
//           userId: "67068f2111ca9cbf51da195b",
//           childId: "668bd94f445c2856f61d6824",
//           startTime: 2024,
//         })
//         .end((err, res) => {
//           try {
//             if (err) {
//               throw err;
//             }
//             console.log("Res.body", res.body);

//             expect(res.body).to.have.property("status", 200);
// expect(res.body).to.have.property("data");
// expect(res.body.data).to.have.property("user");
//         expect(res.body).to.have.property(
//           "message",
//           "Admission application created successfully!"
//         );

//         done();
//       } catch (error) {
//         done(error);
//       }
//     });
// });

// it("UTCID02: should return childId is required or invalid", (done) => {
//   chai.request
//     .execute(app)
//     .post("/children/null/register")
//     .set("Authorization", `Bearer ${token}`)
//     .send({
//       userId: "67068f2111ca9cbf51da195b",
//       childId: "",
//       startTime: 2024,
//     })
//     .end((err, res) => {
//       try {
//         if (err) {
//           throw err;
//         }
//         console.log("Res.body", res.body);

//         expect(res.body).to.have.property("status", 400);
//         expect(res.body).to.have.property(
//           "message",
//           "ParentId is required,childId is required or invalid"
//         );

//         done();
//       } catch (error) {
//         done(error);
//       }
//     });
// });

// it("UTCID03: should return ParentId is required or invalid", (done) => {
//   chai.request
//     .execute(app)
//     .post("/children/668bd94f445c2856f61d6824/register")
//     .set("Authorization", `Bearer ${token}`)
//     .send({
//       userId: "",
//       childId: "668bd94f445c2856f61d6824",
//       startTime: 2024,
//     })
//     .end((err, res) => {
//       try {
//         if (err) {
//           throw err;
//         }
//         console.log("Res.body", res.body);

//         expect(res.body).to.have.property("status", 400);
//         // expect(res.body).to.have.property("data");
//         // expect(res.body.data).to.have.property("user");
//         expect(res.body).to.have.property(
//           "message",
//           "ParentId is required,childId is required or invalid"
//         );

//         done();
//       } catch (error) {
//         done(error);
//       }
//     });
// });

// it("UTCID04: should return status null ", (done) => {
//   chai.request
//     .execute(app)
//     .post("/children/668bd94f445c2856f61d6824/register")
//     // .set("Authorization", `Bearer ${token}`)
//     .send({
//       userId: "67068f2111ca9cbf51da195b",
//       childId: "668bd94f445c2856f61d6824",
//       startTime: 2024,
//     })
//     .end((err, res) => {
//       try {
//         if (err) {
//           throw err;
//         }
//         console.log("Res.body", res.body);

//         expect(res.body).to.have.property("status", 401);
//         // expect(res.body).to.have.property("data");
//         // expect(res.body.data).to.have.property("user");
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

// it("UTCID05: should return diff role", (done) => {
//   chai.request
//     .execute(app)
//     .post("/process-register-for-school")
//     .set("Authorization", `Bearer ${teachertoken}`)
//     .send({
//       admissionApplicationId: "67177ae71aaca5fb5133e18e",
//       status: "ACTIVE",
//       noteByStaff: "Hẹn gặp phụ huynh và trẻ tại trường lúc 7h 25/10/2024",
//     })
//     .end((err, res) => {
//       try {
//         if (err) {
//           throw err;
//         }
//         console.log("Res.body", res.body);

//         expect(res.body).to.have.property("status", 403);
//         // expect(res.body).to.have.property("data");
//         // expect(res.body.data).to.have.property("user");
//         expect(res.body).to.have.property("message", "Not permission!");

//         done();
//       } catch (error) {
//         done(error);
//       }
//     });
// });

// describe("PUT /UPDATE PROFILE", () => {
//   it("UTCID 01: should return a users have update", (done) => {
//     chai.request
//       .execute(app)
//       .put("/update-profile/")
//       .set("Authorization", `Bearer ${token}`)
//       .send({
//         firstName: "John",
//         lastName: "Doe",
//         username: "test11@gmail.com",
//         email: "test11@gmail.com",
//         address: "Phước Lý 9, Hoà Minh, Liên Chiểu, Đà Nẵng",
//         phone: "0984044043",
//         role: "USER",
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
//             "User with ID 6708ddd4a2e201442143328b updated successfully"
//           );
//           expect(res.body).to.have.property("data");
//           expect(res.body.data).to.have.property("user");
//           expect(res.body.data.user).to.include({
//             firstName: "John",
//             lastName: "Doe",
//             username: "test11@gmail.com",
//             email: "test11@gmail.com",
//             address: "Phước Lý 9, Hoà Minh, Liên Chiểu, Đà Nẵng",
//             phone: "0984044043",
//             role: "USER",
//           });
//           done();
//         } catch (error) {
//           done(error);
//         }
//       });
//   });

//   it("UTCID 02: should return an error when fields are null or empty", (done) => {
//     chai.request
//       .execute(app)
//       .put("/update-profile/")
//       .set("Authorization", `Bearer ${token}`)
//       .send({
//         firstName: null,
//         lastName: null,
//         username: null,
//         email: null,
//         address: null,
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
//             "User with ID 6708ddd4a2e201442143328b updated successfully"
//           );
//           done();
//         } catch (error) {
//           done(error);
//         }
//       });
//   });

//   it("UTCID 03: should return an error when permission to access this profile", (done) => {
//     chai.request
//       .execute(app)
//       .put("/update-profile/")
//       .set("Authorization", `Bearer ${invalid_token}`)
//       .send({
//         firstName: "John",
//         lastName: "Doe",
//         username: "test11@gmail.com",
//         email: "test11@gmail.com",
//         address: "Phước Lý 9, Hoà Minh, Liên Chiểu, Đà Nẵng",
//         phone: "0984044043",
//         role: "USER",
//       })
//       .end((err, res) => {
//         try {
//           if (err) {
//             throw err;
//           }
//           console.log("Res.body", res.body);
//           expect(res.body).to.have.property("status", 401);
//           expect(res.body).to.have.property("message", "Wrong token!");
//           done();
//         } catch (error) {
//           done(error);
//         }
//       });
//   });

//   it("UTCID 04: should return an error when missing header", (done) => {
//     chai.request
//       .execute(app)
//       .put("/update-profile/")
// .set("Authorization", `Bearer ${token}`)
//       .send({
//         firstName: "John",
//         lastName: "Doe",
//         username: "test11@gmail.com",
//         email: "test11@gmail.com",
//         address: "Phước Lý 9, Hoà Minh, Liên Chiểu, Đà Nẵng",
//         phone: "0984044043",
//         role: "USER",
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
// });

// describe("GET /VIEW CHILD PROFILE", () => {
// it("UTCID 01: should return a view child profile", (done) => {
//   chai.request
//     .execute(app)
//     .get("/children/672634197b07fbc1acdf65b4")
//     .set("Authorization", `Bearer ${token}`)
//     .end((err, res) => {
//       try {
//         if (err) {
//           throw err;
//         }
//         console.log("Res.body", res.body);
//         expect(res.body).to.have.property("status", 200);
//         expect(res.body).to.have.property(
//           "message",
//           "Child fetched successfully!"
//         );
//         done();
//       } catch (error) {
//         done(error);
//       }
//     });
// });
// it("UTCID 02: should return a view child profile error parentId invalid", (done) => {
//   chai.request
//     .execute(app)
//     .get("/children/672634197b07fbc1acdf65b5")
//     .set("Authorization", `Bearer ${invalid_token}`)
//     .end((err, res) => {
//       try {
//         if (err) {
//           throw err;
//         }
//         console.log("Res.body", res.body);
//         expect(res.body).to.have.property("status", 401);
//         expect(res.body).to.have.property("message", "Wrong token!");
//         done();
//       } catch (error) {
//         done(error);
//       }
//     });
// });
// it("UTCID 03: should return a view child profile error null", (done) => {
//   chai.request
//     .execute(app)
//     .get("/children/672634197b07fbc1acdf65b5")
//     .set("Authorization", `Bearer ${token}`)
//     .end((err, res) => {
//       try {
//         if (err) {
//           throw err;
//         }
//         console.log("Res.body", res.body);
//         expect(res.body).to.have.property("status", 400);
//         expect(res.body).to.have.property("message", "Child not found");
//         done();
//       } catch (error) {
//         done(error);
//       }
//     });
// });
// it("UTCID 04: should return a view child profile error null", (done) => {
//   chai.request
//     .execute(app)
//     .get("/children/672634197b07fbc1acdf65b4")
//     .set("Authorization", `Bearer ${invalid_token}`)
//     .end((err, res) => {
//       try {
//         if (err) {
//           throw err;
//         }
//         console.log("Res.body", res.body);
//         expect(res.body).to.have.property("status", 401);
//         expect(res.body).to.have.property("message", "Wrong token!");
//         done();
//       } catch (error) {
//         done(error);
//       }
//     });
// });
// it("UTCID 05: should return a view child not permission", (done) => {
//   chai.request
//     .execute(app)
//     .get("/children/672634197b07fbc1acdf65b4")
//     .set("Authorization", `Bearer ${stafftoken}`)
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
// it("UTCID 06: should return a view child profile error null", (done) => {
//   chai.request
//     .execute(app)
//     .get("/children/672634197b07fbc1acdf65b4")
//     //   .set("Authorization", `Bearer ${token}`)
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
// });

// describe("PUT /UPDATE CHILD PROFILE", () => {
//   // it("UTCID 01: should return a update child profile", (done) => {
//   //   chai.request
//   //     .execute(app)
//   //     .put("/children/672634197b07fbc1acdf65b4")
//   //     .set("Authorization", `Bearer ${token}`)
//   //     .send({
//   //       firstName: "Nguyễn",
//   //       lastName: "Dungd",
//   //       dateOfBirth: "1/1/2019",
//   //       favourite: "Hát,Múa",
//   //       avatar:
//   //         "https://kinderstorageblob.blob.core.windows.net/kinderblobby/hinh-kham-suc-khoe.jpg?sv=2022-11-02&ss=b&srt=sco&sp=rwlactfx&se=2024-10-23T22:52:54Z&st=2024-10-23T14:52:54Z&spr=https,http&sig=Fc9rDz7rf0pFMLFlB4FkdvN2ybLANr9d3qHq1sNjW4Y%3D",
//   //       birthCertificate:
//   //         "https://kinderstorageblob.blob.core.windows.net/kinderblobby/hinh-kham-suc-khoe.jpg?sv=2022-11-02&ss=b&srt=sco&sp=rwlactfx&se=2024-10-23T22:52:54Z&st=2024-10-23T14:52:54Z&spr=https,http&sig=Fc9rDz7rf0pFMLFlB4FkdvN2ybLANr9d3qHq1sNjW4Y%3D",
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
//   //           "Child with ID 672634197b07fbc1acdf65b4 updated successfully"
//   //         );
//   //         done();
//   //       } catch (error) {
//   //         done(error);
//   //       }
//   //     });
//   // });

//   // it("UTCID 02: should return a update child profile success when all information null", (done) => {
//   //   chai.request
//   //     .execute(app)
//   //     .put("/children/672634197b07fbc1acdf65b4")
//   //     .set("Authorization", `Bearer ${token}`)
//   //     .send({
//   //       firstName: "",
//   //       lastName: "",
//   //       dateOfBirth: "",
//   //       favourite: "",
//   //       avatar: "",
//   //       birthCertificate: "",
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
//   //           "Child with ID 672634197b07fbc1acdf65b4 updated successfully"
//   //         );
//   //         done();
//   //       } catch (error) {
//   //         done(error);
//   //       }
//   //     });
//   // });

//   // it("UTCID 03: should return a update child profile not permission", (done) => {
//   //   chai.request
//   //     .execute(app)
//   //     .put("/children/672634197b07fbc1acdf65b4")
//   //     .set("Authorization", `Bearer ${teachertoken}`)
//   //     .send({
//   //       firstName: "Nguyễn",
//   //       lastName: "Dungd",
//   //       dateOfBirth: "1/1/2019",
//   //       favourite: "Hát,Múa",
//   //       avatar:
//   //         "https://kinderstorageblob.blob.core.windows.net/kinderblobby/hinh-kham-suc-khoe.jpg?sv=2022-11-02&ss=b&srt=sco&sp=rwlactfx&se=2024-10-23T22:52:54Z&st=2024-10-23T14:52:54Z&spr=https,http&sig=Fc9rDz7rf0pFMLFlB4FkdvN2ybLANr9d3qHq1sNjW4Y%3D",
//   //       birthCertificate:
//   //         "https://kinderstorageblob.blob.core.windows.net/kinderblobby/hinh-kham-suc-khoe.jpg?sv=2022-11-02&ss=b&srt=sco&sp=rwlactfx&se=2024-10-23T22:52:54Z&st=2024-10-23T14:52:54Z&spr=https,http&sig=Fc9rDz7rf0pFMLFlB4FkdvN2ybLANr9d3qHq1sNjW4Y%3D",
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

//   it("UTCID 04: should return a update child profile missing header", (done) => {
//     chai.request
//       .execute(app)
//       .put("/children/672634197b07fbc1acdf65b4")
//       // .set("Authorization", `Bearer ${token}`)
//       .send({
//         firstName: "Nguyễn",
//         lastName: "Dungd",
//         dateOfBirth: "1/1/2019",
//         favourite: "Hát,Múa",
//         avatar:
//           "https://kinderstorageblob.blob.core.windows.net/kinderblobby/hinh-kham-suc-khoe.jpg?sv=2022-11-02&ss=b&srt=sco&sp=rwlactfx&se=2024-10-23T22:52:54Z&st=2024-10-23T14:52:54Z&spr=https,http&sig=Fc9rDz7rf0pFMLFlB4FkdvN2ybLANr9d3qHq1sNjW4Y%3D",
//         birthCertificate:
//           "https://kinderstorageblob.blob.core.windows.net/kinderblobby/hinh-kham-suc-khoe.jpg?sv=2022-11-02&ss=b&srt=sco&sp=rwlactfx&se=2024-10-23T22:52:54Z&st=2024-10-23T14:52:54Z&spr=https,http&sig=Fc9rDz7rf0pFMLFlB4FkdvN2ybLANr9d3qHq1sNjW4Y%3D",
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
// });

// describe("POST /ADD CHILD", () => {
//   // it("UTCID 01: should return a add child successfully", (done) => {
//   //   chai.request
//   //     .execute(app)
//   //     .post("/add-child")
//   //     .set("Authorization", `Bearer ${token}`)
//   //     .send({
//   //       userId: "6708ddd4a2e201442143328b",
//   //       child: {
//   //         firstName: "Nguyen",
//   //         lastName: "Phuong Tuan",
//   //         dateOfBirth: "1/1/2019",
//   //         birthCertificate:
//   //           "https://kinderstorageblob.blob.core.windows.net/kinderblobby/hinh-kham-suc-khoe.jpg?sv=2022-11-02&ss=b&srt=sco&sp=rwlactfx&se=2024-10-23T22:52:54Z&st=2024-10-23T14:52:54Z&spr=https,http&sig=Fc9rDz7rf0pFMLFlB4FkdvN2ybLANr9d3qHq1sNjW4Y%3D",
//   //         avatar:
//   //           "https://kinderstorageblob.blob.core.windows.net/kinderblobby/hinh-kham-suc-khoe.jpg?sv=2022-11-02&ss=b&srt=sco&sp=rwlactfx&se=2024-10-23T22:52:54Z&st=2024-10-23T14:52:54Z&spr=https,http&sig=Fc9rDz7rf0pFMLFlB4FkdvN2ybLANr9d3qHq1sNjW4Y%3D",
//   //       },
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
//   //           "Child added successfully!"
//   //         );
//   //         done();
//   //       } catch (error) {
//   //         done(error);
//   //       }
//   //     });
//   // });

//   //khi add trẻ để null thì trả về 500
//   // it("UTCID 02: should return a add child successfully when null", (done) => {
//   //   chai.request
//   //     .execute(app)
//   //     .post("/add-child")
//   //     .set("Authorization", `Bearer ${token}`)
//   //     .send({
//   //       userId: "6708ddd4a2e201442143328b",
//   //       child: {
//   //         firstName: "",
//   //         lastName: "",
//   //         dateOfBirth: "",
//   //         birthCertificate: "",
//   //         avatar: "",
//   //       },
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
//   //           "Child added successfully!"
//   //         );
//   //         done();
//   //       } catch (error) {
//   //         done(error);
//   //       }
//   //     });
//   // });

//   //để năm 2025 nhưng vẫn tạo con được
//   // it("UTCID 03: should return a add child is required or invalid", (done) => {
//   //   chai.request
//   //     .execute(app)
//   //     .post("/add-child")
//   //     .set("Authorization", `Bearer ${token}`)
//   //     .send({
//   //       userId: "6708ddd4a2e201442143328b",
//   //       child: {
//   //         firstName: "Nguyen1",
//   //         lastName: "Phuong Tuan@",
//   //         dateOfBirth: "1/1/2025",
//   //         birthCertificate:
//   //           "https://kinderstorageblob.blob.core.windows.net/kinderblobby/hinh-kham-suc-khoe.jpg?sv=2022-11-02&ss=b&srt=sco&sp=rwlactfx&se=2024-10-23T22:52:54Z&st=2024-10-23T14:52:54Z&spr=https,http&sig=Fc9rDz7rf0pFMLFlB4FkdvN2ybLANr9d3qHq1sNjW4Y%3D",
//   //         avatar:
//   //           "https://kinderstorageblob.blob.core.windows.net/kinderblobby/hinh-kham-suc-khoe.jpg?sv=2022-11-02&ss=b&srt=sco&sp=rwlactfx&se=2024-10-23T22:52:54Z&st=2024-10-23T14:52:54Z&spr=https,http&sig=Fc9rDz7rf0pFMLFlB4FkdvN2ybLANr9d3qHq1sNjW4Y%3D",
//   //       },
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
//   //           "Child added successfully!"
//   //         );
//   //         done();
//   //       } catch (error) {
//   //         done(error);
//   //       }
//   //     });
//   // });

//   // it("UTCID 04: should return a add child is not permission!", (done) => {
//   //   chai.request
//   //     .execute(app)
//   //     .post("/add-child")
//   //     .set("Authorization", `Bearer ${teachertoken}`)
//   //     .send({
//   //       userId: "6708ddd4a2e201442143328b",
//   //       child: {
//   //         firstName: "Nguyen1",
//   //         lastName: "Phuong Tuan@",
//   //         dateOfBirth: "1/1/2025",
//   //         birthCertificate:
//   //           "https://kinderstorageblob.blob.core.windows.net/kinderblobby/hinh-kham-suc-khoe.jpg?sv=2022-11-02&ss=b&srt=sco&sp=rwlactfx&se=2024-10-23T22:52:54Z&st=2024-10-23T14:52:54Z&spr=https,http&sig=Fc9rDz7rf0pFMLFlB4FkdvN2ybLANr9d3qHq1sNjW4Y%3D",
//   //         avatar:
//   //           "https://kinderstorageblob.blob.core.windows.net/kinderblobby/hinh-kham-suc-khoe.jpg?sv=2022-11-02&ss=b&srt=sco&sp=rwlactfx&se=2024-10-23T22:52:54Z&st=2024-10-23T14:52:54Z&spr=https,http&sig=Fc9rDz7rf0pFMLFlB4FkdvN2ybLANr9d3qHq1sNjW4Y%3D",
//   //       },
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

//   it("UTCID 05: should return a add child is missing header", (done) => {
//     chai.request
//       .execute(app)
//       .post("/add-child")
//       .send({
//         userId: "6708ddd4a2e201442143328b",
//         child: {
//           firstName: "Nguyen",
//           lastName: "Phuong Tuan",
//           dateOfBirth: "1/1/2019",
//           birthCertificate:
//             "https://kinderstorageblob.blob.core.windows.net/kinderblobby/hinh-kham-suc-khoe.jpg?sv=2022-11-02&ss=b&srt=sco&sp=rwlactfx&se=2024-10-23T22:52:54Z&st=2024-10-23T14:52:54Z&spr=https,http&sig=Fc9rDz7rf0pFMLFlB4FkdvN2ybLANr9d3qHq1sNjW4Y%3D",
//           avatar:
//             "https://kinderstorageblob.blob.core.windows.net/kinderblobby/hinh-kham-suc-khoe.jpg?sv=2022-11-02&ss=b&srt=sco&sp=rwlactfx&se=2024-10-23T22:52:54Z&st=2024-10-23T14:52:54Z&spr=https,http&sig=Fc9rDz7rf0pFMLFlB4FkdvN2ybLANr9d3qHq1sNjW4Y%3D",
//         },
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
// });

// describe("PUT /VIEW PROFILE", () => {
// it("UTC01: should return a users have update", (done) => {
//   chai.request
//     .execute(app)
//     .get("/profile")
//     .set("Authorization", `Bearer ${token}`)
//     .send({
//       userId: "6708ddd4a2e201442143328b",
//     })
//     .end((err, res) => {
//       try {
//         if (err) {
//           throw err;
//         }
//         console.log("res.body", res.body);

//         expect(res.body).to.have.property("status", 200);
//         expect(res.body).to.have.property(
//           "message",
//           `User with ID ${user._id} fetched successfully`
//         );

//         done();
//       } catch (error) {
//         done(error);
//       }
//     });
// });

// it("UTC02: should return error when not role user", (done) => {
//   chai.request
//     .execute(app)
//     .get("/profile")
//     .set("Authorization", `Bearer ${token}123`)
//     .send({
//       userId: "6708ddd4a2e201442143328b",
//     })
//     .end((err, res) => {
//       try {
//         if (err) {
//           throw err;
//         }
//         console.log("res.body", res.body);

//         expect(res.body).to.have.property("status", 401);
//         expect(res.body).to.have.property("message", "Wrong token!");

//         done();
//       } catch (error) {
//         done(error);
//       }
//     });
// });

// it("UTC03: should return error when missing header", (done) => {
//   chai.request
//     .execute(app)
//     .get("/profile")
//     .send({
//       userId: "6708ddd4a2e201442143328b",
//     })
//     .end((err, res) => {
//       try {
//         if (err) {
//           throw err;
//         }
//         console.log("res.body", res.body);

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

// it("UTC04: should return error when userID null", (done) => {
//   chai.request
//     .execute(app)
//     .get("/profile")
//     .set("Authorization", `Bearer ${token}123`)
//     .send({
//       userId: null,
//     })
//     .end((err, res) => {
//       try {
//         if (err) {
//           throw err;
//         }
//         console.log("res.body", res.body);

//         expect(res.body).to.have.property("status", 401);
//         expect(res.body).to.have.property("message", "Wrong token!");

//         done();
//       } catch (error) {
//         done(error);
//       }
//     });
// });

// it("UTC05: should return error when userId sai", (done) => {
//   chai.request
//     .execute(app)
//     .get("/profile")
//     .set("Authorization", `Bearer ${token}123`)
//     .send({
//       userId: "6708ddd4a2e201442143328c",
//     })
//     .end((err, res) => {
//       try {
//         if (err) {
//           throw err;
//         }
//         console.log("res.body", res.body);

//         expect(res.body).to.have.property("status", 401);
//         expect(res.body).to.have.property("message", "Wrong token!");

//         done();
//       } catch (error) {
//         done(error);
//       }
//     });
// });

//   describe("POST /SEND FEEDBACK TEACHER", () => {
// it("UTCID01: should return send feedback teacher successfull", (done) => {
//   chai.request
//     .execute(app)
//     .post("/get-users/6708ddd4a2e201442143328b/feedback")
//     .set("Authorization", `Bearer ${token}`)
//     .send({
//       content: "Giao viên nhiệt tình",
//       rate: "5",
//       teacherId: "670f9fa729418cad307ac23b",
//     })
//     .end((err, res) => {
//       try {
//         if (err) {
//           throw err;
//         }
//         console.log("Res.body", res.body);

//         expect(res.body).to.have.property("status", 200);
//         expect(res.body).to.have.property(
//           "message",
//           "Feedback created successfully!"
//         );

//         done();
//       } catch (error) {
//         done(error);
//       }
//     });
// });

// it("UTCID02: should return error when teacherId invalid or null", (done) => {
//   chai.request
//     .execute(app)
//     .post("/get-users/null/feedback")
//     .set("Authorization", `Bearer ${token}`)
//     .send({
//       content: "Giao viên nhiệt tình",
//       rate: "5",
//       teacherId: "670f9fa729418cad307ac23b",
//     })
//     .end((err, res) => {
//       try {
//         if (err) {
//           throw err;
//         }
//         console.log("Res.body", res.body);

//         expect(res.body).to.have.property("status", 400);
//         expect(res.body).to.have.property(
//           "message",
//           "UserId is required or invalid"
//         );

//         done();
//       } catch (error) {
//         done(error);
//       }
//     });
// });

// it("UTCID03: should return error when missing header", (done) => {
//   chai.request
//     .execute(app)
//     .post("/get-users/6708ddd4a2e201442143328b/feedback")
//     .send({
//       content: "Giao viên nhiệt tình",
//       rate: "5",
//       teacherId: "670f9fa729418cad307ac23b",
//     })
//     .end((err, res) => {
//       try {
//         if (err) {
//           throw err;
//         }
//         console.log("Res.body", res.body);

//         expect(res.body).to.have.property("status", 401);
//         expect(res.body).to.have.property(
//           "message",
//           "UserId is required or invalid"
//         );

//         done();
//       } catch (error) {
//         done(error);
//       }
//     });
// });

//     it("UTCID04: should return error when not permission", (done) => {
//       chai.request
//         .execute(app)
//         .post("/get-users/6708ddd4a2e201442143328b/feedback")
//         .set("Authorization", `Bearer ${teachertoken}`)
//         .send({
//           content: "Giáo viên nhiệt tình",
//           rate: "5",
//           teacherId: "670f9fa729418cad307ac23b",
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
//   });
// });
