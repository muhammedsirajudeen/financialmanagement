

/*
basically a pipeline for getting sum and average
*/

 function getPipeline_sum_avg(username){

    return (
        [
        {$match : {username:username }},
        {$unwind :"$expensearray" },
        {$group : {_id:"$date", totalAmount: {$sum :"$expensearray.amount"} ,dailyAverage :{$avg :"$expensearray.amount" }  } },
        {$sort : {_id :1}  }  
    ]
    )
    

}

// db.expenses.aggregate([ 
//     { $match : { username:"muhammedsirajudeen29@gmail.com" } } , 
//     {$unwind:"$expensearray"} , 
//     { $group:{_id:{date:"$date",type:"$expensearray.type"} , totalAmount : {$sum : "$expensearray.amount"}, averageAmount: {$avg:"$expensearray.amount"} }}  , 
//     {$sort : { "_id.date":1 }  }     
//    ])

function getPipeline_type_sum_avg(username){
    return (
        [
            {$match : {username : username} },
            {$unwind: "$expensearray" },
            {$group : {_id : 
                {date:"$date",type:"$expensearray.type"}  , 
                totalAmount:{$sum:"$expensearray.amount"},
                averageAmount:{$avg:"$expensearray.amount"} , 
                maxtypeAmount:{$max:"$expensearray.amount"} ,
                mintypeAmount:{$min:"$expensearray.amount"}  
            } 
        },
            {$sort:{"_id.date":1}}
        ]
    )
}



module.exports={getPipeline_sum_avg ,getPipeline_type_sum_avg }





