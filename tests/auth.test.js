const request = require("supertest");
const { connectDB, closeDB } = require("../config/database");
const { app } = require("../server");
const User = require("../models/User");

describe("Authentication Tests", () => {
  beforeAll(async () => {
    // Connect to test database
    await connectDB("mongodb://localhost:27017/csrf_app_test");
  });

  beforeEach(async () => {
    // Clear users collection before each test
    await User.deleteMany({});
  });

  afterAll(async () => {
    // Disconnect after all tests
    await closeDB();
  });

  describe("Registration", () => {
    const newUser = {
      username: "testuser",
      email: "test@example.com",
      password: "Test123!",
      confirmPassword: "Test123!",
    };

    it("should register a new user successfully", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty(
        "message",
        "User registered successfully"
      );

      // Check if user was actually created in database
      const user = await User.findOne({ username: newUser.username });
      expect(user).toBeTruthy();
      expect(user.email).toBe(newUser.email);
    });

    it("should fail registration with missing fields", async () => {
      const response = await request(app).post("/api/auth/register").send({
        username: "testuser",
        password: "Test123!",
      });

      expect(response.status).toBe(400);
    });

    it("should fail registration with existing username", async () => {
      // First create a user
      await User.create(newUser);

      // Try to create another user with same username
      const response = await request(app)
        .post("/api/auth/register")
        .send(newUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("Login", () => {
    const userCredentials = {
      username: "testuser",
      password: "Test123!",
    };

    beforeEach(async () => {
      // Create a test user before each login test
      await request(app)
        .post("/api/auth/register")
        .send({
          ...userCredentials,
          email: "test@example.com",
          confirmPassword: "Test123!",
        });
    });

    it("should login successfully with correct credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send(userCredentials);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", "Logged in successfully");
      expect(response.headers).toHaveProperty("set-cookie");
    });

    it("should fail login with incorrect password", async () => {
      const response = await request(app).post("/api/auth/login").send({
        username: userCredentials.username,
        password: "wrongpassword",
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error");
    });

    it("should fail login with non-existent username", async () => {
      const response = await request(app).post("/api/auth/login").send({
        username: "nonexistentuser",
        password: "Test123!",
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("Logout", () => {
    it("should logout successfully", async () => {
      // First register and login
      const user = {
        username: "testuser",
        email: "test@example.com",
        password: "Test123!",
        confirmPassword: "Test123!",
      };

      await request(app).post("/api/auth/register").send(user);

      const loginResponse = await request(app).post("/api/auth/login").send({
        username: user.username,
        password: user.password,
      });

      const cookie = loginResponse.headers["set-cookie"];

      // Then try to logout
      const response = await request(app)
        .post("/api/auth/logout")
        .set("Cookie", cookie);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "Logged out successfully"
      );
    });
  });
});
