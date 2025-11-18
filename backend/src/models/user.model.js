import mongoose ,{Schema} from "mongoose";
import bcrypt from "bcrypt";

const userSchema= new Schema({
    username:{ 
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        minLength:3,
        maxLength:30
    },
    password:{
        type:String,
        required:true,
        minLength:6,
        maxLength:30
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true

    }
    
},
{timestamps:true})


// bwfoe saving the user hash the password
userSchema.pre('save',async function(next){
    try {
        if(!this.isModified('password')){
            return next();
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password,salt);
        this.password= hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

// method to compare password during login
userSchema.methods.comparePassword = async function(candidatePassword){
    return await bcrypt.compare(candidatePassword,this.password);
}

export const User= mongoose.model('User',userSchema);