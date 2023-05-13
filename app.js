const btn = document.getElementById("btn")
const divContainer = document.querySelector(".container")
let divText = ""
let token = "vide"

let themes = "vide"
let themeActuelle = 0

let questions = "vide"
let questionActuelle = 0

let reponses = ""
let reponseActuelle = 0

let reponse = "vide"

let recap = []
let score = 0

btn.addEventListener("click", ()=>{

    fetch('http://les-chateaux-europeens.eu/api/login_check', {

        method: "POST",

        body: JSON.stringify({
            username: "admin@bookapi.com",
            password : "password"
        }),

        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
        .then(response => response.json())
        .then(data => {
            token = data.token
            skeleton()
            loadTheme()

        });

})




function loadTheme() {
    dataLoader('http://les-chateaux-europeens.eu/api/themes')
        .then(Themes =>{
            themes = Themes
            afficherThemes()
        })
}
function afficherThemes() {

    divText = document.querySelector(".text")
    divText.textContent = "Choisir un thème"

    for (let i = 0; i < 4; i++) {
        let btnActuelle = document.getElementById(i.toString())
        btnActuelle.textContent = themes[i].nom
        btnActuelle.setAttribute("id", themes[i].nom
            .toLowerCase()
            .trim()
            .replace("é","e")
            .replace(/[^\w\s-]/g, '-')
            .replace(/[\s_-]+/g, '-'))
        btnActuelle.addEventListener("click",ev => loadQuestion(ev))
        console.log(themes[i])
    }
}
function loadQuestion(ev) {
    dataLoader(`http://les-chateaux-europeens.eu/api/themes/${ev.target.id}/questions/5`)
        .then(Questions =>{
            questions = Questions
            afficherQuestion()
            questionActuelle++
        })
}
function afficherQuestion(){
    reponses = questions[questionActuelle].reponse
    divText = document.querySelector(".text")
    divText.textContent = questions[questionActuelle].intitule
    afficherReponses()

}
function afficherReponses(){
    if (questionActuelle === 0){
        const divSupport =  document.querySelector(".support")
        divSupport.remove()
        squeletteReponse()
    }
    changerReponse()

}
function afficherResultat(){

    divText = document.querySelector(".text")
    divForm = document.querySelector(".form")
    btnSubmit = document.querySelector("#btnSubmit")
    divForm.remove()
    btnSubmit.remove()
    divText.textContent = "Recap du quiz"

    verifierReponse()

    p =document.createElement("p")
    p.textContent = `Vous avez un score de ${score}/4`
    divContainer.appendChild(p)
    console.log(score)


}
function verifierReponse(){
    recap.forEach(reponseUser=>{
        if (reponseUser["Reponse selectione : "].correct){
            score++
        }
    })
    return score
}
function squeletteReponse(){

    const divForm = createSimpleDiv("form")
    const btnSubmit = createBtnSubmit()
    for (let i = 0; i < 4; i++) {
        const input = document.createElement("input")
        input.setAttribute("type","radio")
        input.setAttribute("id",i.toString())
        input.setAttribute("name","reponse")

        const label = document.createElement("label")
        label.setAttribute("id",`reponse${i}`)
        label.setAttribute("for",i.toString())
        label.textContent = reponses[reponseActuelle].intutile

        const div = createSimpleDiv("")
        div.appendChild(input)
        div.appendChild(label)

        divForm.appendChild(div)
        reponseActuelle++
    }
    divForm.appendChild(btnSubmit)
    divContainer.appendChild(divForm)
    divContainer.appendChild(btnSubmit)
}
function changerReponse(){
    let label1 = document.querySelector("#reponse0")
    let label2 = document.querySelector("#reponse1")
    let label3 = document.querySelector("#reponse2")
    let label4 = document.querySelector("#reponse3")
    console.log(reponses)
    label1.textContent = reponses[0].intutile
    label2.textContent = reponses[1].intutile
    label3.textContent = reponses[2].intutile
    label4.textContent = reponses[3].intutile
}
function createSimpleDiv( className) {
    const div = document.createElement("div")
    div.setAttribute("class" ,className)
    return div
}
function createBtnSubmit() {
    const btnSubmit = document.createElement("button")
    btnSubmit.setAttribute("id", "btnSubmit")
    btnSubmit.setAttribute("type", "button")
    btnSubmit.textContent = "Valider la réponse"
    btnSubmit.addEventListener("click", (ev)=>nextQuestion())
    return btnSubmit

}
function nextQuestion(){
    const reponseSelectionnee = document.querySelector("input[name='reponse']:checked");
    //console.log(reponseSelectionnee.id)
    //console.log(reponses[reponseSelectionnee.id].correct)
    recap.push({
        "Question : " : questionActuelle,
        "Reponses : " :  reponses,
        "Reponse selectione : " : reponses[reponseSelectionnee.id]
    })
    questionActuelle++

    if (questionActuelle < 5 ){
        afficherQuestion()

    }else {
        afficherResultat()
    }



}
function createBtnSelectTheme(text) {

    const btnSelectTheme = document.createElement("button")
    btnSelectTheme.textContent = " "
    btnSelectTheme.setAttribute("id",text)
    btnSelectTheme.addEventListener("click",(ev)=>printQuestionnaire(ev))
    return btnSelectTheme
}
function skeleton(){
    const divContainer = document.querySelector(".container")
    divContainer.removeChild(document.querySelector(".support"))
    const divText =createSimpleDiv("text")
    divText.textContent = " "
    divContainer.appendChild(divText)
    const divSupport = createSimpleDiv("support")
    for (let i = 0; i < 4; i++) {
        const divBtn = createSimpleDiv("btn")
        const divInner = createSimpleDiv("inner") //pour le bg
        const btnSelectTheme = createBtnSelectTheme(i)

        divBtn.appendChild(divInner)
        divBtn.appendChild(btnSelectTheme)

        divSupport.appendChild(divBtn)
        console.log(divSupport)
    }
    divContainer.appendChild(divSupport)
}


function dataLoader(url){
    return fetch(url,{
        headers:{
            "Authorization" :"bearer "+ token
        }
    }).then(response => response.json())
}