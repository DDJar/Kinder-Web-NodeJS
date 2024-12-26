import { use, expect, should } from "chai";
import chaiHttp from "chai-http";
import app from "../server.js";
import config from "../config/config.js";
import jwt from "jsonwebtoken";
const jwtSecret = config.JWT_SECRET;
const chai = use(chaiHttp);
chai.should();
describe("VIEW MY CLASS", () => {
  let token = {};
  let user = {};
  let teachertoken = {};
  let teacher = {};

  describe("POST /login", () => {
    it("should login a user and return a token USER", (done) => {
      chai.request
        .execute("http://localhost:85")
        .post("/users/login")
        .send({ username: "test12@gmail.com", password: "1234567890" })
        .end((err, res) => {
          try {
            if (err) {
              throw err;
            }
            // console.log("res.body", res.body);

            expect(res.body).to.have.property("status", 200);
            expect(res.body).to.have.property("message", "Login successfully!");
            expect(res.body).to.have.property("token");
            token = res.body.token;
            // console.log(token);
            const decoded = jwt.verify(token, jwtSecret);
            user = {
              _id: decoded._id,
              role: decoded.role,
              firstName: decoded.firstName,
              lastName: decoded.lastName,
              password: "",
            };
            done();
          } catch (error) {
            done(error);
          }
        });
    });

    it("should login a user and return a token TEACHER", (done) => {
      chai.request
        .execute("http://localhost:85")
        .post("/users/login")
        .send({ username: "test14@gmail.com", password: "1234567890" })
        .end((err, res) => {
          try {
            if (err) {
              throw err;
            }
            // console.log("res.body", res.body);

            expect(res.body).to.have.property("status", 200);
            expect(res.body).to.have.property("message", "Login successfully!");
            expect(res.body).to.have.property("token");
            teachertoken = res.body.token;
            // console.log(token);
            const decoded = jwt.verify(teachertoken, jwtSecret);
            teacher = {
              _id: decoded._id,
              role: decoded.role,
              firstName: decoded.firstName,
              lastName: decoded.lastName,
              password: "",
            };
            done();
          } catch (error) {
            done(error);
          }
        });
    });
  });

  // describe("GET VIEW CLASS BY TEACHER", () => {
  //   it("UTCID1: should return a list of classes with valid teacherId and token", (done) => {
  //     chai.request
  //       .execute(app)
  //       .get("/get-classes-by-teacher?teacherId=" + teacher._id)
  //       .set("Authorization", `Bearer ${teachertoken}`)
  //       .end((err, res) => {
  //         try {
  //           if (err) {
  //             throw err;
  //           }
  //           // console.log("res.body", res.body);

  //           expect(res.body).to.have.property("status", 200);
  //           expect(res.body).to.have.property("data");
  //           expect(res.body.data).to.be.an("object");
  //           expect(res.body.data.classes).to.be.an("array");
  //           expect(res.body).to.have.property(
  //             "message",
  //             "Classes fetched successfully!"
  //           );
  //           done();
  //         } catch (error) {
  //           done(error);
  //         }
  //       });
  //   });

  //   it("UTCID02: should return 400 when teacherId is missing or invalid", (done) => {
  //     chai.request
  //       .execute(app)
  //       .get("/get-classes-by-teacher?teacherId=null")
  //       .set("Authorization", `Bearer ${teachertoken}`)
  //       .end((err, res) => {
  //         try {
  //           if (err) {
  //             throw err;
  //           }
  //           console.log("res.body", res.body);

  //           expect(res.body).to.have.property("status", 400);
  //           // expect(res.body).to.have.property("data");
  //           // expect(res.body.data).to.be.an("object");
  //           // expect(res.body.data.classes).to.be.an("array");
  //           expect(res.body).to.have.property(
  //             "message",
  //             "TeacherId is required or invalid"
  //           );
  //           done();
  //         } catch (error) {
  //           done(error);
  //         }
  //       });
  //   });

  //   it("UTCID03: should return 200 when the role is not a teacher", (done) => {
  //     chai.request
  //       .execute(app)
  //       .get("/get-classes-by-teacher?teacherId=" + user._id)
  //       .set("Authorization", `Bearer ${token}`)
  //       .end((err, res) => {
  //         try {
  //           if (err) {
  //             throw err;
  //           }

  //           console.log("res.body", res.body);

  //           expect(res.body).to.have.property("status", 200);
  //           // expect(res.body).to.have.property("data");
  //           // expect(res.body.data).to.be.an("object");
  //           // expect(res.body.data.classes).to.be.an("array");
  //           expect(res.body).to.have.property(
  //             "message",
  //             "No classes found for this teacher"
  //           );
  //           done();
  //         } catch (error) {
  //           done(error);
  //         }
  //       });
  //   });

  //   it("UTCID04: should return 200 with no data found for the teacher ID", (done) => {
  //     chai.request
  //       .execute(app)
  //       .get("/get-classes-by-teacher?teacherId=670e1ff8d97de75e1fae79a5") //giáo viên chưa có lớp
  //       .set("Authorization", `Bearer ${token}`)
  //       .end((err, res) => {
  //         try {
  //           if (err) {
  //             throw err;
  //           }
  //           console.log("res.body", res.body);

  //           expect(res.body).to.have.property("status", 200);
  //           // expect(res.body).to.have.property("data");
  //           // expect(res.body.data).to.be.an("object");
  //           // expect(res.body.data.classes).to.be.an("array");
  //           expect(res.body).to.have.property(
  //             "message",
  //             "No classes found for this teacher"
  //           );
  //           done();
  //         } catch (error) {
  //           done(error);
  //         }
  //       });
  //   });

  //   //cần sửa expect code -> status
  //   it("UTCID05: should return 401 with missing authorization header", (done) => {
  //     chai.request
  //       .execute(app)
  //       .get("/get-classes-by-teacher?teacherId=" + teacher._id)
  //       // .set("Authorization", `Bearer ${token}`)
  //       .end((err, res) => {
  //         try {
  //           if (err) {
  //             throw err;
  //           }
  //           // console.log("res.body", res.body);

  //           expect(res.body).to.have.property("status", 401);
  //           // expect(res.body).to.have.property("data");
  //           // expect(res.body.data).to.be.an("object");
  //           // expect(res.body.data.classes).to.be.an("array");
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

  //   it("UTCID06: should return 500 when server encounters an error", (done) => {
  //     chai.request
  //       .execute(app)
  //       .get("/get-classes-by-teacher?teacherId=throwError")
  //       .set("Authorization", `Bearer ${token}`)
  //       .end((err, res) => {
  //         try {
  //           if (err) throw err;

  //           console.log("res.body", res.body);

  //           expect(res.body).to.have.property("status", 500);
  //           expect(res.body).to.have.property(
  //             "message",
  //             "Database connection failed!"
  //           );
  //           // .that.includes("Database connection failed");
  //           done();
  //         } catch (error) {
  //           done(error);
  //         }
  //       });
  //   });
  // });

  //   describe("GET VIEW MY ENGLISH CLASS", () => {
  // it("UTCID1: should return a list of skilles with valid teacherId and token", (done) => {
  //   chai.request
  //     .execute(app)
  //     .get("/get-skilles-by-teacher?teacherId=" + teacher._id)
  //     .set("Authorization", `Bearer ${teachertoken}`)
  //     .end((err, res) => {
  //       try {
  //         if (err) {
  //           throw err;
  //         }
  //         console.log("res.body", res.body);
  //         expect(res.body).to.have.property("status", 200);
  //         expect(res.body).to.have.property("data");
  //         expect(res.body.data).to.be.an("object");
  //         expect(res.body.data.skilles).to.be.an("array");
  //         expect(res.body).to.have.property(
  //           "message",
  //           "skilles fetched successfully!"
  //         );
  //         done();
  //       } catch (error) {
  //         done(error);
  //       }
  //     });
  // });

  // it("UTCID02: should return 400 when teacherId is missing or invalid", (done) => {
  //   chai.request
  //     .execute(app)
  //     .get("/get-skilles-by-teacher?teacherId=null")
  //     .set("Authorization", `Bearer ${teachertoken}`)
  //     .end((err, res) => {
  //       try {
  //         if (err) {
  //           throw err;
  //         }
  //         console.log("res.body", res.body);
  //         expect(res.body).to.have.property("status", 400);
  //         // expect(res.body).to.have.property("data");
  //         // expect(res.body.data).to.be.an("object");
  //         // expect(res.body.data.classes).to.be.an("array");
  //         expect(res.body).to.have.property(
  //           "message",
  //           "TeacherId is required or invalid"
  //         );
  //         done();
  //       } catch (error) {
  //         done(error);
  //       }
  //     });
  // });

  // it("UTCID03: should return 200 when the role is not a teacher", (done) => {
  //   chai.request
  //     .execute(app)
  //     .get("/get-skilles-by-teacher?teacherId=" + user._id)
  //     .set("Authorization", `Bearer ${token}`)
  //     .end((err, res) => {
  //       try {
  //         if (err) {
  //           throw err;
  //         }
  //         console.log("res.body", res.body);
  //         expect(res.body).to.have.property("status", 200);
  //         // expect(res.body).to.have.property("data");
  //         // expect(res.body.data).to.be.an("object");
  //         // expect(res.body.data.classes).to.be.an("array");
  //         expect(res.body).to.have.property(
  //           "message",
  //           "No skilles found for this teacher"
  //         );
  //         done();
  //       } catch (error) {
  //         done(error);
  //       }
  //     });
  // });

  // it("UTCID04: should return 200 with no data found for the teacher ID", (done) => {
  //   chai.request
  //     .execute(app)
  //     .get("/get-skilles-by-teacher?teacherId=670e1ff8d97de75e1fae79a5") //giáo viên chưa có lớp
  //     .set("Authorization", `Bearer ${token}`)
  //     .end((err, res) => {
  //       try {
  //         if (err) {
  //           throw err;
  //         }
  //         console.log("res.body", res.body);
  //         expect(res.body).to.have.property("status", 200);
  //         // expect(res.body).to.have.property("data");
  //         // expect(res.body.data).to.be.an("object");
  //         // expect(res.body.data.classes).to.be.an("array");
  //         expect(res.body).to.have.property(
  //           "message",
  //           "No skilles found for this teacher"
  //         );
  //         done();
  //       } catch (error) {
  //         done(error);
  //       }
  //     });
  // });

  // it("UTCID05: should return 401 with missing authorization header", (done) => {
  //   chai.request
  //     .execute(app)
  //     .get("/get-skilles-by-teacher?teacherId=" + teacher._id)
  //     // .set("Authorization", `Bearer ${token}`)
  //     .end((err, res) => {
  //       try {
  //         if (err) {
  //           throw err;
  //         }
  //         // console.log("res.body", res.body);
  //         expect(res.body).to.have.property("status", 401);
  //         // expect(res.body).to.have.property("data");
  //         // expect(res.body.data).to.be.an("object");
  //         // expect(res.body.data.classes).to.be.an("array");
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

  // it("UTCID06: should return 500 when server encounters an error", (done) => {
  //   chai.request
  //     .execute(app)
  //     .get("/get-skilles-by-teacher?teacherId=throwError")
  //     .set("Authorization", `Bearer ${token}`)
  //     .end((err, res) => {
  //       try {
  //         if (err) throw err;
  //         console.log("res.body", res.body);
  //         expect(res.body).to.have.property("status", 500);
  //         expect(res.body).to.have.property(
  //           "message",
  //           "Internal server error"
  //         );
  //         done();
  //       } catch (error) {
  //         done(error);
  //       }
  //     });
  // });
  //   });

  // describe("POST /ADD CHILD", () => {
  //     it("should return a users have update", (done) => {
  //       chai.request
  //         .execute(app)
  //         .post("/add-child/" + user._id)
  //         .send({
  //           child: {
  //             firstName: "Bùi",
  //             lastName: "Tuấn Minh",
  //             dateOfBirth: "1/1/2025",
  //             birthCertificate: "birthCertificate.jpg/png",
  //             avatar: "avatar.jpg/png",
  //           },
  //         })
  //         .end((err, res) => {
  //           try {
  //             if (err) {
  //               throw err;
  //             }
  //             console.log("Res.body", res.body);

  //             expect(res.body).to.have.status("status", 200);
  //             expect(res.body).to.have.status(
  //               "message",
  //               "Data created successfully!"
  //             );
  //             expect(res.body).to.have.property("data");
  //             expect(res.body.data).to.have.property("user");
  //             expect(res.body.data.user).to.include({
  //               firstName: "Bùi",
  //               lastName: "Tuấn Minh",
  //               dateOfBirth: "1/1/2025",
  //               birthCertificate: "birthCertificate.jpg/png",
  //               avatar: "avatar.jpg/png",
  //             });
  //             done();
  //           } catch (error) {
  //             done(error);
  //           }
  //         });
  //     });
  //   });

  // describe("PUT /VIEW PROFILE", () => {
  // it("UTC01: should return a users have update", (done) => {
  //   chai.request
  //     .execute(app)
  //     .get("/profile/")
  //     .set("Authorization", `Bearer ${token}`)
  //     .end((err, res) => {
  //       try {
  //         if (err) {
  //           throw err;
  //         }
  //         // console.log("res.body", res.body);

  //         expect(res.body).to.have.property("status", 200);
  //         expect(res.body).to.have.property(
  //           "message",
  //           `User with ID ${user._id} fetched successfully`
  //         );
  //         expect(res.body).to.have.property("data");
  //         // expect(res.body.data).to.have.property("user");

  //         done();
  //       } catch (error) {
  //         done(error);
  //       }
  //     });
  // });

  // it("UNTC02: should return 401 error for invalid userId", (done) => {
  //   chai.request
  //     .execute(app)
  //     .get("/profile/")
  //     .set("Authorization", `Bearer ${token}123`)
  //     .end((err, res) => {
  //       try {
  //         if (err) {
  //           throw err;
  //         }
  //         console.log("res.body", res.body);

  //         expect(res.body).to.have.property("status", 404);
  //         expect(res.body).to.have.property(
  //           "message",
  //           "ParentId is wrong"
  //         );

  //         done();
  //       } catch (error) {
  //         done(error);
  //       }
  //     });
  // });

  ///đưa token teacher nhưng lại báo lỗi 200
  // it("UNTC02: should return 40 error for unauthorized access", (done) => {
  //   chai.request
  //     .execute(app)
  //     .get("/profile/")
  //     .set("Authorization", `Bearer ${token}123`)
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

  ///UNTC4: OK
  // it("UNTC04: should return 401 error for missing authorization header", (done) => {
  //   chai.request
  //     .execute(app)
  //     .get("/profile/")
  //     // .set("Authorization", `Bearer ${token}`)
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
  //         // expect(res.body).to.have.property("data");
  //         // expect(res.body.data).to.have.property("user");

  //         done();
  //       } catch (error) {
  //         done(error);
  //       }
  //     });
  // });
  //   });

  // describe("GET/ VIEW CHILD PROFILE", () => {
  //     it("UTCID 01: Should return a valid child profile when valid ParentId and ChildId are provided", (done) => {
  //       chai.request
  //         .execute(app)
  //         .get("/children/668bd94f445c2856f61d6824")
  //         .set("Authorization", `Bearer ${token}`)
  //         .end((err, res) => {
  //           try {
  //             if (err) {
  //               throw err;
  //             }

  //             console.log("Res.body", res.body);

  //             expect(res.body).to.have.property("status", 200);
  //             expect(res.body).to.have.property("data");
  //             expect(res.body).to.have.property(
  //               "message",
  //               "Child fetched successfully!"
  //             );

  //             done();
  //           } catch (error) {
  //             done(error);
  //           }
  //         });
  //     });

  //lỗi phải trả về là 404 nhưng hiện ra lỗi là 500 khác với trên unit test
  // it("UTCID 02: Should return ParentId, childID is null or invalid", (done) => {
  //   chai.request
  //     .execute(app)
  //     .get("/children/668be85aa672ef8368a48646") //childID khác
  //     .set("Authorization", `Bearer`)// parent null
  //     .end((err, res) => {
  //       try {
  //         if (err) {
  //           throw err;
  //         }
  //         console.log("Res.body", res.body);

  //         expect(res.body).to.have.property("status", 404);
  //         expect(res.body).to.have.property(
  //           "message",
  //           "ParentId is required"
  //         );

  //         done();
  //       } catch (error) {
  //         done(error);
  //       }
  //     });
  // });

  //lỗi phải trả về là 404 nhưng hiện ra lỗi là 500 khác với trên unit test
  // it("UTCID 03: Should return ChildId is required or invalid", (done) => {
  //   chai.request
  //     .execute(app)
  //     .get("/children/668bd94f445c2856f61d6824abc") //sai id trẻ
  //     .set("Authorization", `Bearer ${token}`)
  //     .end((err, res) => {
  //       try {
  //         if (err) {
  //           throw err;
  //         }
  //         console.log("Res.body", res.body);

  //         expect(res.body).to.have.property("status", 404);
  //         expect(res.body).to.have.property(
  //           "message",
  //           "ChildId is required or invalid"
  //         );

  //         done();
  //       } catch (error) {
  //         done(error);
  //       }
  //     });
  // });

  //trả về status => đang trả về code lỗi 401
  // it("UTCID 04: Should return null ParentId but ChildId is valid", (done) => {
  //   chai.request
  //     .execute(app)
  //     .get("/children/668bd94f445c2856f61d6824")
  //     .set("Authorization", `Bearer null`) // parent null
  //     .end((err, res) => {
  //       try {
  //         if (err) {
  //           throw err;
  //         }
  //         console.log("Res.body", res.body);

  //         expect(res.body).to.have.property("status", 404);
  //         expect(res.body).to.have.property(
  //           "message",
  //           "ParentId is required"
  //         );

  //         done();
  //       } catch (error) {
  //         done(error);
  //       }
  //     });
  // });

  //không phải parent, chidID null nhưng lại thông báo thành công 200
  // it("UTCID 05: Should return not ParentId", (done) => {
  //   chai.request
  //     .execute(app)
  //     .get("/children/null")
  //     .set("Authorization", `Bearer ${teachertoken}`)
  //     .end((err, res) => {
  //       try {
  //         if (err) {
  //           throw err;
  //         }
  //         console.log("Res.body", res.body);

  //         expect(res.body).to.have.property("status", 404);
  //         expect(res.body).to.have.property(
  //           "message",
  //           "ParentId is required"
  //         );

  //         done();
  //       } catch (error) {
  //         done(error);
  //       }
  //     });
  // });

  // it("UTCID 06: Should return Missing Authorization Header", (done) => {
  //   chai.request
  //     .execute(app)
  //     .get("/children/" + user._id + "/670e1ff8d97de75e1fae79a51")
  //     .set("Authorization", `Bearer ${token}`)
  //     .end((err, res) => {
  //       try {
  //         if (err) {
  //           throw err;
  //         }
  //         console.log("Res.body", res.body);

  //         expect(res.body).to.have.property("status", 404);
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
  //   });

  // describe("POST /PROCESS REGISTER FOR SCHOOL", () => {
  //     it("UTCID01: should return a users have update", (done) => {
  //       chai.request
  //         .execute(app)
  //         .post("/process-register-for-school")
  //         .set("Authorization", `Bearer ${stafftoken}`)
  //         .send({
  //           admissionApplicationId: "67177ae71aaca5fb5133e18e",
  //           status: "ACTIVE",
  //           noteByStaff: "Hẹn gặp phụ huynh và trẻ tại trường lúc 7h 25/10/2024",
  //         })
  //         .end((err, res) => {
  //           try {
  //             if (err) {
  //               throw err;
  //             }
  //             console.log("Res.body", res.body);

  //             expect(res.body).to.have.property("status", 200);
  //             // expect(res.body).to.have.property("data");
  //             // expect(res.body.data).to.have.property("user");
  //             expect(res.body).to.have.property(
  //               "message",
  //               "Processing successfully!"
  //             );

  //             done();
  //           } catch (error) {
  //             done(error);
  //           }
  //         });
  //     });

  //     it("UTCID02: should return admissionApplicationId null", (done) => {
  //       chai.request
  //         .execute(app)
  //         .post("/process-register-for-school")
  //         .set("Authorization", `Bearer ${stafftoken}`)
  //         .send({
  //           admissionApplicationId: "",
  //           status: "ACTIVE",
  //           noteByStaff: "Hẹn gặp phụ huynh và trẻ tại trường lúc 7h 25/10/2024",
  //         })
  //         .end((err, res) => {
  //           try {
  //             if (err) {
  //               throw err;
  //             }
  //             console.log("Res.body", res.body);

  //             expect(res.body).to.have.property("status", 404);
  //             // expect(res.body).to.have.property("data");
  //             // expect(res.body.data).to.have.property("user");
  //             expect(res.body).to.have.property(
  //               "message",
  //               "Adnission spplication with ID  not found"
  //             );

  //             done();
  //           } catch (error) {
  //             done(error);
  //           }
  //         });
  //     });

  //     it("UTCID03: should return id wrong ", (done) => {
  //       chai.request
  //         .execute(app)
  //         .post("/process-register-for-school")
  //         .set("Authorization", `Bearer ${stafftoken}`)
  //         .send({
  //           admissionApplicationId: "123",
  //           status: "ACTIVE",
  //           noteByStaff: "Hẹn gặp phụ huynh và trẻ tại trường lúc 7h 25/10/2024",
  //         })
  //         .end((err, res) => {
  //           try {
  //             if (err) {
  //               throw err;
  //             }
  //             console.log("Res.body", res.body);

  //             expect(res.body).to.have.property("status", 404);
  //             // expect(res.body).to.have.property("data");
  //             // expect(res.body.data).to.have.property("user");
  //             expect(res.body).to.have.property(
  //               "message",
  //               "Adnission spplication with ID 123 not found"
  //             );

  //             done();
  //           } catch (error) {
  //             done(error);
  //           }
  //         });
  //     });

  //     it("UTCID04: should return status null ", (done) => {
  //       chai.request
  //         .execute(app)
  //         .post("/process-register-for-school")
  //         .set("Authorization", `Bearer ${stafftoken}`)
  //         .send({
  //           admissionApplicationId: "67177ae71aaca5fb5133e18e",
  //           status: "",
  //           noteByStaff: "Hẹn gặp phụ huynh và trẻ tại trường lúc 7h 25/10/2024",
  //         })
  //         .end((err, res) => {
  //           try {
  //             if (err) {
  //               throw err;
  //             }
  //             console.log("Res.body", res.body);

  //             expect(res.body).to.have.property("status", 404);
  //             // expect(res.body).to.have.property("data");
  //             // expect(res.body.data).to.have.property("user");
  //             expect(res.body).to.have.property("message", "Status not found");

  //             done();
  //           } catch (error) {
  //             done(error);
  //           }
  //         });
  //     });

  //     it("UTCID05: should return diff role", (done) => {
  //       chai.request
  //         .execute(app)
  //         .post("/process-register-for-school")
  //         .set("Authorization", `Bearer ${teachertoken}`)
  //         .send({
  //           admissionApplicationId: "67177ae71aaca5fb5133e18e",
  //           status: "ACTIVE",
  //           noteByStaff: "Hẹn gặp phụ huynh và trẻ tại trường lúc 7h 25/10/2024",
  //         })
  //         .end((err, res) => {
  //           try {
  //             if (err) {
  //               throw err;
  //             }
  //             console.log("Res.body", res.body);

  //             expect(res.body).to.have.property("status", 403);
  //             // expect(res.body).to.have.property("data");
  //             // expect(res.body.data).to.have.property("user");
  //             expect(res.body).to.have.property("message", "Not permission!");

  //             done();
  //           } catch (error) {
  //             done(error);
  //           }
  //         });
  //     });

  //     it("UTCID06: should return missing header", (done) => {
  //       chai.request
  //         .execute(app)
  //         .post("/process-register-for-school")
  //         // .set("Authorization", `Bearer ${teachertoken}`)
  //         .send({
  //           admissionApplicationId: "67177ae71aaca5fb5133e18e",
  //           status: "ACTIVE",
  //           noteByStaff: "Hẹn gặp phụ huynh và trẻ tại trường lúc 7h 25/10/2024",
  //         })
  //         .end((err, res) => {
  //           try {
  //             if (err) {
  //               throw err;
  //             }
  //             console.log("Res.body", res.body);

  //             expect(res.body).to.have.property("status", 401);
  //             // expect(res.body).to.have.property("data");
  //             // expect(res.body.data).to.have.property("user");
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

  //    describe("GET VIEW SERVICE REGISTER STATUS", () => {
  //     it("UTCID1: should return a list of classes with valid teacherId and token", (done) => {
  //       chai.request
  //         .execute(app)
  //         .get("viewstatus/:skillId")
  //         .set("Authorization", `Bearer ${teachertoken}`)
  //         .end((err, res) => {
  //           try {
  //             if (err) {
  //               throw err;
  //             }
  //             // console.log("res.body", res.body);

  //             expect(res.body).to.have.property("status", 200);
  //             expect(res.body).to.have.property("data");
  //             expect(res.body.data).to.be.an("object");
  //             expect(res.body.data.classes).to.be.an("array");
  //             expect(res.body).to.have.property(
  //               "message",
  //               "Classes fetched successfully!"
  //             );
  //             done();
  //           } catch (error) {
  //             done(error);
  //           }
  //         });
  //     });
  // });

  describe("GET VIEW TEACHER INFORMATION", () => {
    it("UTCID1: should return a list of classes with valid teacherId and token", (done) => {
      chai.request
        .execute(app)
        .get("get-users/:userId/feedback")
        .set("Authorization", `Bearer ${teachertoken}`)
        .end((err, res) => {
          try {
            if (err) {
              throw err;
            }
            // console.log("res.body", res.body);

            expect(res.body).to.have.property("status", 200);
            expect(res.body).to.have.property("data");
            expect(res.body.data).to.be.an("object");
            expect(res.body.data.classes).to.be.an("array");
            expect(res.body).to.have.property(
              "message",
              "Classes fetched successfully!"
            );
            done();
          } catch (error) {
            done(error);
          }
        });
    });
  });
});
