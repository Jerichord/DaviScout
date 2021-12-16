module.exports = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch(next); //catch any errors and pass it to next
  };
};
