const Expense=require("../database/model/expenseModel")()
const {getPipeline_maxType}=require("./pipeline")
function asyncmaxFunction(username,aggregate_max){
    return new Promise((resolve,reject)=>
    {   try{

    
    
        let promises=aggregate_max.map(async (value)=>{
            return new Promise(async (resolve,reject)=>{
                try{
                    const aggregate_maxType=await Expense.aggregate(getPipeline_maxType(username,value))
                    resolve(
                        {
                            date:aggregate_maxType[0].date,
                            amount:aggregate_maxType[0].expensearray.amount,
                            type:aggregate_maxType[0].expensearray.type
                        }
                        )
                }catch(error){
                    reject(error)
                }
                

    
            })
          }
          )
        Promise.all(promises).then((results)=>{

            resolve(results)
        }).catch((error)=>{
            console.log(error)
        })

        
        }
        catch(error){
            console.log(error)
            reject("error happened")
        }

    })
}

module.exports=asyncmaxFunction