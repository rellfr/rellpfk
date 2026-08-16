// =====================================================
// PIOSENKI
// =====================================================

const songs = [
    {
        title: "Aż Strach Pomyśleć",
        file: "https://imagetourl.cloud/t3di974n.mp3"
    },

    {
        title: "Chwile Ulotne",
        file: "https://imagetourl.cloud/176t682b.mp3"
    },

    {
        title: "Ja to Ja",
        file: "https://imagetourl.cloud/rql850fr.mp3"
    },

    {
        title: "Jestem Bogiem",
        file: "https://imagetourl.cloud/niwdd05m.mp3"
    },

    {
        title: "Nowiny",
        file: "https://imagetourl.cloud/c6f8n0ai.mp3"
    },

    {
        title: "Priorytety",
        file: "https://imagetourl.cloud/wag1card.mp3"
    },

    {
        title: "Rób Co Chcesz",
        file: "https://imagetourl.cloud/eu5884u4.mp3"
    },

    {
        title: "Play + Rec",
        file: "https://imagetourl.cloud/0m7nxjof.mp3"
    },

    {
        title: "C.D. Kinematografii",
        file: "https://imagetourl.cloud/98qzhtf5.mp3"
    },

    {
        title: "Dla Pewnego Swego",
        file: "https://imagetourl.cloud/wb7q17k9.mp3"
    },

    {
        title: "Mechaniczna Pomarańcza",
        file: "https://imagetourl.cloud/kvemmtg1.mp3"
    }
];


// =====================================================
// ZMIENNE
// =====================================================

let playlist = [];

let currentPosition = 0;

let score = 0;

let selectedTime = 5;

let stopTimer = null;

let answered = false;


// =====================================================
// ELEMENTY HTML
// =====================================================

const audio =
    document.getElementById("audio");

const playButton =
    document.getElementById("playButton");

const answerInput =
    document.getElementById("answer");

const submitButton =
    document.getElementById("submitAnswer");

const nextButton =
    document.getElementById("nextButton");

const previousButton =
    document.getElementById("previousButton");

const result =
    document.getElementById("result");

const scoreText =
    document.getElementById("score");

const question =
    document.getElementById("question");

const songNumber =
    document.getElementById("songNumber");


// =====================================================
// LOSOWANIE
// =====================================================

function shuffle(array) {

    const newArray = [...array];

    for (
        let i = newArray.length - 1;
        i > 0;
        i--
    ) {

        const random =
            Math.floor(
                Math.random() * (i + 1)
            );

        [
            newArray[i],
            newArray[random]
        ] = [
            newArray[random],
            newArray[i]
        ];
    }

    return newArray;
}


// =====================================================
// NORMALIZOWANIE ODPOWIEDZI
// =====================================================

function normalizeAnswer(text) {

    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "");
}


// =====================================================
// AKTUALNA PIOSENKA
// =====================================================

function getCurrentSong() {

    return playlist[currentPosition];

}


// =====================================================
// NOWA RUNDA
// =====================================================

function createNewRound() {

    playlist = shuffle(songs);

    currentPosition = 0;

    score = 0;

    loadSong();

}


// =====================================================
// ŁADOWANIE PIOSENKI
// =====================================================

function loadSong() {

    clearTimeout(stopTimer);

    audio.pause();

    const song = getCurrentSong();


    songNumber.textContent =
        `Piosenka ${currentPosition + 1} z ${playlist.length}`;


    question.textContent =
        "Jaki jest tytuł piosenki?";


    answerInput.value = "";

    result.textContent = "";

    answered = false;


    // Ustawienie adresu MP3

    audio.src = song.file;

    audio.load();


    playButton.textContent =
        "▶ ODTWÓRZ FRAGMENT";


    previousButton.disabled =
        currentPosition === 0;


    nextButton.disabled = false;


    updateScore();


    answerInput.focus();

}


// =====================================================
// ODTWARZANIE
// =====================================================

playButton.addEventListener(
    "click",
    async function () {

        clearTimeout(stopTimer);


        // Jeśli muzyka aktualnie gra

        if (!audio.paused) {

            audio.pause();

            playButton.textContent =
                "▶ ODTWÓRZ FRAGMENT";

            return;
        }


        try {

            // Zaczynamy od początku

            audio.currentTime = 0;


            await audio.play();


            playButton.textContent =
                "⏸ ODTWARZANIE...";


            // Zatrzymanie po wybranym czasie

            stopTimer = setTimeout(
                function () {

                    audio.pause();

                    playButton.textContent =
                        "▶ ODTWÓRZ FRAGMENT";

                },
                selectedTime * 1000
            );


        } catch (error) {

            console.error(
                "Błąd odtwarzania:",
                error
            );


            result.textContent =
                "❌ Nie można odtworzyć muzyki.";

        }

    }
);


// =====================================================
// KONIEC MP3
// =====================================================

audio.addEventListener(
    "ended",
    function () {

        clearTimeout(stopTimer);

        playButton.textContent =
            "▶ ODTWÓRZ FRAGMENT";

    }
);


// =====================================================
// WYBÓR CZASU
// =====================================================

document
    .querySelectorAll(".time-button")
    .forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    selectedTime =
                        Number(
                            this.dataset.time
                        );


                    document
                        .querySelectorAll(
                            ".time-button"
                        )
                        .forEach(
                            function (btn) {

                                btn.classList.remove(
                                    "active"
                                );

                            }
                        );


                    this.classList.add(
                        "active"
                    );

                }
            );

        }
    );


// =====================================================
// SPRAWDZANIE ODPOWIEDZI
// =====================================================

function checkAnswer() {

    // Nie można odpowiadać drugi raz

    if (answered) {

        return;

    }


    const userAnswer =
        normalizeAnswer(
            answerInput.value
        );


    // Pusta odpowiedź

    if (userAnswer === "") {

        result.textContent =
            "❗ Wpisz odpowiedź.";

        return;

    }


    const correctAnswer =
        normalizeAnswer(
            getCurrentSong().title
        );


    // POPRAWNA

    if (
        userAnswer === correctAnswer
    ) {

        score++;

        result.textContent =
            "✅ DOBRZE!";

    }

    // BŁĘDNA

    else {

        result.textContent =
            "❌ ŹLE! Poprawna odpowiedź: " +
            getCurrentSong().title;

    }


    answered = true;


    clearTimeout(stopTimer);

    audio.pause();


    playButton.textContent =
        "▶ ODTWÓRZ FRAGMENT";


    updateScore();

}


// =====================================================
// PRZYCISK SPRAWDŹ
// =====================================================

submitButton.addEventListener(
    "click",
    checkAnswer
);


// =====================================================
// ENTER = SPRAWDŹ
// =====================================================

answerInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            checkAnswer();

        }

    }
);


// =====================================================
// KOLEJNA PIOSENKA
// =====================================================

nextButton.addEventListener(
    "click",
    function () {

        clearTimeout(stopTimer);


        // Czy to ostatnia?

        if (
            currentPosition >=
            playlist.length - 1
        ) {

            finishQuiz();

            return;

        }


        currentPosition++;

        loadSong();

    }
);


// =====================================================
// WRÓĆ
// =====================================================

previousButton.addEventListener(
    "click",
    function () {

        if (currentPosition <= 0) {

            return;

        }


        currentPosition--;

        loadSong();

    }
);


// =====================================================
// WYNIK
// =====================================================

function updateScore() {

    scoreText.textContent =
        `Poprawne odpowiedzi: ${score}`;

}


// =====================================================
// KONIEC QUIZU
// =====================================================

function finishQuiz() {

    clearTimeout(stopTimer);

    audio.pause();


    document.getElementById(
        "quiz"
    ).innerHTML = `

        <h2>
            KONIEC! 🎉
        </h2>

        <p>
            Przeszedłeś wszystkie 11 piosenek.
        </p>

        <h2>
            Poprawne odpowiedzi: ${score}
        </h2>

        <button
            onclick="location.reload()"
        >
            🔀 NOWA LOSOWA RUNDA
        </button>

    `;

}


// =====================================================
// START
// =====================================================

// Pierwsza runda również jest losowa.

playlist = shuffle(songs);

loadSong();
