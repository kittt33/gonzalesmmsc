const Container = document.querySelector(".container")
const Input = Container.querySelector("input")
const StartText = Container.querySelector(".start__text")
const Volume = Container.querySelector(".word i")
const Synonyms = Container.querySelector(".synonyms .list")
const Example = Container.querySelector(".example .details")
const RemoveIcon = Container.querySelector(".search span")

let audio

function data(result, word) {
    if(result.title) {
        StartText.innerHTML = `Sorry buddy but we could't find the meaning of <span>"${word}"</span>. Maybe try and search for another word?`
    } else {
        Container.classList.add("active")
        let definitions = result[0].meanings[0].definitions[0], phonetics = `${result[0].meanings[0].partOfSpeech} /${result[0].phonetics[0].text}/`
        
        document.querySelector(".word p").innerText = result[0].word
        document.querySelector(".word span").innerText = phonetics
        document.querySelector(".meaning span").innerText = definitions.definition
        document.querySelector(".example span").innerText = definitions.example
        audio = new Audio(result[0].phonetics[0].audio)
    
        if(result[0].phonetics[0].audio == '') {
            audio = new Audio(result[0].phonetics[1].audio)
        } else {
            audio = new Audio(result[0].phonetics[0].audio)
        }
       
        if(definitions.example == undefined) {
            Example.parentElement.style.display = "none"
        } else {
            Example.parentElement.style.display = "block"
        }

        if(result[0].phonetics[0].text == undefined) {
            let BackupPhonetic
            BackupPhonetic = `${result[0].meanings[0].partOfSpeech} /${result[0].phonetics[1].text}/`
            document.querySelector(".word span").innerText = BackupPhonetic
        } else {
            phonetics = `${result[0].meanings[0].partOfSpeech} /${result[0].phonetics[0].text}/`
        }
        
        if(definitions.synonyms[0] == undefined) {
            Synonyms.parentElement.style.display = "none"
        } else {
            Synonyms.parentElement.style.display = "block"
            Synonyms.innerHTML = ""
            for (let i = 0 ; i < 1 ; i++) {
                let tag = `<span onclick="search('${definitions.synonyms[i]}')">${definitions.synonyms[i]},</span>`
                tag = i == 4 ? tag = `<span onclick="search('${definitions.synonyms[i]}')">${definitions.synonyms[4]}</span>` : tag
                Synonyms.insertAdjacentHTML("beforeend", tag)
            }
        }
    }
    console.log(result)
}

function search(word) {
    Input.value = word
    FetchApi(word)
}

function FetchApi(word) {
    Container.classList.remove("active")
    StartText.style.color = "#FFF"
    StartText.innerHTML = `Finding the information for <span>"${word}"</span>...`
    let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    fetch(url).then(response => response.json()).then(result => data(result, word))
}

Input.addEventListener("keyup", a => {
    let word = a.target.value.replace(/\s+/g, ' ')
    if(a.key === "Enter" && a.target.value) {
        FetchApi(a.target.value)
    }
})

Volume.addEventListener("click", ()=> {
    audio.play()
})

RemoveIcon.addEventListener("click", ()=>{
    Input.value = ""
    Input.focus()
    Container.classList.remove("active")
    StartText.innerHTML = "Type a word and press Enter to get the meaning, example, pronunciation and synonyms of that word. Simple enough? then Let's go!"
})

