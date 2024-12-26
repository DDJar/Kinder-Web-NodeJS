import {use, expect} from "chai";
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
    let token = {};
    let teacher = {};
    let blocktoken = {};
    let blocker = {};
    let staff = {};
    let stafftoken = {};
    const invalid_token = "670de9da1d7f545256e5ee68";

    describe("POST /login", () => {
        it("Login to get token ADMIN", (done) => {
            chai.request
                .execute(app)
                .post("/login")
                .send({username: "admin@gmail.com", password: "admin@gmail.com"})
                .end((err, res) => {
                    try {
                        if (err) {
                            throw err;
                        }
                        expect(res.body).to.have.property("status", 200);
                        expect(res.body).to.have.property("message", "Login successfully!");
                        expect(res.body).to.have.property("token");
                        admintoken = res.body.token;
                        const decoded = jwt.verify(admintoken, jwtSecret);
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

        it("Login to get token USER", (done) => {
            chai.request
                .execute(app)
                .post("/login")
                .send({username: "test@gmail.com", password: "1234567890"})
                .end((err, res) => {
                    try {
                        if (err) {
                            throw err;
                        }
                        expect(res.body).to.have.property("status", 200);
                        expect(res.body).to.have.property("message", "Login successfully!");
                        expect(res.body).to.have.property("token");
                        token = res.body.token;
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

        it("Login to get token TEACHER", (done) => {
            chai.request
                .execute(app)
                .post("/login")
                .send({username: "teacher1@gmail.com", password: "abc1234"})
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

        it("Login to get token STAFF", (done) => {
            chai.request
                .execute(app)
                .post("/login")
                .send({username: "staff@gmail.com", password: "abc1234"})
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

        it("Login to get token BLOCKER", (done) => {
            chai.request
                .execute(app)
                .post("/login")
                .send({username: "blocker@gmail.com", password: "abc1234"})
                .end((err, res) => {
                    try {
                        if (err) {
                            throw err;
                        }
                        expect(res.body).to.have.property("status", 200);
                        expect(res.body).to.have.property("message", "Login successfully!");
                        expect(res.body).to.have.property("token");
                        blocktoken = res.body.token;
                        const decoded = jwt.verify(blocktoken, jwtSecret);
                        blocker = {
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

    describe("GET /SEARCH USERS EXISTING IN SYSTEM", () => {
        it("UTCID 01: should return search users existing in system successfully", (done) => {
            chai.request
                .execute(app)
                .get("/search-users?role=ADMIN&tab=1&search=John")
                .set("Authorization", `Bearer ${admintoken}`)
                .end((err, res) => {
                    try {
                        if (err) {
                            throw err;
                        }
                        // console.log("Res.body", res.body);
                        expect(res.body).to.have.property("status", 200);
                        expect(res.body).to.have.property(
                            "message",
                            "Users search successfully"
                        );
                        done();
                    } catch (error) {
                        done(error);
                    }
                });
        });

        it("UTCID 02: should return search users existing in system keyword null", (done) => {
            chai.request
                .execute(app)
                .get("/search-users?role=ADMIN&tab=1&search=")
                .set("Authorization", `Bearer ${admintoken}`)
                .end((err, res) => {
                    try {
                        if (err) {
                            throw err;
                        }
                        // console.log("Res.body", res.body);
                        expect(res.body).to.have.property("status", 200);
                        expect(res.body).to.have.property(
                            "message",
                            "Users search successfully"
                        );
                        done();
                    } catch (error) {
                        done(error);
                    }
                });
        });

        it("UTCID 03: should return search users existing in system not permission", (done) => {
            chai.request
                .execute(app)
                .get("/search-users?role=ADMIN&tab=1&search=John")
                .set("Authorization", `Bearer ${token}`)
                .end((err, res) => {
                    try {
                        if (err) {
                            throw err;
                        }
                        // console.log("Res.body", res.body);
                        expect(res.body).to.have.property("status", 403);
                        expect(res.body).to.have.property("message", "Not permission!");
                        done();
                    } catch (error) {
                        done(error);
                    }
                });
        });

        it("UTCID 04: should return search users existing in system missing header", (done) => {
            chai.request
                .execute(app)
                .get("/search-users?role=ADMIN&tab=1&search=John")
                .end((err, res) => {
                    try {
                        if (err) {
                            throw err;
                        }
                        // console.log("Res.body", res.body);
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

    describe("PUT /UPDATE FOR USERS EXISTING IN SYSTEM", () => {
        let userIdUpdate = "6755835ee6f39cda34a300a5"
        it("UTCID 01: should return update users existing in system successfully", (done) => {
            chai.request
                .execute(app)
                .put(`/update-user/${userIdUpdate}`)
                .set("Authorization", `Bearer ${admintoken}`)
                .send({
                    firstName: "Viet",
                    lastName: "Dinh",
                    username: "vietdsqde160184@fpt.edu.vn",
                    email: "vietdsqde160184@fpt.edu.vn",
                    phone: "0981656014", //update new phone
                    role: "USER",
                })
                .end((err, res) => {
                    try {
                        if (err) {
                            throw err;
                        }
                        // console.log("Res.body", res.body);
                        expect(res.body).to.have.property("status", 200);
                        expect(res.body).to.have.property(
                            "message",
                            "User with ID 6755835ee6f39cda34a300a5 updated successfully"
                        );
                        done();
                    } catch (error) {
                        done(error);
                    }
                });
        });

        it("UTCID 02: should return error update users existing in system when userID null", (done) => {
            chai.request
                .execute(app)
                .put("/update-user/")
                .set("Authorization", `Bearer ${admintoken}`)
                .send({
                    firstName: "Viet",
                    lastName: "Dinh",
                    username: "vietdsqde160184@fpt.edu.vn",
                    email: "vietdsqde160184@fpt.edu.vn",
                    phone: "0981656014", //update new phone
                    role: "USER",
                })
                .end((err, res) => {
                    try {
                        if (err) {
                            throw err;
                        }
                        // console.log("Res.body", res.body);
                        expect(res.body).to.have.property("status", 404);
                        expect(res.body).to.have.property(
                            "message",
                            "User with ID undefined not found"
                        );
                        done();
                    } catch (error) {
                        done(error);
                    }
                });
        });

        it("UTCID 03: should return error update users existing in system when firstName null", (done) => {
            chai.request
                .execute(app)
                .put(`/update-user/${userIdUpdate}`)
                .set("Authorization", `Bearer ${admintoken}`)
                .send({
                    firstName: "",
                    lastName: "Dinh",
                    username: "viet@gmail.com",
                    email: "12napdung@gmail.com",
                    phone: "01234567890", //update new phone
                    role: "USER",
                })
                .end((err, res) => {
                    try {
                        if (err) {
                            throw err;
                        }
                        // console.log("Res.body", res.body);
                        expect(res.body).to.have.property("status", 400);
                        expect(res.body).to.have.property(
                            "message",
                            "Data input are required fields"
                        );
                        done();
                    } catch (error) {
                        done(error);
                    }
                });
        });

        it("UTCID 04: should return error update users existing in system when username have in system", (done) => {
            chai.request
                .execute(app)
                .put(`/update-user/${userIdUpdate}`)
                .set("Authorization", `Bearer ${admintoken}`)
                .send({
                    firstName: "Viet",
                    lastName: "Dinh",
                    username: "hoangy761exe@gmail.com", // username have in system
                    email: "12napdung@gmail.com",
                    phone: "01234567890",
                    role: "USER",
                })
                .end((err, res) => {
                    try {
                        if (err) {
                            throw err;
                        }
                        // console.log("Res.body", res.body);
                        expect(res.body).to.have.property("status", 400);
                        expect(res.body).to.have.property("message", "Duplicate username");
                        done();
                    } catch (error) {
                        done(error);
                    }
                });
        });

        it("UTCID 05: should return error update users existing in system when not permission", (done) => {
            chai.request
                .execute(app)
                .put(`/update-user/${userIdUpdate}`)
                .set("Authorization", `Bearer ${token}`)
                .send({
                    firstName: "Viet",
                    lastName: "Dinh",
                    username: "viet@gmail.com",
                    email: "12napdung@gmail.com",
                    phone: "01234567890", //update new phone
                    role: "USER",
                })
                .end((err, res) => {
                    try {
                        if (err) {
                            throw err;
                        }
                        // console.log("Res.body", res.body);
                        expect(res.body).to.have.property("status", 403);
                        expect(res.body).to.have.property("message", "Not permission!");
                        done();
                    } catch (error) {
                        done(error);
                    }
                });
        });

        it("UTCID 06: should return error update users existing in system when missing header", (done) => {
            chai.request
                .execute(app)
                .put(`/update-user/${userIdUpdate}`)
                .send({
                    firstName: "Viet",
                    lastName: "Dinh",
                    username: "viet@gmail.com",
                    email: "12napdung@gmail.com",
                    phone: "01234567890", //update new phone
                    role: "USER",
                })
                .end((err, res) => {
                    try {
                        if (err) {
                            throw err;
                        }
                        // console.log("Res.body", res.body);
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
