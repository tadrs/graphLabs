import mongoose from "mongoose"
import bcryptjs from "bcryptjs"

const usersSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z]{3,8}(@)(gmail|yahoo)(.com)$/.test(v);
      },
      message: () => "email is not valid",
    },
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
})

usersSchema.pre("save", async function (next) {
  const salt = await bcryptjs.genSalt(10)
  this.password = await bcryptjs.hash(this.password, salt)
  next()
})

const userModel = mongoose.model("User", usersSchema)
export default userModel