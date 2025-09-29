import express from "express";
const router = express.Router();

// Example GET endpoint
router.get("/", async (req, res) => {
  try {
    // Replace this with DB query later
    const notifications = [
      {
        id: 1,
        type: "like",
        message: "Sarah liked your song 'Midnight Echoes'",
        time: "2 minutes ago",
        unread: true,
      },
      {
        id: 2,
        type: "comment",
        message: "Mike commented on 'Digital Dreams': 'Amazing track!'",
        time: "15 minutes ago",
        unread: true,
      },
      {
        id: 3,
        type: "follow",
        message: "Alex started following you",
        time: "1 hour ago",
        unread: true,
      },
      {
        id: 4,
        type: "playlist",
        message: "Your song 'Bass Revolution' was added to 'Top Hits 2024'",
        time: "3 hours ago",
        unread: false,
      },
      {
        id: 5,
        type: "milestone",
        message: "'Acoustic Sunrise' reached 2,000 plays!",
        time: "1 day ago",
        unread: false,
      },
    ];
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

export default router;
