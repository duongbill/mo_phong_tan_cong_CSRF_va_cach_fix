const express = require("express");
const router = express.Router();
const Review = require("../../models/Review");
const { isAuthenticated } = require("../../middleware/auth");

// Get all reviews
router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 0;
    const reviews = await Review.find()
      .populate("userId", "username avatar")
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json(reviews);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Create new review
router.post("/", isAuthenticated, async (req, res) => {
  try {
    const { content, rating } = req.body;
    const review = await Review.create({
      content,
      rating: parseInt(rating),
      userId: req.session.userId,
    });

    const populatedReview = await Review.findById(review._id).populate(
      "userId",
      "username avatar"
    );

    res.status(201).json(populatedReview);
  } catch (err) {
    console.error("Error creating review:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Like/Unlike review
router.post("/:id/like", isAuthenticated, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    const likeIndex = review.likes.indexOf(req.session.userId);
    if (likeIndex === -1) {
      review.likes.push(req.session.userId);
    } else {
      review.likes.splice(likeIndex, 1);
    }

    await review.save();
    res.json({ likes: review.likes });
  } catch (err) {
    console.error("Error processing like:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete review
router.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    if (review.userId.toString() !== req.session.userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await review.deleteOne();
    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error("Error deleting review:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
