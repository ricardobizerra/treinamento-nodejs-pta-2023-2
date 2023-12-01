import express from "express";
import userController from "./controllers/UserController";

const routes = express.Router();

routes.post("/user", userController.create);
routes.get("/user", userController.get);
routes.get("/user/:age", userController.getById); 
routes.get("/average", userController.averageAge);
routes.delete("/user/:id", userController.delete);
routes.patch("/user/:id", userController.update);

export default routes;
