import mongoose from 'mongoose';
import Course from '../model/user_model.js';
import bcrypt from 'bcrypt'
import {Role} from '../model/role.js';
import {generateToken , verifyToken} from "../jwt/jwtHelper.js";

const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || "15d";
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "access-token-secret-duanmo-nguyenduong9x.com-green-cat-a@";

class UserController{
    Login(req, res){
        let username = req.body.username;
        let password = req.body.password;
        Course.findOne({ username: username},'_id username password role', (error, user)=>{
            if (error) return handleError((error)=>{
                res.status(500).json({
                    "status":"error",
                    "title": "Đăng nhập không thành công vui lòng thử lại",
                    "content": error.message,
                });
            });
            console.log(user);
            if(user) {
                let passwordCheck = bcrypt.compareSync(password, user.password);
                if(passwordCheck){
                    const accessToken = generateToken(user, accessTokenSecret, accessTokenLife).then((accessToken)=>{
                        return res.status(200).json({
                            "status":"success",
                            "title":"Đăng nhập thành công",
                            "content":{
                                "token" : accessToken,
                                "detail": user
                            },
                        });
                    }).catch((error)=>{
                        return res.status(401).send({
                            "status":"error",
                            "title":error,
                            "content":null,
                        });
                    })
                }else{
                    return res.status(401).send({
                        "status":"error",
                        "title":"Đăng nhập thất bại vui lòng kiểm tra lại tên đăng nhập hoặc mật khẩu",
                        "content":null,
                    });
                }
                
            }else{
                return res.status(401).send({
                    "status":"error",
                    "title":"Đăng nhập thất bại vui lòng kiểm tra lại tên đăng nhập hoặc mật khẩu",
                    "content":null,
                });
            }
        });
    }

    RegisterUser (req, res) {
        let username = req.body.username;
        let email = req.body.email;
        let password = bcrypt.hashSync(req.body.password,10); 
        if(!username || !email || !password){
            return res.status(400).json({
                "status":"error",
                "title": "Vui lòng điền đầy đủ thông tin",
                "content": "",
            });
        }
        console.log(username, password);
        Course.findOne({ username: username},'_id username', (error, user)=>{
            if (error) return handleError((error)=>{
                return res.status(400).json({
                    "status":"error",
                    "title": "Đăng ký tài khoản không thành công vui lòng thử lại",
                    "content": error.message,
                });
            });
    
            if(user) {
                return res.status(409).send({
                    "status":"error",
                    "title":"Tài khoản đã tồn tại vui lòng thay bằng tài khoản mới",
                    "content":null,
                });
            }else{
                const userinfo = new Course({
                    _id: mongoose.Types.ObjectId(),
                    email:email,
                    username: username,
                    password: password,
                    role: [
                        Role.USER.READ,
                        Role.USER.DELETE,
                        Role.USER.UPDATE,
                        Role.USER.VIEW,
                    ]
                });
                console.log(userinfo);
             userinfo
                .save()
                .then((userinfo) => {
                   res.status(200).json({
                    "status":"success",
                    "title": "Đăng ký tài khoản thành công",
                    "content": Course,
                    });
                })
                .catch((error) => {
                    console.log(error);
                  res.status(500).json({
                    "status":"error",
                    "title": "Đăng ký tài khoản không thành công vui lòng thử lại",
                    "content": error.message,
                });
                });
            }
        });
    }

    GetInfoUser(req, res){
        console.log(req.jwtDecoded);
        let username = req.body.username;
        try{
            Course.findOne({username:username},"_id usename password",(error, user) => {
                if(error) {
                    return res.status(401).json({
                        "status":"error",
                            "title": "Lỗi không xác định",
                            "content": error,
                    })
                }
                return res.status(401).json({
                    "status":"error",
                        "title": "Lỗi không xác định",
                        "content": error,
                })
            })
        }catch(error){
            return res.status(401).json({
                "status":"error",
                    "title": "Lỗi không xác định",
                    "content": error,
            })
        }
    }
    
    GetInfoUserRole(req, res){
        AuthUserRole(req,res,Role.USER.READ,(data,role) => {
            Course.findOne({username: data.username},"_id usename password",(error, user) => {
                if(error) {
                    return res.status(400).json({
                        "status":"error",
                        "title": "Lỗi không xác định",
                        "content": error,
                    })
                }
                return res.status(200).json(user)
            })
        }, error => {
            return res.status(401).json({
                "status":"error",
                "title": error
            })
        });
            
    }
    
    AuthUserRole(req, res, role, action, error){
        let data = req.jwtDecoded.data;
        if(data.role.includes(role)){
            action(data, role);
        }else{
            error('Unauthorized.');
        }
    }
}


export default UserController;