import { use, expect } from "chai";
import chaiHttp from "chai-http";
import app from "../server.js";
import config from "../config/config.js";
import jwt from "jsonwebtoken";

const jwtSecret = config.JWT_SECRET;
const chai = use(chaiHttp);

describe("User API", () => {
  let admintoken = {};
  let teachertoken = {};
  let user = {};
  let teacher = {};
  let blocktoken = {};
  let blocker = {};
  let stafftoken = {};
  let staff = {};

  describe("POST /login", () => {
    it("Login to get token staff", (done) => {
      chai.request
        .execute("http://localhost:85")
        .post("/users/login")
        .send({ username: "test3@gmail.com", password: "1234567890" })
        .end((err, res) => {
          try {
            if (err) {
              throw err;
            }
            expect(res.body).to.have.property("status", 200);
            expect(res.body).to.have.property("message", "Login successfully!");
            expect(res.body).to.have.property("token");
            stafftoken = res.body.token;
            const decoded = jwt.verify(stafftoken, jwtSecret);
            staff = {
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

    it("Login to get token teacher", (done) => {
      chai.request
        .execute("http://localhost:85")
        .post("/users/login")
        .send({ username: "test14@gmail.com", password: "1234567890" })
        .end((err, res) => {
          try {
            if (err) {
              throw err;
            }
            expect(res.body).to.have.property("status", 200);
            expect(res.body).to.have.property("message", "Login successfully!");
            expect(res.body).to.have.property("token");
            teachertoken = res.body.token;
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

  describe("VIEW ACADEMY IN SYSTEM", () => {
    it("UTCID 01: should fetched successfully", (done) => {
      chai.request
        .execute(app)
        .get("/get-adcademy?search=&type=class&tab=1")
        .set("Authorization", `Bear ${stafftoken}`)
        .end((err, res) => {
          try {
            if (err) {
              throw err;
            }
            console.log("res.body", res.body);

            expect(res.body).to.have.property("status", 200);
            expect(res.body).to.have.property(
              "message",
              "Fetched successfully"
            );

            done();
          } catch (error) {
            done(error);
          }
        });
    });
    it("UTCID 02: should type not found", (done) => {
      chai.request
        .execute(app)
        .get("/get-adcademy?type=a&search=&tab=1")
        .set("Authorization", `Bear ${stafftoken}`)
        .end((err, res) => {
          try {
            if (err) {
              throw err;
            }
            console.log("res.body", res.body);

            expect(res.body).to.have.property("status", 400);
            expect(res.body).to.have.property("message", "Type not found");

            done();
          } catch (error) {
            done(error);
          }
        });
    });

    it("UTCID 03: should  Fetched successfully WHEN ONLY TYPE", (done) => {
      chai.request
        .execute(app)
        .get("/get-adcademy?type=class")
        .set("Authorization", `Bear ${stafftoken}`)
        .end((err, res) => {
          try {
            if (err) {
              throw err;
            }
            console.log("res.body", res.body);

            expect(res.body).to.have.property("status", 200);
            expect(res.body).to.have.property(
              "message",
              "Fetched successfully"
            );

            done();
          } catch (error) {
            done(error);
          }
        });
    });

    it("UTCID 04: should Not permission! when user not role staff", (done) => {
      chai.request
        .execute(app)
        .get("/get-adcademy?search=&type=class&tab=1")
        .set("Authorization", `Bear ${teachertoken}`)
        .end((err, res) => {
          try {
            if (err) {
              throw err;
            }
            console.log("res.body", res.body);

            expect(res.body).to.have.property("status", 403);
            expect(res.body).to.have.property("message", "Not permission!");

            done();
          } catch (error) {
            done(error);
          }
        });
    });

    it("UTCID 05: should missing token", (done) => {
      chai.request
        .execute(app)
        .get("/get-adcademy?search=&type=class&tab=1")
        .set("Authorization", `Bear `)
        .end((err, res) => {
          try {
            if (err) {
              throw err;
            }
            console.log("res.body", res.body);

            expect(res.body).to.have.property("status", 401);
            expect(res.body).to.have.property("message", "Missing Token");

            done();
          } catch (error) {
            done(error);
          }
        });
    });

    it("UTCID 06: should missing authorization header", (done) => {
      chai.request
        .execute(app)
        .get("/get-adcademy?search=&type=class&tab=1")
        .end((err, res) => {
          try {
            if (err) {
              throw err;
            }
            console.log("res.body", res.body);

            expect(res.body).to.have.property("status", 401);
            expect(res.body).to.have.property(
              "message",
              "Missing authorization header"
            );

            done();
          } catch (error) {
            done(error);
          }
        });
    });
  });
});
