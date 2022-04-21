import {generateToken , verifyToken} from "../jwt/jwtHelper.js";
const debug = console.log.bind(console);

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "access-token-secret-duanmo-nguyenduong9x.com-green-cat-a@";

export function isAuth(req, res, next)  {
  const tokenFromClient = req.headers["x-access-token"];
  if (tokenFromClient) {
      const decoded = verifyToken(tokenFromClient, accessTokenSecret).then((token)=>{
        req.jwtDecoded = token;
        next();
      }).catch((error)=>{
        return res.status(401).json({
          message: 'Unauthorized.',
        });
      })
      
  } else {
    return res.status(401).send({
      message: 'Unauthorized.',
    });
  }
}