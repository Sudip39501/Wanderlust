module.exports = (route,fn) => {
  return function (req, res, next) {
    fn(req, res, next).catch(err => {
        req.flash("error" , [err.message]);
        res.redirect(route);
    });
  };
};