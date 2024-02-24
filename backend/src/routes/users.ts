import express, {Request, Response} from 'express'
import User from '../models/User';
import jwt from 'jsonwebtoken'
import {check, validationResult} from 'express-validator'
import verifyToken from '../middleware/auth';

const router = express.Router()

// TODO: /api/users/me
router.get('/me', verifyToken, async(req: Request, res: Response) => {
  const userId = req.userId
  try {
    // TODO: select - не включает это поле в ответ
    const user = await User.findById(userId).select("-password")
    if(!user) {
      return res.status(400).json({
        message: 'User not found'
      })
    }

    res.json(user)
  } catch (error) {
  console.log("🚀router/user.ts ~ router.get ~ error:", error)
  res.status(500).json({
    message: 'Something went wrong'
  })
  }
})

router.post('/register', [
  check('firstName', 'First name is required').isString(),
  check('lastName', 'Last name is required').isString(),
  check('email', 'Email is required').isEmail(),
  check('password', 'Password with 6 or more characters require').isLength({ min: 6}),
],async (req: Request, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: errors.array()
    })
  }
  try {
    let user = await User.findOne({
      email: req.body.email
    })

    if (user) {
      return res.status(400).json({
        message: 'User already exists'
      })
    }

    user = new User(req.body)
    await user.save()

    const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET_KEY as string, {
      expiresIn: '15d'
    })

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1296000000
    })

    return res.status(200).json({
      message: 'User  registered Ok'
    })
    
  } catch (error) {
    console.log("🚀 routes/users.ts ~ router.post ~ error:", error)
    res.status(500).send({
      message: 'Something went wrong'
    })
  }
})

export default router