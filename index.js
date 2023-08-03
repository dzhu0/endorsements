import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://playground-e3130-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsements = ref(database, "endorsements")

const endorseFormEl = document.getElementById("endorse-form")
const endorseEl = document.getElementById("endorse")
const fromEl = document.getElementById("from")
const toEl = document.getElementById("to")
const endorsementsEl = document.getElementById("endorsements")

const liked = JSON.parse(localStorage.getItem("endorsements-liked")) || []

endorseFormEl.addEventListener("submit", addEndorsement)

onValue(endorsements, snapshot => {
    if (snapshot.exists()) {
        clearEndorsementsEl()

        Object.entries(snapshot.val()).forEach(prependEndorsementToEndorsementsEl)
    } else {
        endorsementsEl.innerHTML = "No endorsements here... yet"
    }
})

function addEndorsement(e) {
    e.preventDefault()

    const endorse = endorseEl.value.trim()
    const from = fromEl.value.trim()
    const to = toEl.value.trim()

    if (endorse && from && to) {
        const inputValue = { endorse, from, to, likes: 0 }
        push(endorsements, inputValue)
        clearInputFields()
    } else {
        alert("Please, do not leave any fields blank.")
        !to && toEl.focus()
        !from && fromEl.focus()
        !endorse && endorseEl.focus()
    }
}

function clearInputFields() {
    endorseEl.value = ""
    fromEl.value = ""
    toEl.value = ""
    endorseEl.focus()
}

function clearEndorsementsEl() {
    endorsementsEl.innerHTML = ""
}

function prependEndorsementToEndorsementsEl(endorsement) {
    const [id, { endorse, from, to, likes }] = endorsement
    const newEl = document.createElement("li")

    newEl.innerHTML = `
<b>To ${to}</b>

<p class="endorsement">${endorse}</p>

<div class="from-likes">
    <b>From ${from}</b>
    <b>🖤 ${likes}</b>
</div>`

    newEl.addEventListener("click", () => {
        if (!liked.includes(id)) {
            update(ref(database, `endorsements/${id}`), { likes: likes + 1 })
            addLiked(id)
        }
    })

    endorsementsEl.prepend(newEl)
}

function addLiked(id) {
    liked.push(id)
    localStorage.setItem("endorsements-liked", JSON.stringify(liked))
}
