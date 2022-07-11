const { verify} = require("jsonwebtoken");

module.exports = {
  checkToken: (req, res, next) => {
    let token = req.get("authorization");
    try{
      if (token) {
        // Remove Bearer from string
        token = token.slice(7);
        //verify
        verify(token, 'SECRETKEY', (err, decoded) => {
          console.log('decoded'+decoded.username);
          if (err) {
            return res.json({
              success: 0,
              message: "Invalid Token..."
            });
          } else {
            req.decoded = decoded;
            console.log('req.decoded'+req.decoded['userId']),
            next();
          }
        });
      } else {
        return res.json({
          success: 0,
          message: "Access Denied! Unauthorized User"
        });
      }
    }catch(err){
      return res.status(401).send({
        msg: 'Your session is not valid!'
      });
    }
    
  }
};
