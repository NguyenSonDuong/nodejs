import express from 'express';
import UserController   from '../controller/user_control.js';
import {isAuth} from '../jwt/AuthMiddleware.js'

const router = express.Router();
const user_control = new UserController();

export function InitRouter(app){
    
    router.post("/",(req, res) =>{
        return res.status(200).json({"ok":"ok"});
    })

    router.post('/api/login',user_control.Login);
    router.post('/api/register',user_control.RegisterUser);
    
    router.use(isAuth);
    
    router.get("/api/user",user_control.GetInfoUser);
    router.get("/api/userRole",user_control.GetInfoUserRole);
    
    return app.use("/", router);
}

export default router;