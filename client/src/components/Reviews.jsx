import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Grid,
  Avatar,
  IconButton,
  Alert,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { reviewService } from '../services/api';

const Reviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [editingReview, setEditingReview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const data = await reviewService.getReviews();
      setReviews(data);
    } catch (error) {
      setError('Failed to load reviews');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingReview) {
        await reviewService.updateReview(editingReview._id, {
          content: newReview,
        });
        setSuccess('Review updated successfully');
        setEditingReview(null);
      } else {
        await reviewService.createReview({ content: newReview });
        setSuccess('Review posted successfully');
      }
      setNewReview('');
      fetchReviews();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save review');
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setNewReview(review.content);
    setError('');
    setSuccess('');
  };

  const handleDelete = async (reviewId) => {
    try {
      await reviewService.deleteReview(reviewId);
      setSuccess('Review deleted successfully');
      fetchReviews();
    } catch (error) {
      setError('Failed to delete review');
    }
  };

  const handleCancel = () => {
    setEditingReview(null);
    setNewReview('');
    setError('');
    setSuccess('');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Reviews
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {user && (
          <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              placeholder="Write your review..."
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              required
            />
            <Box sx={{ mt: 2 }}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                sx={{ mr: 1 }}
              >
                {editingReview ? 'Update Review' : 'Post Review'}
              </Button>
              {editingReview && (
                <Button
                  onClick={handleCancel}
                  variant="outlined"
                >
                  Cancel
                </Button>
              )}
            </Box>
          </Box>
        )}

        <Grid container spacing={2}>
          {reviews.map((review) => (
            <Grid item xs={12} key={review._id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar 
                      src={review.userId?.avatar} 
                      alt={review.userId?.username}
                    />
                    <Typography sx={{ ml: 2 }} variant="subtitle1">
                      {review.userId?.username}
                    </Typography>
                  </Box>
                  <Typography variant="body1" paragraph>
                    {review.content}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(review.createdAt).toLocaleString()}
                  </Typography>

                  {user && user._id === review.userId?._id && (
                    <Box sx={{ mt: 2 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(review)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(review._id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Reviews;