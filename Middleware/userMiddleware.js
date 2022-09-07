const passwordMatch = (req, res, next) => {
    if (req.body.password1 !== req.body.password2) {
      res.status(400).send("Passwords do not match");
      return;
    }
    next();
  };

  const validateNewUser = async (req, res, next) => {
    const existingMongoU = await getMongoUserByEmail(req.body.email);
      if (!existingMongoU) {
        next();
      } else {
        res.status(400).send("User already exists");
      }
    };


  module.exports = {passwordMatch, validateNewUser}