export const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

export const analystOnly = (req, res, next) => {
  if (req.user.role !== "analyst" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Analyst access only" });
  }
  next();
};