import userModel from "../modules/user.model.js"
import { sendEmail } from "../services/mail.service.js"
import jwt from "jsonwebtoken"

//register controller
export async function registerController(req,res){
     try {
        const  {email, password, username}= req.body
        const userAlreadyExist= await userModel.findOne({
            $or:[{email}, {username}]
        })

        if(userAlreadyExist){
            return res.status(400).json({
                message:"user already registered",
                success:false,
                err:"user already exist"
            })
        }

        const user = await userModel.create({
            email,
            password,
            username
        })
   const emailVerificationToken= jwt.sign({
    email:user.email,
    id:user._id
   },
   process.env.JWT_SECRET,)
        let mailSent = true
        try {
            await sendEmail({
                to: email,
                subject:"Welcome to QueryMind!",
                html:`<p>Hi ${username},</p><p>Thank you for registering at QueryMind! We're excited to have you on board.<br>
                Please verify your email by clicking on the link to login:
                </p> <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a> <p>Best regards,<br>The QueryMind Team</p>`
            })
        } catch (error) {
            mailSent = false
            console.error("Welcome email failed:", error.message)
        }

        return res.status(201).json({
            message: mailSent ? "user registered successfully" : "user registered successfully, but email could not be sent",
            user:{
                email:user.email,
                username:user.username
            },
            success:true,
            mailSent
        })
     } catch (error) {
        return res.status(500).json({
            message:"failed to register user",
            success:false,
            err:error.message
        })
     }
}


//login controller
export async function loginController(req,res){
    try {
        const {email, password}= req.body
        const user= await userModel.findOne({email})
        if(!user){
            return res.status(400).json({
                message:"user not found",
                success:false,
                err:"user not found"
            })
        }
        const isMatch= await user.comparePassword(password)
        if(!isMatch){
            return res.status(400).json({
                message:"invalid credentials",
                success:false,
                err:"invalid credentials"
            })
        }
        if(!user.verified){
            return res.status(400).json({
                message:"email not verified",
                success:false,
                err:"email not verified"
            })
        }
        const token= jwt.sign({
            email:user.email,
            id:user._id
        },
        process.env.JWT_SECRET,
        {expiresIn:"7d"}
        )
        res.cookie("token", token)

        return res.status(200).json({
            message:"user logged in successfully",
            success:true,
            token,
            user:{
                email:user.email,
                username:user.username
            }
        })
    } catch (error) {
        return res.status(500).json({
            message:"failed to login user",
            success:false,
            err:error.message
        })
    }

}

//getMe controller
export async function getMe(req,res){
    const id=req.user.id
    try {
        const user= await userModel.findById(id).select("-password")
        if(!user){
            return res.status(400).json({
                message:"user not found",
                success:false,
                err:"user not found"
            })
        }
        return res.status(200).json({
            message:"user fetched successfully",
            success:true,
            user:{
                email:user.email,
                username:user.username,
                verified:user.verified
            }
        })
    } catch (error) {
        return res.status(500).json({
            message:"failed to fetch user",
            success:false,
            err:error.message
        })
    }
}

//verifyEmail controller
export async function verifyEmail(req, res){
    const {token}= req.query
    
    if(!token){
        return res.status(400).json({
            message:"token not found",
            success:false,
            err:"token not found"
        })
    }

    try {
        const decoded= jwt.verify(token, process.env.JWT_SECRET)
        const user= await userModel.findOne({email:decoded.email})
        if(!user){
            return res.status(400).json({
                message:"User not found",
                success:false,
                err:"User not found"
            })
        }
  if(user.verified){
            const htmlContent= `<p>Hi ${user.username},</p><p>Your email is already verified. You can log in to your account and start using QueryMind!<br>
            <a href="http://localhost:3000/api/auth/login">Login</a> to access your account.</p><p>Best regards,<br>The QueryMind Team</p>`
            return res.status(200).send(htmlContent)
        }
        

        user.verified= true
        await user.save()
        
        const htmlContent= `<p>Hi ${user.username},</p><p>Your email has been successfully verified. You can now log in to your account and start using QueryMind!
        <br><a href="http://localhost:3000/api/auth/login">Login</a> to access your account.</p>
        </p><p>Best regards,<br>The QueryMind Team</p> `

        return res.status(200).send(htmlContent)

        

    } catch (error) {
        return res.status(400).json({
            message:"Invalid or expired token",
            success:false,
            err:error.message
        })
    } 
}  

//resend verification email controller
export async function resendVerificationEmail(req,res){
    const {email}= req.body
    try {
        const user= await userModel.findOne({email})
        if(!user){
            return res.status(400).json({
                message:"User not found",
                success:false,
                err:"User not found"
            })
        }
        if(user.verified){
            return res.status(400).json({
                message:"Email already verified",
                success:false,
                err:"Email already verified"
            })
        }

          const now = Date.now();

if (user.lastEmailSentAt && now - user.lastEmailSentAt < 60000) {
    return res.status(429).json({
        success: false,
        message: "Please wait before requesting again"
    });
}

     user.lastEmailSentAt = new Date();
     await user.save();


        const emailVerificationToken= jwt.sign({
            email:user.email,
            id:user._id
           },
           process.env.JWT_SECRET,)
              let mailSent = true
        try {
            await sendEmail({
                to: email,
                subject:"QueryMind - Email Verification",
                html:`<p>Hi ${user.username},</p><p>We received a request to resend the email verification link for your QueryMind account.<br>
                Please verify your email by clicking on the link below:</p><a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>`
            })
        } catch (error) {
            mailSent = false
            console.error("Resend verification email failed:", error.message)
        }   
        return res.status(200).json({
            message: mailSent ? "Verification email resent successfully" : "Failed to resend verification email, but user is still registered",
            success:true,
            mailSent
        })
    } catch (error) {
        return res.status(500).json({
            message:"Failed to resend verification email",
            success:false,
            err:error.message
        })
    }
}