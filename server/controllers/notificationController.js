const Notification = require("../models/notification.js");

// Get notifications for logged in candidate
const getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const notifications = await Notification.find({ recipientId: userId }).sort({ createdAt: -1 }).limit(30);
        const unreadCount = await Notification.countDocuments({ recipientId: userId, isRead: false });

        return res.status(200).json({
            notifications,
            unreadCount,
        });
    } catch (err) {
        console.error("Get Notifications Error:", err);
        return res.status(500).json({ message: "Failed to fetch notifications." });
    }
};

// Mark single notification as read
const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Notification.findOneAndUpdate(
            { _id: id, recipientId: req.user.id },
            { $set: { isRead: true } },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Notification not found." });
        }

        return res.status(200).json({
            message: "Notification marked as read.",
            notification: updated,
        });
    } catch (err) {
        console.error("Mark Notification Read Error:", err);
        return res.status(500).json({ message: "Failed to update notification." });
    }
};

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { recipientId: req.user.id, isRead: false },
            { $set: { isRead: true } }
        );

        return res.status(200).json({ message: "All notifications marked as read." });
    } catch (err) {
        console.error("Mark All Read Error:", err);
        return res.status(500).json({ message: "Failed to update notifications." });
    }
};

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead,
};
