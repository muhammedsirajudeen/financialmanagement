
let button=document.querySelector(".signout")
button.addEventListener("click",async ()=>{
    window.localStorage.setItem("token",null)
    alert("signed out succesfully")
})

const url="http://localhost:3000"

let headers={
    'Content-Type':'application/json'
}

window.onload= async  ()=>{
    //verify jwt token
    const token=window.localStorage.getItem("token")
    if(token){
        let tokenresponse=await (await fetch(url+"/tokenchecker",{
            method:'POST',
            headers:headers,
            body:JSON.stringify(
                {
                    token:token
                }
            )
        })).json()
        console.log(tokenresponse)
        if(tokenresponse.message!=='valid token'){
            window.location.href="./index.html"
        }else{
            //get summary here
            let summaryresponse= await (await fetch(url+"/getexpensesummary",{
                method:'POST',
                headers:headers,
                body:JSON.stringify(
                    {
                        token:token
                    }           
                )
            })).json()
            console.log(summaryresponse)
        }

        /*
            while populating the data due not that first index contains the summary for wholeday
            and second index contains the data aggregation for each type of each day 
        */
    
    }else{
        alert("please signin")
        window.location.href="./index.html"
    }
}

