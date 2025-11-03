// tests/login.test.js
const request = require("supertest");
const { app } = require("../server");
const { connectDB, clearDB, closeDB } = require("../config/database");
const User = require("../models/User");

describe("API /auth/login", () => {
  beforeAll(async () => {
    await connectDB();
    await clearDB();
    // Tạo user test
    await User.create({
      username: "testuser",
      email: "testuser@example.com",
      password: "123456",
    });
  });

  afterAll(async () => {
    await clearDB();
    await closeDB();
  });

  it("Đăng nhập thành công với username và password đúng", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "testuser", password: "123456" });
    expect(res.statusCode).toBe(200);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.username).toBe("testuser");
  });

  it("Đăng nhập thất bại với username sai", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "wronguser", password: "123456" });
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("Invalid credentials");
  });

  it("Đăng nhập thất bại với password sai", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "testuser", password: "wrongpass" });
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("Invalid credentials");
  });
});
