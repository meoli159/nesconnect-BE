const jwt = require("jsonwebtoken");

module.exports.verifyToken = (req, res, next) => {
  // const token = req.header("Authorization");
  const token = req.cookies.token
  if (token) {
    // const accessToken = token.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({message:"Invalid Token" });
      }
      req.user = user;
      next();
    });
  } else return res.status(401).json({message:"You're not authenticated" });
};

// isAdmin = (req, res, next) => {
//   User.findById(req.user._id).exec((err, user) => {
//     if (err) {
//       res.status(500).send(err );
//       return;
//     }
//     Role.find(
//       {
//         _id: { $in: user.roles },
//       },
//       (err, roles) => {
//         if (err) {
//           res.status(500).send(err );
//           return;
//         }
//         for (let i = 0; i < roles.length; i++) {
//           if (roles[i].name === "admin") {
//             next();
//             return;
//           }
//         }
//         res.status(403).send({message:"Require Admin Role!" });
//         return;
//       }
//     );
//   });
// };

// isModerator = (req, res, next) => {
//   User.findById(req.userId).exec((err, user) => {
//     if (err) {
//       res.status(500).send({ message: err });
//       return;
//     }

//     Role.find(
//       {
//         _id: { $in: user.roles },
//       },
//       (err, roles) => {
//         if (err) {
//           res.status(500).send({ message: err });
//           return;
//         }

//         for (let i = 0; i < roles.length; i++) {
//           if (roles[i].name === "moderator") {
//             next();
//             return;
//           }
//         }

//         res.status(403).send({ message: "Require Moderator Role!" });
//         return;
//       }
//     );
//   });
// };

// verifyTokenAndAdminAuth = (req, res, next) => {
//   authJwt.verifyToken(req, res, () => {
//     if (req.user._id !== req.params._id) {
//       authJwt.isAdmin(req, res,next);
//     } else {
//       if (req.user._id === req.params._id) {
        
//         next();

//       } else {
//         return res.status(403).json({message:"You are not allowed to do that"});
//       }
//     }
//   });
// };

