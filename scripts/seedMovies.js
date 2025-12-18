const mongoose = require('mongoose');
const path = require('path');

const { connectDB, closeDB } = require('../config/database');

async function seedMovies() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/csrf_app';
    
    console.log(`📌 Đang kết nối tới: ${mongoUri}`);
    await connectDB(mongoUri);
    console.log('✓ Kết nối DB thành công');

    // Import model Movie
    const Movie = require('../models/Movie');

    // Đọc dữ liệu từ JSON
    const moviesData = require('./movies.json');
    console.log(`📌 Đang tải ${moviesData.length} phim từ movies.json`);

    // Xóa dữ liệu cũ (tùy chọn - bỏ comment nếu muốn reset)
    // await Movie.deleteMany({});
    // console.log('✓ Đã xóa dữ liệu cũ');

    // Chèn dữ liệu mới
    for (const movieData of moviesData) {
      const existingMovie = await Movie.findOne({ title: movieData.title });
      
      if (existingMovie) {
        console.log(`⚠️  Phim "${movieData.title}" đã tồn tại, bỏ qua...`);
      } else {
        const newMovie = new Movie(movieData);
        await newMovie.save();
        console.log(`✓ Thêm phim: "${movieData.title}"`);
      }
    }

    const totalMovies = await Movie.countDocuments();
    console.log(`\n✅ Seed xong! Tổng số phim: ${totalMovies}`);

    await closeDB();
    process.exit(0);
  } catch (err) {
    console.error('❌ Lỗi seed:', err.message);
    process.exit(1);
  }
}

seedMovies();