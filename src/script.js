const searchBar = document.querySelector('nav input')
const submitButton = document.querySelector('nav button')
const resultsDiv = document.querySelector('#results')
const errorDiv = document.querySelector('#errors')
const errorMessage = document.querySelector('#error-message')
const audioButton = document.querySelector('#audio-button')
const audioTag = document.querySelector('#audio-file')
const wordDiv = document.querySelector('#word')
const phoneticsDiv = document.querySelector('#phonetics')
const definitionsDiv = document.querySelector('#definitions-examples')
const synonymsDiv = document.querySelector('#synonyms')
const antonymsDiv = document.querySelector('#antonyms')

document.addEventListener(('DOMContentLoaded'), () => {
    resultsDiv.style.opacity = 0
    errorDiv.style.opacity = 0
})

submitButton.addEventListener('click', getWordDetails)

searchBar.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        getWordDetails()
    }
})

audioButton.addEventListener('click', () => {
    if (audioTag.src) {
    audioTag.play()
    }
})

async function getWordDetails() {
    wordDiv.innerHTML = ''
    phoneticsDiv.innerHTML = ''
    definitionsDiv.innerHTML = ''
    synonymsDiv.innerHTML = ''
    antonymsDiv.innerHTML = ''
    errorDiv.style.opacity = 0
    errorMessage.textContent = ''
    const searchValue = searchBar.value.trim().toLowerCase()
    if (searchValue) {
        try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchValue}`)
        if (!response.ok) {
            throw new Error('No such word found!')
        }else {
            const cleanedUp = await (response.json())
            const data = cleanedUp[0]
            const word = data.word
            const phonetic = data.phonetic
            const audio = data.phonetics.find((phonetic) => phonetic.audio)
            const audioUrl = (audio)? audio.audio : ''
            const allDefinitions = data.meanings.map((meaning) =>  {
                const partOfSpeech = meaning.partOfSpeech
                const definitionDetails = meaning.definitions.map((def) => {
                    return { definition : def.definition, 
                        example: def.example || null }
                })
                return {partOfSpeech : partOfSpeech, 
                    details: definitionDetails}
            })
            const synonymsObject = data.meanings.filter((meaning) => meaning.synonyms.length !== 0)
            const synonyms = (synonymsObject.map((item) => item.synonyms).length === 0)? 'None' : (synonymsObject.map((item) => item.synonyms).flat())
            const antonymsObject = data.meanings.filter((meaning) => meaning.antonyms.length !== 0)
            const antonyms = (antonymsObject.map((item) => item.antonyms).length === 0)? 'None' : (antonymsObject.map((item) => item.antonyms).flat())
            wordDiv.textContent = word
            phoneticsDiv.textContent = phonetic
            audioTag.src = audioUrl
            synonymsDiv.innerHTML = `<h3 style='display: inline'>Synonyms: </h3>${synonyms}`
            antonymsDiv.innerHTML = `<h3 style='display: inline'>Antonyms: </h3>${antonyms}`
            const h2 = document.createElement('h2')
            h2.textContent = 'Definitions'
            definitionsDiv.appendChild(h2)
            allDefinitions.forEach((item) => {
                const h3 = document.createElement('h3')
                h3.textContent = item.partOfSpeech[0].toUpperCase() + item.partOfSpeech.slice(1)
                definitionsDiv.appendChild(h3)
                const ul = document.createElement('ul')
                item.details.forEach((detail) => {
                    const li = document.createElement('li')
                    const definitionP = document.createElement('p')
                    const exampleP = document.createElement('p')
                    definitionP.textContent = `${detail.definition}`
                    definitionP.classList.add('definition')
                    li.appendChild(definitionP)
                    if (detail.example) {
                        exampleP.textContent = `Example : ${detail.example}`
                        exampleP.classList.add('example')
                        li.appendChild(exampleP)
                    }
                    ul.appendChild(li)
                })
                definitionsDiv.appendChild(ul) 
            })
            resultsDiv.style.opacity = 1
        }

        } catch(error) {
            errorMessage.textContent = error.message
            errorDiv.style.opacity = 1
            resultsDiv.style.opacity = 0
        }

    }else {
        errorMessage.textContent = 'Please enter a search word'
        errorDiv.style.opacity = 1
        resultsDiv.style.opacity = 0
        wordDiv.innerHTML = ''
        phoneticsDiv.innerHTML = ''
        definitionsDiv.innerHTML = ''
        synonymsDiv.innerHTML = ''
        antonymsDiv.innerHTML = ''
        
    }

}