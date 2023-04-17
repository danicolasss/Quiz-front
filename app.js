
const btn = document.getElementById("btn")

btn.addEventListener("click", ()=>{
    let emailAdr = document.getElementById("email").value
    let mdp = document.getElementById("mdp").value
    console.log(postData("http://les-chateaux-europeens.eu/api/login_check/","test@test.fr","test"))
})

async function postData(url = "", data = {emailAdr,mdp}) {
    const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: {
            "username": data.emailAdr,
            "password": data.mdp
        },
    });
    return response.json();
}

