//html elements at the top
let button=document.querySelector(".button")
let login=document.querySelector(".login")

//constant values here
const headers={
    'Content-Type':'application/json'
}
const url="http://localhost:3000"

//relevant js code here
button.addEventListener("click",async ()=>{
    let email=document.querySelector("#email").value
    let password=document.querySelector("#password").value
    let confirmpassword=document.querySelector("#confirmpassword").value
    
    if(password!==confirmpassword){
        alert("password not equal")
        document.querySelector("#password").value=""
        document.querySelector("#confirmpassword").value=""

    }
    else{
        //post data to server here if success show the login button
        let response=await (await fetch(url+"/signup",{
            method:'POST',
            headers:headers,
            body:JSON.stringify(
                {
                    username:email,
                    password:password
                }
            )

        })).json()
        alert(response.message)
        if(response.message==="user saved"){
            window.location.href="./index.html"
        }
        login.style.visibility="visible"
        
        
        
    }
})

//adding what happens when we click login
login.addEventListener("click",()=>{
    window.location.href="./index.html"
})