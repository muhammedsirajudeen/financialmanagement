
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
            let maincontainer=document.querySelector("#firstcontainer")
            summaryresponse.data[0].forEach((value)=>{
                let totalsummarycontainer=document.createElement("div")
                totalsummarycontainer.className="totalsummarycontainer"
                //date
                let date=document.createElement("div")
                date.className="summarytext"
                date.textContent=value._id
                //totalamount
                let amount=document.createElement("div")
                amount.className="summarytext"
                amount.textContent=value.totalAmount
                //average
                let average=document.createElement("div")
                average.className='summarytext'
                average.textContent=value.dailyAverage

                totalsummarycontainer.append(date,amount,average)
                maincontainer.appendChild(totalsummarycontainer)
            })

            let secondmaincontainer=document.querySelector("#secondcontainer")
            summaryresponse.data[1].forEach((value)=>{
                let typesummarycontainer=document.createElement("div")
                typesummarycontainer.className="typesummarycontainer"
                //date
                let date=document.createElement("div")
                date.className="summarytext"
                date.textContent=value._id.date
                //type
                let type=document.createElement("div")
                type.className="summarytext"
                type.textContent=value._id.type
                //totalamount
                let amount=document.createElement("div")
                amount.className="summarytext"
                amount.textContent=value.totalAmount
                //average
                let average=document.createElement("div")
                average.className='summarytext'
                average.textContent=value.averageAmount

                typesummarycontainer.append(date,type,amount,average)
                secondmaincontainer.appendChild(typesummarycontainer)

            })


            let thirdmaincontainer=document.querySelector("#thirdcontainer")
            summaryresponse.data[2].forEach((value)=>{
                let typemaxcontainer=document.createElement("div")
                typemaxcontainer.className="typemaxcontainer"
                //date
                let date=document.createElement("div")
                date.className="summarytext"
                date.textContent=value.date
                //type
                let type=document.createElement("div")
                type.className="summarytext"
                type.textContent=value.type
                //totalamount
                let amount=document.createElement("div")
                amount.className="summarytext"
                amount.textContent=value.amount
                
                typemaxcontainer.append(date,type,amount)
                thirdmaincontainer.appendChild(typemaxcontainer)

            })
        }

        /*
                -->
 review the data then populate it
        */
    
    }else{
        alert("please signin")
        window.location.href="./index.html"
    }
}

