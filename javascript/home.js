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