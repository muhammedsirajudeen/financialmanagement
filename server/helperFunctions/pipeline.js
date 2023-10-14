

/*
basically a pipeline for getting sum and average
*/


 function getPipeline_sum_avg(username){

    return (
        [
        {$match : {username:username }},
        {$unwind :"$expensearray" },
        {$group : {_id:"$date", 
            totalAmount: {$sum :"$expensearray.amount"} ,
            dailyAverage :{$avg :"$expensearray.amount" },   
   
        } },
        {$sort : {_id :1}  }  
    ]
    )
    

}



/* 
    this pipeline is used to get the sum and average of each type on each date
*/



function getPipeline_type_sum_avg(username){
    return (
        [
            {$match : {username : username} },
            {$unwind: "$expensearray" },
            {$group : {_id : 
                {date:"$date",type:"$expensearray.type"}  , 
                totalAmount:{$sum:"$expensearray.amount"},
                averageAmount:{$avg:"$expensearray.amount"} , 

            } 
        },
            {$sort:{"_id.date":1}}
        ]
    )
}


function getPipeline_max(username){
    return (
        [
            {$match:{
                username:username
            }},
            {
                $unwind: "$expensearray" // Unwind the expensearray to work with individual expenses
              },

              {
                $group:{
                    _id:"$date",
                    maxAmount:{$max:"$expensearray.amount"},
                }
              },
              
              
              {$sort:{_id:1}},


        ]

    )
}


function getPipeline_maxType(username,arguments){
  
    
    return(
        [
            {$match:{
                username:username,
                
            }},
            {$unwind:"$expensearray"},
            {$match:{
                "expensearray.amount":arguments.maxAmount,
                date:arguments._id
            }}
        ]
    )
}



module.exports={getPipeline_sum_avg ,getPipeline_type_sum_avg ,getPipeline_max,getPipeline_maxType }





