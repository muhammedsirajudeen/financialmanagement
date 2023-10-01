const mongoose=require("mongoose")
async function dbConnect(){
    try{
        await mongoose.connect("mongodb+srv://vava:vava@cluster0.vuxyl3c.mongodb.net/financialmanagement")
        console.log("connected to database")
    }catch(error){
        console.log(error)
    }
}
module.exports=dbConnect