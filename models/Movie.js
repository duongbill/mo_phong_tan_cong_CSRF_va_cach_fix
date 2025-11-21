const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    rating: { type: Number, min: 0, max: 10, default: 0 },
    year: { type: String },
    genres: [String],
    description: String,
    duration: String, // định dạng "2h 05m"
    country: String,
    directors: [String],
    actors: [String],
    videoUrl: String,
    posterUrl: String,
    createdAt: { type: Date, default: Date.now },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

movieSchema.virtual('poster').get(function posterGetter() {
  return this.posterUrl;
});

movieSchema.virtual('backdrop').get(function backdropGetter() {
  return this.posterUrl;
});

movieSchema.virtual('director').get(function directorGetter() {
  return Array.isArray(this.directors) && this.directors.length > 0 ? this.directors[0] : undefined;
});

movieSchema.virtual('cast').get(function castGetter() {
  return Array.isArray(this.actors)
    ? this.actors.map((name) => ({
        name,
        character: '',
        avatar: '',
      }))
    : undefined;
});

// ⚠️ Dùng đúng biến `movieSchema`
module.exports = mongoose.models.Movie || mongoose.model("Movie", movieSchema);
