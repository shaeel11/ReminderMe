const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { protect } = require('../middleware/auth'); // This would be your auth middleware to ensure the user is logged in. ------------------------------------------------


router.post('/api/events', protect, async (req, res) => {
    const { title, start, end, description } = req.body;
  
    try {
      const newEvent = new Event({
        userId: req.user._id, // assuming you have user authentication middleware
        title,
        start,
        end,
        description,
      });
  
      await newEvent.save();
      res.status(201).json(newEvent);
    } catch (err) {
      res.status(500).json({ message: 'Error creating event' });
    }
  });
  
  router.get('/api/events', protect, async (req, res) => {
    try {
      const events = await Event.find({ userId: req.user._id });
      res.status(200).json(events);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching events' });
    }
  });
  
  router.put('/api/events/:id', protect, async (req, res) => {
    try {
      const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
  
      if (!updatedEvent) {
        return res.status(404).json({ message: 'Event not found' });
      }
  
      res.json(updatedEvent);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // DELETE /api/events/:id - Delete event
router.delete('/api/events/:id', protect, async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id // Only delete if this user owns the event
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found or unauthorized' });
    }

    res.status(200).json({ message: 'Event deleted' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
