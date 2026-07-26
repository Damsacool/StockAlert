const prisma = require('../config/database');

const tenant = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'User not authenticated',
      });
    }

    const profile = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { tenantId: true, role: true, plan: true },
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'USER_NOT_FOUND',
        message: 'User profile not found',
      });
    }

    req.tenantId = profile.tenantId;
    req.userRole = profile.role;
    req.userPlan = profile.plan;

    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'TENANT_ERROR',
      message: 'Failed to resolve tenant context',
    });
  }
};

module.exports = tenant;
