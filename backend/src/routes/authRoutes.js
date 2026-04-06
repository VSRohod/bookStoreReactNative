import express from "express"
import User from "../models/User.js";
import jwt from "jsonwebtoken"

const generateToken = (userId) => {
    // jwt.sign({userId})
    return jwt.sign({userId}, process.env.JWT_SECRET, { expiresIn : "15d"})
}


const router = express.Router();

router.get("/register", async (req , res) => {
    try {
        const {username, email, password} = req.body

        if(!username || !email || !password){
            return res.status(400).json({ message : "Todos os campos são obrigatórios!"})
        }

        if(password.length < 6){
            return res.status(400).json({ message : "A senha deverá ter mais de 6 caracteres!"})
        }

        if(username.length < 3){
            return res.status(400).json({ message : "O usuário deverá ter mais de 3 caracteres!"})
        }

        // checar se existe
        const existingEmail = await User.findOne({email})
        if(existingEmail){
            return res.status(400).json({ message : "Email já cadastrado!"}) 
        }

        const existingUsername = await User.findOne({username})
        if(existingUsername){
            return res.status(400).json({ message : "Nome já cadastrado!"}) 
        }

        // coletar avatar aleatório
        const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

        const user = new User({
            email,
            username,
            password,
            profileImage: "",
        })

        await user.save();

        const token = generateToken(user._id);

        res.status(201).json({
            token , 
            user : {
                _id : user._id,
                username : user.username,
                email : user.email,
                profileImage : user.profileImage,
            }
        })

    } catch (error) {

    }
})

router.get("/login", async (req , res) => {
    res.send("login");
})

export default router