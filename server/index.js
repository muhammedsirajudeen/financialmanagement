//external imports
const cors=require("@fastify/cors")
const jwt=require("jsonwebtoken")
//user defined imports
const dbConnect=require("./database/dbConnect")
const User=require("./database/model/userModel")()

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

const start = async () => {
  try {
    await fastify.listen({ port: 3000 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()