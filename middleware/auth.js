module.exports = {
  isAuthenticated: (req, res, next) => {
    if (req.session.isValid && req.session.userId) {
      return next();
    }
    req.flash("error", "Please log in to view this resource");
    res.redirect("/auth/login");
  },

  isNotAuthenticated: (req, res, next) => {
    if (!req.session.isValid) {
      return next();
    }
    res.redirect("/");
  },

  csrfProtection: (req, res, next) => {
    // Generate CSRF token if not exists
    if (!req.session.csrfToken) {
      req.session.csrfToken = Math.random().toString(36).substring(2, 15);
    }

    // Check CSRF token on POST requests
    if (req.method === "POST") {
      if (req.body._csrf !== req.session.csrfToken) {
        return res.redirect("/security-alert.html");
      }
    }

    // Add CSRF token to all views
    res.locals.csrfToken = req.session.csrfToken;
    next();
  },
};
