import {use, expect, should} from "chai";
import chaiHttp from "chai-http";
import app from "../server.js";

const chai = use(chaiHttp);
chai.should();

describe("auth.test> Auth API", () => {
    let valid_token = {};
    describe("POST /register", () => {
        it("should register a new user", (done) => {
            chai.request
                .execute(app)
                .post("/register")
                .send({
                    firstName: "John",
                    lastName: "Doe",
                    password: "1234567890",
                    type: "email",
                    username: "test@gmail.com",
                })
                .end((err, res) => {
                    try {
                        if (err) {
                            throw err;
                        }
                        if (res.body.message === "User already exists!") {
                            done();
                        } else {
                            expect(res).to.have.status(200);
                            expect(res.body).to.have.property(
                                "message",
                                "User registered successfully!"
                            );
                            done();
                        }
                    } catch (error) {
                        done(error);
                    }
                });
        });
        it("should register a new user have already exists", (done) => {
            chai.request
                .execute(app)
                .post("/register")
                .send({
                    firstName: "John",
                    lastName: "Doe",
                    password: "1234567890",
                    type: "email",
                    username: "test@gmail.com",
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
                            "User already exists!"
                        );
                        done();
                    } catch (error) {
                        done(error);
                    }
                });
        });
        it("register feature fail with all blank fields", (done) => {
            chai.request
                .execute(app)
                .post("/register")
                .send({})
                .end((err, res) => {
                    try {
                        if (err) {
                            throw err;
                        }
                        // console.log("Res.body", res.body);
                        expect(res.body).to.have.property("status", 400);
                        expect(res.body).to.have.property(
                            "message",
                            "All fields are required"
                        );
                        done();
                    } catch (error) {
                        done(error);
                    }
                });
        });
    });

    describe("POST /login", () => {
        it("should login a user and return a token", (done) => {
            chai.request
                .execute(app)
                .post("/login")
                .send({username: "test@gmail.com", password: "1234567890"})
                .end((err, res) => {
                    try {
                        if (err) {
                            throw err;
                        }
                        // console.log("Res.body", res.body);
                        expect(res.body).to.have.property("status", 200);
                        expect(res.body).to.have.property("message", "Login successfully!");
                        expect(res.body).to.have.property("token");
                        expect(res.body).to.have.property("data");
                        valid_token = res.body.token;
                        done();
                    } catch (error) {
                        done(error);
                    }
                });
        });
        it("should login Incorrect username or password", (done) => {
            chai.request
                .execute(app)
                .post("/login")
                .send({username: "test1@gmail.com", password: "1234567890"}) //wrong username
                .end((err, res) => {
                    try {
                        if (err) {
                            throw err;
                        }
                        // console.log("Res.body", res.body);
                        expect(res.body).to.have.property("status", 400);
                        expect(res.body).to.have.property(
                            "message",
                            "Incorrect username or password"
                        );
                        done();
                    } catch (error) {
                        done(error);
                    }
                });
        });
    });

    describe("POST /reset-passwords", () => {
        it("UTCID01: should update the password successfully with valid token", (done) => {
            chai.request
                .execute(app)
                .post("/reset-passwords")
                .set("Authorization", `Bearer ${valid_token}`)
                .send({
                    newPassword: "1234567890",
                    confirmPassword: "1234567890",
                })
                .end((err, res) => {
                    // console.log("Response body:", res.body);
                    try {
                        if (err) {
                            throw err;
                        }
                        expect(res.body).to.have.property("status", 200);
                        expect(res.body).to.have.property(
                            "message",
                            "Password updated successfully"
                        );
                        done();
                    } catch (error) {
                        done(error);
                    }
                });
        });

        it("UTCID02: should update the password not match", (done) => {
            chai.request
                .execute(app)
                .post("/reset-passwords")
                .set("Authorization", `Bearer ${valid_token}`)
                .send({
                    newPassword: "1234567890",
                    confirmPassword: "123456",
                })
                .end((err, res) => {
                    // console.log("Response body:", res.body);
                    try {
                        if (err) {
                            throw err;
                        }
                        expect(res.body).to.have.property("status", 400);
                        expect(res.body).to.have.property("message", "Invalid password");
                        done();
                    } catch (error) {
                        done(error);
                    }
                });
        });

        it("UTCID05: should fail when token is missing", (done) => {
            chai.request
                .execute(app)
                .post("/reset-passwords")
                .set("Authorization", `Bearer `)
                .send({
                    newPassword: "1234567890",
                    confirmPassword: "1234567890",
                })
                .end((err, res) => {
                    // console.log("Response body:", res.body);
                    try {
                        if (err) {
                            throw err;
                        }
                        expect(res.body).to.have.property("status", 401);
                        expect(res.body).to.have.property("message", "Missing Token");
                        done();
                    } catch (error) {
                        done(error);
                    }
                });
        });
    });
});
