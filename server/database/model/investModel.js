const mongoose=require("mongoose")

let Invest;
const investarraySchema=mongoose.Schema(
    {
        date:String,
        amount:Number,
        quantity:Number,
        type:String,

    }
)

const investSchema=mongoose.Schema(
    {
        username:String,
        investarray:[investarraySchema]
    }
)
function investModel(){
    if(Invest){
        return Invest
    }
    else{
        return mongoose.model("invest",investSchema)
    }
}
module.exports=investModel