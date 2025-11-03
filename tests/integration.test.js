const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../server").app;
const User = require("../models/User");

describe("Integration Tests", () => {
  let mongoServer;
  let agent;
  const testUser = {
    username: "testuser",
    email: "test@example.com",
    password: "Test123!",
  };

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.disconnect(); // Ensure no existing connections
    await mongoose.connect(mongoUri);
    agent = request.agent(app);
  });

  beforeEach(async () => {
    if (mongoose.connection.db) {
      await User.deleteMany({});
    }
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    await mongoServer.stop();
  });

  describe("Authentication", () => {
    describe("POST /api/auth/register", () => {
      it("should register a new user", async () => {
        const res = await agent.post("/api/auth/register").send(testUser);

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe("User registered successfully"); // Verify user was created in DB

        const user = await User.findOne({ username: testUser.username });
        expect(user).toBeTruthy();
        expect(user.email).toBe(testUser.email);
      });

      it("should not register user with duplicate username", async () => {
        // First create a user
        await agent.post("/api/auth/register").send(testUser); // Try to create duplicate

        const res = await agent.post("/api/auth/register").send(testUser);

        expect(res.statusCode).toBe(400); // SỬA LỖI: Chỉnh lại message mong đợi để khớp với API
        expect(res.body.error).toBe("Username already exists");
      });

      it("should not register user without required fields", async () => {
        const res = await agent.post("/api/auth/register").send({
          username: testUser.username, // Missing email and password
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBeTruthy(); // Giữ nguyên, kiểm tra có lỗi là được
      });
    });

    describe("POST /api/auth/login", () => {
      beforeEach(async () => {
        // Create a test user before each login test
        await agent.post("/api/auth/register").send(testUser);
      });

      it("should login with correct credentials", async () => {
        const res = await agent.post("/api/auth/login").send({
          username: testUser.username,
          password: testUser.password,
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Logged in successfully");
      });

      it("should not login with incorrect password", async () => {
        const res = await agent.post("/api/auth/login").send({
          username: testUser.username,
          password: "wrongpassword",
        });

        expect(res.statusCode).toBe(401);
        expect(res.body.error).toBe("Invalid credentials");
      });

      it("should not login with non-existent username", async () => {
        const res = await agent.post("/api/auth/login").send({
          username: "nonexistent",
          password: testUser.password,
        });

        expect(res.statusCode).toBe(401);
        expect(res.body.error).toBe("Invalid credentials");
      });
    });

    describe("POST /api/auth/logout", () => {
      it("should logout successfully", async () => {
        // First register and login
        await agent.post("/api/auth/register").send(testUser);

        await agent.post("/api/auth/login").send({
          username: testUser.username,
          password: testUser.password,
        }); // Then logout

        const res = await agent.post("/api/auth/logout");

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Logged out successfully");
      });
    });
  });

  describe("Session Management", () => {
    it("should maintain session after login", async () => {
      // Register and login
      await agent.post("/api/auth/register").send(testUser);

      await agent.post("/api/auth/login").send({
        username: testUser.username,
        password: testUser.password, // SỬA LỖI: Xóa chữ 'S' bị thừa
      }); // Try to access protected route

      const res = await agent.get("/api/profile");
      expect(res.statusCode).toBe(200);
    });

    it("should not access protected routes without login", async () => {
      // Tạo một agent mới không có session
      const newAgent = request.agent(app);
      const res = await newAgent.get("/api/profile");
      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe("Unauthorized");
    });
  });
});
