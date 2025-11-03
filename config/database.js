// config/database.js (PHIÊN BẢN SỬA LẠI)
const mongoose = require("mongoose");

// Hàm kết nối
async function connectDB(databaseUrl = "mongodb://localhost:27017/csrf_app") {
  // Chỉ kết nối nếu chưa có kết nối
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(databaseUrl);
      console.log(`Connected to MongoDB at ${databaseUrl}`);
    } catch (err) {
      console.error("MongoDB connection error:", err);
      throw err;
    }
  }
}

// Hàm ngắt kết nối
async function closeDB() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

// Hàm dọn dẹp (dùng cho test)
async function clearDB() {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
}

module.exports = { connectDB, closeDB, clearDB };
