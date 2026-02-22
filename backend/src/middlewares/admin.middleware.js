export const adminOnly = (req, res, next) => {
  try {
    // authorize MUST run before this
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not authenticated" });
    }

    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Forbidden: Admin access only" });
    }

    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    res
      .status(500)
      .json({ message: "Server error during admin authorization" });
  }
};
