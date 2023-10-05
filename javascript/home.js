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
        let expensedatajson=await (await fetch(url+"/getdailyexpense")).json()
        console.log(expensedatajson)
        let expensedata=expensedatajson.data

        





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
        document.querySelector("#date").value=""
        document.querySelector("#expensetype").value=""
        document.querySelector("#expenseamount").value=""

    }else{
        alert("re-add the data")

    }   
    console.log(response)

})