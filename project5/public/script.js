window.addEventListener("load", () => {
  // ui elements
  let line = document.getElementById("line")
  let controls = document.getElementById("controls")
  let choices = document.getElementById("choices")
  let nameArea = document.getElementById("nameArea")
  let nameInput = document.getElementById("nameInput")
  let nameBtn = document.getElementById("nameBtn")
  let audio = document.getElementById("bgAudio")

  let muteBtn = document.getElementById("muteBtn")
  let unmuteBtn = document.getElementById("unmuteBtn")

  // quiz 
  let answers = []
  let currentQuestionIndex = 0
  let userName = ""

  // prevents overlapping typing
  let typingToken = 0

  // prevents double-click overlap
  let busy = false

  /* ---------------- basic helpers ---------------- */

  function clearControls() {
    controls.innerHTML = ""
  }

  function hideChoices() {
    choices.classList.add("hidden")
    choices.innerHTML = ""
  }

  // force hide/show with inline style 
  function hideNamePrompt() {
    nameArea.classList.add("hidden")
    nameArea.style.display = "none"
  }

  function showNamePrompt() {
    nameArea.classList.remove("hidden")
    nameArea.style.display = "flex"
    nameInput.value = ""
    nameInput.focus()
  }

  function fadeInLine() {
    line.classList.add("visible")
  }

  function fadeOutLine() {
    line.classList.remove("visible")
  }

  function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), ms)
    })
  }

  function cancelTyping() {
    typingToken++
  }

  /* ---------------- typewriter vibez ---------------- */

  async function typeLine(text) {
    cancelTyping()
    let myToken = typingToken

    line.innerHTML = ""
    fadeInLine()

    for (let i = 0; i < text.length; i++) {
      if (myToken != typingToken) return
      line.innerHTML += text[i]
      await sleep(35)
    }
  }

  async function sayThenFade(text, holdMs) {
    await typeLine(text)
    await sleep(holdMs)
    fadeOutLine()
    await sleep(900)
  }

  /* ---------------- buttons (btn) ---------------- */

  function showButton(label, onClick) {
    clearControls()
    let btn = document.createElement("button")
    btn.innerHTML = label

    btn.addEventListener("click", async () => {
      if (busy == true) return
      busy = true
      clearControls()
      await onClick()
      busy = false
    })

    controls.appendChild(btn)
  }

  function showTwoButtons(labelA, onClickA, labelB, onClickB) {
    clearControls()

    let btnA = document.createElement("button")
    let btnB = document.createElement("button")

    btnA.innerHTML = labelA
    btnB.innerHTML = labelB

    btnA.addEventListener("click", async () => {
      if (busy == true) return
      busy = true
      clearControls()
      await onClickA()
      busy = false
    })

    btnB.addEventListener("click", async () => {
      if (busy == true) return
      busy = true
      clearControls()
      await onClickB()
      busy = false
    })

    controls.appendChild(btnA)
    controls.appendChild(btnB)
  }

  /* ---------------- name  ---------------- */

  function waitForName() {
    return new Promise((resolve) => {
      showNamePrompt()

      function submitName() {
        let nm = nameInput.value.trim()
        if (nm.length == 0) return

        userName = nm

        // hide name ui immediately
        hideNamePrompt()

        // fading the “tell me your name” line after submit
        fadeOutLine()

        nameBtn.removeEventListener("click", submitName)
        nameInput.removeEventListener("keydown", handleEnter)

        // give the fade a moment before continuing
        setTimeout(() => {
          resolve(userName)
        }, 900)
      }

      function handleEnter(e) {
        if (e.key == "Enter") {
          submitName()
        }
      }

      nameBtn.addEventListener("click", submitName)
      nameInput.addEventListener("keydown", handleEnter)
    })
  }

  /* ---------------- quiz data ---------------- */

  let quiz = [
    {
      q: "When you meet someone, what do you hope they remember about you?",
      options: [
        { key: "a", label: "A)", text: "my kindness" },
        { key: "b", label: "B)", text: "my honesty" },
        { key: "c", label: "C)", text: "the quiet space I left behind" }
      ]
    },
    {
      q: "If you could return to one moment, you would choose",
      options: [
        { key: "a", label: "A)", text: "the last time I was sure of myself" },
        { key: "b", label: "B)", text: "the " },
        { key: "c", label: "C)", text: " the goodbye I never got to say" }
      ]
    },
    {
      q: "In your dreams, you are usually",
      options: [
        { key: "a", label: "A)", text: "reliving what could of been" },
        { key: "b", label: "B)", text: "running away from something" },
        { key: "c", label: "C)", text: "i dont remember them" }
      ]
    },
    {
      q: "You trust thoughts the most when it is",
      options: [
        { key: "a", label: "A)", text: "fact-based" },
        { key: "b", label: "B)", text: "belief-based" },
        { key: "c", label: "C)", text: "emotion-based" }
      ]
    },
    {
      q: "If someone asked who you are, you would answer with",
      options: [
        { key: "a", label: "A)", text: "a kind person" },
        { key: "b", label: "B)", text: "i'm still getting to know myself so i dont know" },
        { key: "c", label: "C)", text: "someone who wants to always do their best in life" }
      ]
    }
  ]

  /* ---------------- endings ---------------- */

  function getEnding(pattern) {
    if (!pattern || pattern.length != 5) {
      return "You are someone shaped by echoes. You notice what slips away and you still reach for it anyway. You are not searching for a perfect memory. You are searching for a feeling that proves you were here."
    }

    let p = pattern.toLowerCase()

    let q1 = p[0]
    let q2 = p[1]
    let q3 = p[2]
    let q4 = p[3]
    let q5 = p[4]

    let countA = 0
    let countB = 0
    let countC = 0

    for (let i = 0; i < p.length; i++) {
      if (p[i] == "a") countA++
      if (p[i] == "b") countB++
      if (p[i] == "c") countC++
    }

    let cHeavy = countC >= 3

    function getQ1Hook(letter) {
      if (letter == "a") {
        return "You wanted something gentle to stay behind. Something human."
      }

      if (letter == "b") {
        return "You wanted truth to stay behind. Something clean enough to hold."
      }

      return "You wanted the quiet to stay behind. Not empty. Just unclaimed."
    }

    let endings = {
      witness_blur_opening:
        "You live like a witness to your own life, close enough to feel it but far enough to survive it. You trust the blur because it tells the truth about how memory actually works. You do not introduce yourself with facts. You arrive as atmosphere. You are not lost. You are listening.",

      witness_snapshot_rhythm:
        "You watch carefully and you remember hard. You want the past to hold still long enough to be legible, even if the clarity makes it colder. You return to patterns because repetition feels like proof. You are the kind of person who builds a self out of what you can reliably do again.",

      witness_contradiction_question:
        "You observe until the world reveals its double meanings. You trust contradiction because it matches what you have lived. You answer identity with a question, not because you do not know yourself, but because you refuse to be reduced. You are not a single memory. You are a shifting set of true things.",

      runner_care_opening:
        "You run toward the feeling before it disappears. You return to small kindnesses because they are the safest evidence that softness was real. You define yourself as mood because labels feel too rigid for what you are becoming. You are not chasing the past. You are chasing the warmth it left behind.",

      runner_origin_rhythm:
        "You move like you are trying to catch up to the first moment you recognized yourself. You trust patterns, you trust momentum, you trust the part of you that keeps going even when you cannot explain why. You do not want memory to be perfect. You want it to be continuous. You want it to lead somewhere.",

      runner_goodbye_question:
        "You are pulled by an unfinished goodbye. It sits behind your ribs like a door left open. You keep running toward it, not to close it, but to finally name what it cost you. You answer identity with a question because certainty feels like the wrong kind of ending. You are learning how to live without closure.",

      stillness_blur_opening:
        "You stand still while time moves around you, and somehow that stillness becomes its own kind of power. You trust what is soft and incomplete because it admits the truth: memory is not a record, it is a feeling returning. You do not need to prove who you are. You only need to be here.",

      stillness_snapshot_rhythm:
        "You hold the past like an object you can turn in your hands. You prefer clarity, edges, the clean outline of what happened. But even you can feel the way memory slips when you stare too hard. You return to patterns because routine steadies you. You are not unchanged. You are carefully held together.",

      stillness_contradiction_question:
        "You make room for two truths at once. You trust contradiction because it sounds like real life, not a story polished for comfort. You do not define yourself as a fixed statement. You leave yourself open on purpose. You are not trying to remember perfectly. You are trying to remember honestly.",

      storyteller_blur_rhythm:
        "You keep telling the story because the retelling is the only thing that makes it feel real. You trust the blur because it lets the story breathe. You define yourself through patterns because repetition is how you survive uncertainty. You are someone who builds meaning out of fragments, and you do it without asking permission.",

      feeler_care_opening:
        "You choose feeling over proof. You return to small kindnesses because they are the part of memory that still feels safe to touch. You describe yourself as mood because you know identity is something you inhabit, not something you pin down. You are someone who remembers with your body first.",

      quiet_contradiction_question:
        "You want the quiet to remain because the You want the quiet to remain because it gives you space to think without performing. You contradict yourself because different versions of you have survived different things. You answer identity with a question because you know you are more than one moment, more than one name. You are not asking to be understood perfectly. You are asking to be met honestly. is where you can finally hear yourself. You trust contradiction because it refuses the lie that the past is simple. You answer identity with a question because you are not here to be neatly understood. You are here to be felt, even if that feeling is unclear."
    }

    let dream = (q3 == "a") ? "witness" : (q3 == "b") ? "runner" : "stillness"
    let trust = (q4 == "a") ? "blur" : (q4 == "b") ? "snapshot" : "contradiction"
    let self = (q5 == "a") ? "opening" : (q5 == "b") ? "rhythm" : "question"
    let key = dream + "_" + trust + "_" + self

    let baseEnding = ""

    if (q1 == "b" && q5 == "b") {
      baseEnding = endings.storyteller_blur_rhythm
    } else if (q1 == "a" && q2 == "b" && q5 == "a") {
      baseEnding = endings.feeler_care_opening
    } else if (cHeavy == true && q4 == "c" && q5 == "c") {
      baseEnding = endings.quiet_contradiction_question
    } else if (endings[key]) {
      baseEnding = endings[key]
    } else {
      baseEnding =
        "You are someone shaped by echoes. You notice what slips away and you still reach for it anyway. You are not searching for a perfect memory. You are searching for a feeling that proves you were here."
    }

    return baseEnding + " " + getQ1Hook(q1)
  }

  /* ---------------- choices  ---------------- */

  function showChoices(questionObj) {
    choices.classList.remove("hidden")
    choices.innerHTML = ""

    for (let i = 0; i < questionObj.options.length; i++) {
      let opt = questionObj.options[i]

      let btn = document.createElement("button")
      btn.classList.add("choiceBtn")
      btn.innerHTML = opt.label + " " + opt.text

      btn.addEventListener("click", () => {
        answers.push(opt.key)
        currentQuestionIndex++
        nextQuestion()
      })

      choices.appendChild(btn)
    }
  }

  /* ---------------- footer note ---------------- */

  function ensureFooterNote() {
    if (document.getElementById("refreshNote")) return

    let note = document.createElement("div")
    note.id = "refreshNote"
    note.innerHTML = "you may refresh the page whenever you wish to restart."

    note.style.position = "fixed"
    note.style.left = "0"
    note.style.right = "0"
    note.style.bottom = "18px"
    note.style.textAlign = "center"
    note.style.fontFamily = "Eagle Lake, serif"
    note.style.fontSize = "14px"
    note.style.letterSpacing = "0.6px"
    note.style.opacity = "0.65"
    note.style.pointerEvents = "none"
    note.style.userSelect = "none"

    document.body.appendChild(note)
  }

  /* ---------------- flow ---------------- */

  async function introSequence() {
    ensureFooterNote()

    hideChoices()
    hideNamePrompt()
    clearControls()

    await typeLine("hello...? can you hear me?")
    await sleep(400)

    showButton("yes", async () => {
      try {
        audio.volume = 0.35
        await audio.play()
      } catch (e) {}

      fadeOutLine()
      await sleep(900)

      await sayThenFade("you...", 3000)
      await sayThenFade("who are you? why are you so..familiar?", 2200)

      // stays until name is entered
      await typeLine("tell me your name")
      showNamePrompt()

      await waitForName()

      await sayThenFade("ah... " + userName + "...", 1600)
      await sayThenFade("yes... i remember you...", 2200)

      await sayThenFade("you have been here before..", 2800)
      await sayThenFade("forgive me..my memory", 2200)
      await sayThenFade("its all so blurry nowadays..", 2600)
      await sayThenFade("remind me... who you are...", 2600)

      currentQuestionIndex = 0
      answers = []
      nextQuestion()
    })
  }

  async function nextQuestion() {
    hideNamePrompt()
    clearControls()

    if (currentQuestionIndex >= quiz.length) {
      hideChoices()
      await finishQuiz()
      return
    }

    let q = quiz[currentQuestionIndex]
    await typeLine(q.q)
    showChoices(q)
  }

  async function finishQuiz() {
    hideNamePrompt()
    clearControls()

    let pattern = answers.join("")
    let endingText = getEnding(pattern)

    await sayThenFade("Now I remember you...", 1200)

    if (userName.trim().length > 0 && Math.random() > 0.45) {
      await sayThenFade(userName + "... right?", 1400)
    }

    await sayThenFade(endingText, 3600)

    await typeLine("please.. can you stay for a minute..? im afraid to forget you..")
    fadeInLine()

    showTwoButtons(
      "of course",
      async () => {
        await sayThenFade("thank you..you are kinder than you think..", 60000)

        fadeOutLine()
        await sleep(900)
        await typeLine("my memory is slipping.. who are you?")
        fadeInLine()
      },
      "i cannot",
      async () => {
        await sayThenFade("ah of course..foolish of me to ask.", 2400)
        await sayThenFade("please, go enjoy the world", 2400)
      }
    )
  }

  /* ---------------- audio buttons ---------------- */

  muteBtn.addEventListener("click", () => {
    audio.muted = true
  })

  unmuteBtn.addEventListener("click", () => {
    audio.muted = false
    let attempt = audio.play()
    if (attempt) {
      attempt.catch(() => {})
    }
  })

  // start
  hideNamePrompt()
  ensureFooterNote()
  introSequence()
})
