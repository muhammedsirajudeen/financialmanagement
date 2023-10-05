//external imports
const cors=require("@fastify/cors")
const jwt=require("jsonwebtoken")
//user defined imports
const dbConnect=require("./database/dbConnect")
const User=require("./database/model/userModel")()
const Expense=require("./database/model/expenseModel")()
//to handle cross origin requests
const fastify = require('fastify')({
  logger: true
})
fastify.register(cors)

//to handle database connection

dbConnect()

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
        console.log(error)
        return {message:"db write error"}
      }
    
    }
  }catch(error){
    console.log(error)
    return {message:"db read error"}
  }

})

fastify.post("/signin",async (request,reply)=>{
  console.log(request.body)
  try{
    let doc=await User.findOne({username:request.body.username})
    if(!doc){
      console.log(doc)
      return {message:"user not present "}
    }
    if(doc.username === request.body.username && doc.password===request.body.password){
      return {message:"login approved"}
    }else{
      return {message:"login denied"}
    }
  }catch(error){
    console.log(error)
    return {message:"db read error"}
  }
})

//this section is for jwt token creation and verification
fastify.post("/tokencreator",async (request,reply)=>{
  try{
    //honestly we have to verify that the user exist in the database
    let token=await jwt.sign(request.body,"secret123")
    return {message:"created",token:token}
  }catch(error){
    console.log(error)
    return {message:"server error"}
  }
  
})

fastify.post("/tokenchecker",async (request,reply)=>{
  try{
    let decoded=jwt.verify(request.body.token,"secret123")
    if(decoded){
      return {message:"valid token",data:decoded}

    }else{
      return {message:"invalid token",data:null}
    }
  }catch(error){
    console.log(error)
    return {message:"jwt error"}
  }
})



//next we have to create and end point for adding expenses
//for current date we just add expense 

//getting all expense by date
fastify.get("/getdailyexpense",async (request,reply)=>{
  let date=new Date()
  let year=date.getFullYear()
  let month=date.getMonth()
  let day=date.getDay()
  date=year+"-"+month+"-"+day
  try{
    let docs=await Expense.find()
    console.log(docs)
    return {message:"success",data:docs}

  }catch(error){
    console.log(error)
    return {message:"error"}

  }
  
})

//endpoint to add expense
fastify.post("/addexpense",async (request,reply)=>{
  console.log(request.body)
  try{
    let decoded=jwt.verify(request.body.token,"secret123")
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
      console.log(data)
      let newExpenseData=new Expense(data)
      await newExpenseData.save()
    }
    return {message:"success"}
  }catch(error){
    console.log(error)
    return {message:"error"}
  }
} )


const start = async () => {
  try {
    await fastify.listen({ port: 3000 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()