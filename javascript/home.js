const headers={
    'Content-Type':'application/json'
}
const url="http://localhost:3000"
let username=document.querySelector(".username")
let signoutbutton=document.querySelector(".signout")
window.onload=async ()=>{
    let token=window.localStorage.getItem("token")
    if(token){
        let response=await (await fetch(url+"/tokenchecker",
        {
            method:'POST',
            headers:headers,
            body:JSON.stringify({token:token})
        })).json()
        if(response.message==="valid token"){
            console.log(response.data)
            username.textContent=response.data.username
        }else{
            username.textContent="please signin"
        }

        //retrieve and populate expense tab
        
        let expensedatajson=await (await fetch(url+"/getdailyexpense",{
            method:'POST',
            headers:headers,
            body:JSON.stringify({
                token:token
            })
        })).json()
        let expensearray=expensedatajson.data
        console.log(expensearray)
        expensearray.forEach((value)=>{
            let expenseitemcontainer=document.createElement("div")
            expenseitemcontainer.className="expenseitemcontainer"
            //adding expense amount 
            let expense=document.createElement("div")
            expense.className="expense"
            expense.textContent=value.amount
            expenseitemcontainer.appendChild(expense)
            //adding expense type
            let expensetype=document.createElement("div")
            expensetype.className="expensetype"
            expensetype.textContent=value.type
            expenseitemcontainer.appendChild(expensetype)
            //adding delete button
            let expensedelete=document.createElement("button")
            expensedelete.className="deletebutton"
            expensedelete.textContent="delete"
            expensedelete.id=value._id
            expensedelete.addEventListener("click",deleteHandler)
            expenseitemcontainer.appendChild(expensedelete)

            //appending here
            let expensemaincontainer=document.querySelector(".expensesubcontainer")
            expensemaincontainer.appendChild(expenseitemcontainer)
        })

        let investmentjson=await (await fetch(url+"/getinvestments",{
            method:'POST',
            headers:headers,
            body:JSON.stringify(
                {
                    token:token
                }
            )
        })).json()
        
        
        investmentjson.data.forEach((value)=>{
            let investmentsubcontainer=document.createElement("div")
            investmentsubcontainer.className="investaddlist"
            let investdate=document.createElement("div")
            investdate.className="investText"
            investdate.textContent=value.date
            investmentsubcontainer.appendChild(investdate)

            let investname=document.createElement("div")
            investname.className="investText"
            investname.textContent=value.name
            investmentsubcontainer.appendChild(investname)

            let investamount=document.createElement("div")
            investamount.className="investText"
            investamount.textContent=value.amount
            investmentsubcontainer.appendChild(investamount)

            let investquantity=document.createElement("div")
            investquantity.className="investText"
            investquantity.textContent=value.quantity
            investmentsubcontainer.appendChild(investquantity)

            let investType=document.createElement("div")
            investType.className="investText"
            investType.textContent=value.type
            investmentsubcontainer.appendChild(investType)

            let investdelete=document.createElement("button")
            investdelete.className="investdelete"
            investdelete.textContent="delete"
            investdelete.id=value._id
            investmentsubcontainer.appendChild(investdelete)

            investdelete.addEventListener("click",investdeleteHandler)

            let investmaincontainer=document.querySelector(".investmentsubcontainer")
            investmaincontainer.appendChild(investmentsubcontainer)
        })
        

        





    }else{
        alert("please signin")
        window.location.href="./index.html"
    }
}



//signout event handler
signoutbutton.addEventListener("click",()=>{
    window.localStorage.setItem("token",null)
    window.location.href="./index.html"
})

// atlast add an event to make the signout button appear and
// dissappear


//handle adding expenses
let addexpensebutton=document.querySelector(".addbutton")
addexpensebutton.addEventListener("click",async ()=>{
    let date=document.querySelector("#date").value
    let expenseamount=document.querySelector("#expenseamount").value
    let expensetype=document.querySelector("#expensetype").value
    let response=await (await fetch(url+"/addexpense",{
        method:'POST',
        headers:headers,
        body:JSON.stringify(
            {
                token:window.localStorage.getItem("token"),
                date:date,
                amount:expenseamount,
                type:expensetype
            }
        )
        
    })).json()
    if(response.message==="success"){
        alert("successfully saved")
        
        document.querySelector("#expensetype").value=""
       
        document.querySelector("#expenseamount").value=""
        window.location.reload()
    }else{
        alert("re-add the data")

    }   
    console.log(response)

})




//function to handle the delete functionality
async function deleteHandler(e){
    let response=await fetch(url+"/removedailyexp/"+e.target.id,
    {
        method:'DELETE',
        headers:{
            Authorization:`Bearer ${window.localStorage.getItem("token")}`
        }
        
    })
    let responsejson=await response.json()
    if(responsejson.message==="success"){
        alert("successfully deleted")
        window.location.reload()
    }
    else{
        alert("please try again")
    }
    console.log(responsejson)

}

//adding investment here
let investaddbutton=document.querySelector("#addinvestment")
investaddbutton.addEventListener("click",async ()=>{
    let investdate=document.querySelector("#investmentdate").value
    let investamount=document.querySelector("#investmentamount").value
    let investqty=document.querySelector("#investmentquantity").value
    let investmentType=document.querySelector("#investmentType").value
    let investname=document.querySelector("#investname").value
    console.log(investdate,investamount,investmentType)
    let response=await (await fetch(url+"/addinvest",{
        method:'POST',
        headers:headers,
        body:JSON.stringify(
            {
                token:window.localStorage.getItem("token"),
                investdata:
                {
                    date:investdate,
                    name:investname,
                    amount:investamount,
                    quantity:investqty,
                    type:investmentType
                }
            }
        )
    })) .json()
    if(response.message!=="success"){
        alert("readd the data")
    }else{
        alert("successfully added")
        window.location.reload()
    }

})



//function to handle delete for investments
async function investdeleteHandler(e){
    let response=await (await fetch(url+`/deleteinvestment/${e.target.id}`,{
        method:'DELETE',
        headers:{
            Authorization:`Bearer ${window.localStorage.getItem("token")}`
        }
    })).json()
    if(response.message==="success"){
        alert("deleted")
        window.location.reload()
    }else{
        alert("please redo the action")
    }

}


