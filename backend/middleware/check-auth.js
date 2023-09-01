const jwt = require("jsonwebtoken");

//check if token
const checkToken = (token) => {
  try {
    const authToken = token.split(" ")[1];
    return authToken;
  } catch (error) {
    res.status(401).json({ message: "No token in the request." });
  }
};
//check if token is valid
const tokenIsValid = (token) => {
  try {
    jwt.verify(
      token,
      "this_is_the_secret_use_to_sign_the_token_it_has_to_be_a_very_long_sentence"
    );
  } catch (error) {
    res.status(401).json({ message: "Invalid token." });
  }
};

module.exports = (req, res, next) => {
  try {
    const token = checkToken(req.headers.authorization);
    tokenIsValid(token);
    next();
  } catch (error) {
    res.status(401).json({ message: "No token in the request." });
  }
};
