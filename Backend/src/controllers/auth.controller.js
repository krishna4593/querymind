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
            const verificationEmailTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; padding: 0 20px; }
        .card { background: #fff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #31b8c6 0%, #1e9aaf 100%); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
        .header p { margin: 10px 0 0 0; font-size: 14px; opacity: 0.9; }
        .body { padding: 40px 30px; }
        .body h2 { color: #31b8c6; margin: 0 0 15px 0; font-size: 20px; }
        .body p { margin: 0 0 15px 0; color: #555; }
        .highlight { color: #31b8c6; font-weight: 600; }
        .button-container { text-align: center; margin: 30px 0; }
        .button { display: inline-block; background: #31b8c6; color: white; padding: 14px 40px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; transition: background 0.3s; }
        .button:hover { background: #1e9aaf; }
        .footer { background: #f9f9f9; padding: 20px 30px; text-align: center; border-top: 1px solid #e0e0e0; font-size: 12px; color: #888; }
        .footer p { margin: 5px 0; }
        .info-box { background: #f0f7f9; border-left: 4px solid #31b8c6; padding: 15px; margin: 20px 0; border-radius: 4px; }
        .info-box p { margin: 0; font-size: 13px; color: #444; }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <div class="header">
                <h1>QueryMind</h1>
                <p>Verify Your Email Address</p>
            </div>
            <div class="body">
                <h2>Welcome, <span class="highlight">${username}</span>!</h2>
                <p>Thank you for joining QueryMind! We're thrilled to have you on board.</p>
                <p>To complete your registration and start using QueryMind, please verify your email address by clicking the button below:</p>
                <div class="button-container">
                    <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}" class="button">Verify Email Address</a>
                </div>
                <div class="info-box">
                    <p><strong>Why verify?</strong> Email verification helps us keep your account secure and ensures you receive important notifications.</p>
                </div>
                <p style="font-size: 13px; color: #888; margin-top: 30px;">If you didn't create this account, you can safely ignore this email.</p>
            </div>
            <div class="footer">
                <p>&copy; 2024 QueryMind. All rights reserved.</p>
                <p>If the button doesn't work, copy and paste this link in your browser:<br><span style="color: #31b8c6; word-break: break-all;">http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}</span></p>
            </div>
        </div>
    </div>
</body>
</html>
            `;
            await sendEmail({
                to: email,
                subject:"Welcome to QueryMind! Verify Your Email",
                html: verificationEmailTemplate
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

        const successHtmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verified</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
        .container { max-width: 600px; margin: 60px auto; padding: 0 20px; }
        .card { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .success-header { background: linear-gradient(135deg, #31b8c6 0%, #1e9aaf 100%); color: white; padding: 50px 30px; text-align: center; }
        .checkmark { width: 80px; height: 80px; margin: 0 auto 20px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 40px; }
        .success-header h1 { margin: 0 0 10px 0; font-size: 32px; font-weight: 700; }
        .success-header p { margin: 0; font-size: 16px; opacity: 0.9; }
        .body { padding: 45px 30px; text-align: center; }
        .body h2 { color: #31b8c6; margin: 0 0 15px 0; font-size: 22px; font-weight: 600; }
        .body p { margin: 0 0 20px 0; color: #666; font-size: 15px; }
        .highlight { color: #31b8c6; font-weight: 600; }
        .button-container { margin: 35px 0; }
        .button { display: inline-block; background: #31b8c6; color: white; padding: 14px 50px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; transition: all 0.3s; cursor: pointer; border: none; }
        .button:hover { background: #1e9aaf; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(49, 184, 198, 0.4); }
        .info-list { background: #f9f9f9; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: left; }
        .info-list ul { margin: 0; padding: 0 0 0 20px; }
        .info-list li { margin: 12px 0; color: #555; font-size: 14px; }
        .footer { background: #f5f5f5; padding: 25px 30px; text-align: center; border-top: 1px solid #e0e0e0; font-size: 12px; color: #999; }
        .footer p { margin: 8px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <div class="success-header">
                <div class="checkmark">✓</div>
                <h1>Email Verified!</h1>
                <p>Your email has been successfully verified</p>
            </div>
            <div class="body">
                <h2>Welcome to QueryMind, <span class="highlight">${user.username}</span>!</h2>
                <p>Your email <span class="highlight">${user.email}</span> has been verified successfully.</p>
                <p>You can now log in to your account and start chatting with our AI assistant.</p>
                <div class="button-container">
                    <a href="http://localhost:5173/login" class="button">Go to Login</a>
                </div>
                <div class="info-list">
                    <ul>
                        <li>✓ Email verified and account activated</li>
                        <li>✓ You can now log in with your credentials</li>
                        <li>✓ Start using QueryMind AI features</li>
                    </ul>
                </div>
                <p style="font-size: 13px; color: #999; margin-top: 35px;">If you have any questions, feel free to contact our support team.</p>
            </div>
            <div class="footer">
                <p>&copy; 2024 QueryMind. All rights reserved.</p>
                <p>This email was sent to ${user.email}</p>
            </div>
        </div>
    </div>
</body>
</html>
        `;

  if(user.verified){
            const alreadyVerifiedTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Already Verified</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
        .container { max-width: 600px; margin: 60px auto; padding: 0 20px; }
        .card { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #31b8c6 0%, #1e9aaf 100%); color: white; padding: 50px 30px; text-align: center; }
        .icon { width: 80px; height: 80px; margin: 0 auto 20px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 40px; }
        .header h1 { margin: 0 0 10px 0; font-size: 32px; font-weight: 700; }
        .header p { margin: 0; font-size: 16px; opacity: 0.9; }
        .body { padding: 45px 30px; text-align: center; }
        .body h2 { color: #31b8c6; margin: 0 0 15px 0; font-size: 22px; font-weight: 600; }
        .body p { margin: 0 0 20px 0; color: #666; font-size: 15px; }
        .button-container { margin: 35px 0; }
        .button { display: inline-block; background: #31b8c6; color: white; padding: 14px 50px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; transition: all 0.3s; }
        .button:hover { background: #1e9aaf; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(49, 184, 198, 0.4); }
        .footer { background: #f5f5f5; padding: 25px 30px; text-align: center; border-top: 1px solid #e0e0e0; font-size: 12px; color: #999; }
        .footer p { margin: 8px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <div class="header">
                <div class="icon">ℹ️</div>
                <h1>Already Verified</h1>
                <p>Your email is already verified</p>
            </div>
            <div class="body">
                <h2>Welcome back, <span style="color: #31b8c6;">${user.username}</span>!</h2>
                <p>Your email has already been verified. You can proceed to log in to your QueryMind account.</p>
                <div class="button-container">
                    <a href="http://localhost:5173/login" class="button">Go to Login</a>
                </div>
            </div>
            <div class="footer">
                <p>&copy; 2024 QueryMind. All rights reserved.</p>
                <p>This email was sent to ${user.email}</p>
            </div>
        </div>
    </div>
</body>
</html>
            `;
            return res.status(200).send(alreadyVerifiedTemplate)
        }
        

        user.verified= true
        await user.save()

        return res.status(200).send(successHtmlTemplate)

        

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
            const resendEmailTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; padding: 0 20px; }
        .card { background: #fff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #31b8c6 0%, #1e9aaf 100%); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
        .header p { margin: 10px 0 0 0; font-size: 14px; opacity: 0.9; }
        .body { padding: 40px 30px; }
        .body h2 { color: #31b8c6; margin: 0 0 15px 0; font-size: 20px; }
        .body p { margin: 0 0 15px 0; color: #555; }
        .highlight { color: #31b8c6; font-weight: 600; }
        .button-container { text-align: center; margin: 30px 0; }
        .button { display: inline-block; background: #31b8c6; color: white; padding: 14px 40px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; transition: background 0.3s; }
        .button:hover { background: #1e9aaf; }
        .footer { background: #f9f9f9; padding: 20px 30px; text-align: center; border-top: 1px solid #e0e0e0; font-size: 12px; color: #888; }
        .footer p { margin: 5px 0; }
        .info-box { background: #f0f7f9; border-left: 4px solid #31b8c6; padding: 15px; margin: 20px 0; border-radius: 4px; }
        .info-box p { margin: 0; font-size: 13px; color: #444; }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <div class="header">
                <h1>QueryMind</h1>
                <p>Email Verification - Resend Request</p>
            </div>
            <div class="body">
                <h2>Hi <span class="highlight">${user.username}</span>!</h2>
                <p>We received a request to resend your email verification link.</p>
                <p>Please click the button below to verify your email address and activate your account:</p>
                <div class="button-container">
                    <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}" class="button">Verify Email Address</a>
                </div>
                <div class="info-box">
                    <p><strong>Didn't request this?</strong> If you didn't ask for this email, you can safely ignore it. Your previous verification link will also still be valid.</p>
                </div>
                <p style="font-size: 13px; color: #888; margin-top: 30px;">This link will expire after 24 hours.</p>
            </div>
            <div class="footer">
                <p>&copy; 2024 QueryMind. All rights reserved.</p>
                <p>If the button doesn't work, copy and paste this link in your browser:<br><span style="color: #31b8c6; word-break: break-all;">http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}</span></p>
            </div>
        </div>
    </div>
</body>
</html>
            `;
            await sendEmail({
                to: email,
                subject:"QueryMind - Verify Your Email (Resend)",
                html: resendEmailTemplate
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