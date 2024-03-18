const headers = {
    'Content-Type': 'application/json'
};
const url = "http://localhost:3000";
const aibackend = "http://localhost:5000";

window.onload=async ()=> {
    console.log("loaded the element")
    //make a call to the python backend and get live returns of ticker most common tickers only
    let token = window.localStorage.getItem('token');
    console.log(token);
    let response = await (await fetch(aibackend+ "/livereturn", {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ token: token })
    })).json(); 
    console.log(response)
    let returncontainer=document.querySelector(".returncontainer")
    if(response.returns){
        response.returns.forEach((value)=>{
            let returnsubcontainer=document.createElement('div')
            returnsubcontainer.className="returnsubcontainer"
            let stock=document.createElement('h3')
            stock.textContent=value.ticker
            let returns=document.createElement('h3')
            returns.textContent=value.percentage+"%"
            if(value.percentage<0){
                returns.className="redtext"
            }else{
                returns.className="greentext"
            }
            returnsubcontainer.appendChild(stock)
            returnsubcontainer.appendChild(returns)
            returncontainer.appendChild(returnsubcontainer)
        })
    
    }
    //here give a good design to display the returns appropriately
}