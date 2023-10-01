let button=document.querySelector(".button")
const headers={
    'Content-Type':'application/json'
}
const url="http://localhost:3000"
button.addEventListener("click",async ()=>{
    let email=document.querySelector("#email").value
    let password=document.querySelector("#password").value
    console.log(email,password)
    let response=await (await fetch(url+"/signin",{
        method:'POST',
        headers:headers,
        body:JSON.stringify({
            username:email,
            password:password
        })
    })).json()
    alert(response.message)
    if(response.message==="login approved"){
        window.location.href="./home.html"
    }

})