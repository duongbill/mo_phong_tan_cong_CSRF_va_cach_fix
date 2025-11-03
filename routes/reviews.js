const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const { isAuthenticated } = require("../middleware/auth");

// Get all reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("userId", "username avatar")
      .sort({ createdAt: -1 });

    res.render("reviews/index", {
      title: "Reviews",
      reviews,
      moment: require("moment"),
    });
  } catch (err) {
    console.error("Error fetching reviews:", err);
    req.flash("error", "Error loading reviews");
    res.redirect("/");
  }
});

// Create review form
router.get("/new", isAuthenticated, (req, res) => {
  res.render("reviews/new", {
    title: "New Review",
  });
});

// Create review
router.post("/", isAuthenticated, async (req, res) => {
  try {
    const { content, rating } = req.body;
    await Review.create({
      content,
      rating: parseInt(rating),
      userId: req.session.userId,
    });
    req.flash("success", "Review created successfully");
    res.redirect("/reviews");
  } catch (err) {
    console.error("Error creating review:", err);
    req.flash("error", "Error creating review");
    res.redirect("/reviews/new");
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
    res.json({ likes: review.likes.length });
  } catch (err) {
    console.error("Error liking review:", err);
    res.status(500).json({ error: "Error processing like" });
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

    await review.remove();
    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error("Error deleting review:", err);
    res.status(500).json({ error: "Error deleting review" });
  }
});

module.exports = router;
