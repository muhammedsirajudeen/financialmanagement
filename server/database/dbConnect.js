const mongoose=require("mongoose")
async function dbConnect(){
    try{
        await mongoose.connect(process.env.MONGODB)
        console.log("connected to database")
    }catch(error){
        console.log(error)
    }
}
module.exports=dbConnect
