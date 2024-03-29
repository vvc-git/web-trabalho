require("dotenv").config();

const jwt = require("jsonwebtoken");
const { promisify } = require("util");

// verifica se o usuario esta autenticado no sistema do site
async function validate(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.sendStatus(401);
  }

  const [, token] = authorization.split(" ");

  try {
    // Converte a função jwt.verify em uma versão promisificada
    await promisify(jwt.verify)(token, process.env.PRIVATEKEY_TOKEN);

    return next();
  } catch (err) {
    return res.sendStatus(401);
  }
}

module.exports = validate;
