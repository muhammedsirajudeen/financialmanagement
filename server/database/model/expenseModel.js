const mongoose=require("mongoose")

let Expense;

const SingleExpense=new mongoose.Schema({
    
    amount:Number,
    type:String    
})

const expenseSchema=new mongoose.Schema({
    username:String,
    date:String,
    expensearray:[SingleExpense]
})

function expenseModel(){
    if(Expense){
        return Expense
    }else{
        return mongoose.model("expense",expenseSchema)
    }
}
module.exports=expenseModel