import express, { RequestHandler } from "express";
import { CreateUserHandler } from "../../application/createUser";
import {
  MongoUserQueryHandler,
  MongoUserRepository,
} from "../../persistance/user";

const router = express.Router();

router.post("/signup", async (req, res, next) => {
  const userQueryHandler = new MongoUserQueryHandler();
  const userRepository = new MongoUserRepository();
  const handler = new CreateUserHandler(userQueryHandler, userRepository);
  try {
    const user = await handler.handle(req.body);
    return res.json(user);
  } catch (e) {
    next(e);
  }
});

router.post("/login", async (req, res, next) => {});

// router.delete("/:userId", (req, res, next) => {
//   User.deleteOne({ _id: req.params.userId })
//     .exec()
//     .then((result) => {
//       res.status(200).json({ message: "user deleted" });
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).json({ error: err });
//     });
// });

export default router;
