import prisma from '../db.js'

// GET /api/notifications
// Get notifications for the logged in user
export async function getNotifications(req, res) {
  try {
    const userId = req.user.id
    const userRole = req.user.role

    const notifications = await prisma.notification.findMany({
      where: {
        OR: [
          { userId: userId },
          { role: userRole },
          { role: 'ALL' }
        ]
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    })

    res.json(notifications)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// PUT /api/notifications/:id/read
export async function markAsRead(req, res) {
  try {
    const id = parseInt(req.params.id)
    const notification = await prisma.notification.update({
      where: { id },
      data: { isRead: true }
    })
    res.json(notification)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// PUT /api/notifications/read-all
export async function markAllAsRead(req, res) {
  try {
    const userId = req.user.id
    const userRole = req.user.role

    await prisma.notification.updateMany({
      where: {
        isRead: false,
        OR: [
          { userId: userId },
          { role: userRole },
          { role: 'ALL' }
        ]
      },
      data: { isRead: true }
    })
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
