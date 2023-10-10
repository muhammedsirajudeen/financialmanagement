//external imports
const cors=require("@fastify/cors")
const jwt=require("jsonwebtoken")
//user defined imports
const dbConnect=require("./database/dbConnect")
const User=require("./database/model/userModel")()
const Expense=require("./database/model/expenseModel")()
const Invest=require("./database/model/investModel")()
//to handle cross origin requests
const fastify = require('fastify')({
  logger: true
})
fastify.register(cors)

//to handle database connection

dbConnect()

//jwt key
const secretKey="secret123"

fastify.get('/', async (request, reply) => {
  return { hello: 'world' }
})

fastify.post('/signup',async (request,reply)=>{
  
  try{
    let doc=await User.findOne({username:request.body.username})
    
    if(doc){
      return {message:"user already present"}
    }else{
      let newUser=new User(request.body)
      try{
        await newUser.save()
        return {message:"user saved"}
      }catch(error){
        return {message:"db write error"}
      }
    
    }
  }catch(error){
    return {message:"db read error"}
  }

})

fastify.post("/signin",async (request,reply)=>{
  try{
    let doc=await User.findOne({username:request.body.username})
    if(!doc){
      
      return {message:"user not present "}
    }
    if(doc.username === request.body.username && doc.password===request.body.password){
      return {message:"login approved"}
    }else{
      return {message:"login denied"}
    }
  }catch(error){
    return {message:"db read error"}
  }
})

//this section is for jwt token creation and verification
fastify.post("/tokencreator",async (request,reply)=>{
  try{
    //honestly we have to verify that the user exist in the database
    let token=await jwt.sign(request.body,secretKey)
    return {message:"created",token:token}
  }catch(error){
    return {message:"server error"}
  }
  
})

fastify.post("/tokenchecker",async (request,reply)=>{
  try{
    let decoded=jwt.verify(request.body.token,secretKey)
    if(decoded){
      return {message:"valid token",data:decoded}

    }else{
      return {message:"invalid token",data:null}
    }
  }catch(error){
    return {message:"jwt error"}
  }
})



//next we have to create and end point for adding expenses
//for current date we just add expense 

//getting all expense by date
fastify.post("/getdailyexpense",async (request,reply)=>{
  const token=request.body.token
  let date=new Date()
  let year=date.getFullYear()
  let month=date.getMonth()+1
  let day=date.getDate()
  //handling a simple exception
  if((day.toString()).length===1){
    day="0"+day.toString()
    
  }
  date=year+"-"+month+"-"+day
  try{
    const decoded=jwt.verify(token,secretKey)
    let docs=await Expense.find({username:decoded.username,date:date})
    //returning the expense array for the current date
    if(docs.length!==0){
      return {message:"success",data:docs[0].expensearray}

    }else{
      return {message:"success",data:[]}

    }

  }catch(error){
    return {message:"error"}

  }
  
})

//endpoint to add expense
fastify.post("/addexpense",async (request,reply)=>{
  try{
    let decoded=jwt.verify(request.body.token,secretKey)
    request.body.username=decoded.username
    //check if the db has existing record on this date

    let docs=await Expense.find({username:decoded.username,date:request.body.date})
    if(docs.length!==0){
      //here we would find by id and update the document
      let expensearray=docs[0].expensearray
      expensearray.push(
        {amount:request.body.amount,type:request.body.type}

      )
      await Expense.findByIdAndUpdate(docs[0]._id,{expensearray:expensearray})

      
    }else{
      //create new under that date
      let data={}
      data.username=decoded.username
      data.date=request.body.date
      data.expensearray=[
        {
          
          amount:request.body.amount,
          type:request.body.type  
        }
      ]
      let newExpenseData=new Expense(data)
      await newExpenseData.save()
    }
    return {message:"success"}
  }catch(error){
    return {message:"error"}
  }
} )


//adding code to delete individual expenses
fastify.delete("/removedailyexp/:id",async (request,reply)=>{
  const id=request.params.id
  let date=new Date()
  let year=date.getFullYear()
  let month=date.getMonth()+1
  let day=date.getDate()
  if((day.toString()).length===1){
    day="0"+day.toString()
    
  }
  date=year+"-"+month+"-"+day
  let token=request.headers.authorization
  token=token.replace("Bearer ","")
  try{
    let decoded=jwt.verify(token,secretKey)
    let docs=await Expense.findOne(
      {
        username:decoded.username,
        date:date
      }
    )
    let userid=docs._id.toHexString()
    let expensearray=docs.expensearray
    expensearray=expensearray.filter((value)=> value._id.toHexString()!==id )
    
    await Expense.findByIdAndUpdate(userid,{
      expensearray:expensearray
    })
    return {message:"success"}

  }catch(error){
    console.log(error)
    return {message:"error"}

  }
  //access all doc with current username and current date
})


//add endpoint for adding investments
fastify.post("/addinvest",async (request,reply)=>{
  try{
    let decoded=jwt.verify(request.body.token,secretKey)
    let doc=await Invest.findOne({username:decoded.username})
    if(doc){
      //code for db if data exist
      doc.investarray.push(request.body.investdata)
      await Invest.findByIdAndUpdate(doc._id.toHexString(),{investarray:doc.investarray})
      return {message:"success"}
    }else{
      let newData={}
      newData.username=decoded.username
      newData.investarray=[]
      newData.investarray.push(request.body.investdata)
      let newDoc=new Invest(newData)
      await newDoc.save()
      return {message:"success"}
    }
  }catch(error){
    return {message:"error"}

  }
})

//end point to get investments
fastify.post("/getinvestments", async (request,reply)=>{
  let token=request.body.token
  try{
    let decoded=jwt.verify(token,secretKey)
    let doc=await Invest.findOne({username:decoded.username})
    console.log(doc)
    if(doc){
      return {message:"success",data:doc.investarray}

    }else{
      return {message:"success",data:[]}

    }
  }catch(error){
    console.log(error)
    return {message:"error"}
  }

})

//end point to delete investments
fastify.delete("/deleteinvestment/:id",async (request,reply)=>{
  let token=request.headers.authorization
  let id=request.params.id
  token=token.replace("Bearer ","")
  try{
    let decoded=jwt.verify(token,secretKey)
    let docs=await Invest.findOne({username:decoded.username})
    docs.investarray=docs.investarray.filter((value)=> value._id.toHexString() !== id )
    await Invest.findByIdAndUpdate(
      docs._id.toHexString(),{
        investarray:docs.investarray
      }
    )
    return {message:"success",data:docs.investarray}
  }catch(error){
    console.log(error)
    return {message:"error"}

  }
})

const start = async () => {
  try {
    await fastify.listen({ port: 3000 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()