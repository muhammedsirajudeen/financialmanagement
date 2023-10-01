const mongoose=require("mongoose")

let User

const userSchema=mongoose.Schema({
    username:String,
    password:String
})
//here we are using a singleton pattern 
function userModel(){
   
    if(User){
        return User
    }else{

        User=mongoose.model("user",userSchema)
        return User
    }
}
module.exports=userModel

