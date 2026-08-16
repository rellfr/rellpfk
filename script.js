// =====================================================
// WSZYSTKIE PIOSENKI
// =====================================================

const songs = [

    {
        title: "Aż Strach Pomyśleć",
        file: "muzyka/piosenka1.mp3"
    },

    {
        title: "Chwile Ulotne",
        file: "muzyka/piosenka2.mp3"
    },

    {
        title: "Ja to Ja",
        file: "muzyka/piosenka3.mp3"
    },

    {
        title: "Jestem Bogiem",
        file: "muzyka/piosenka4.mp3"
    },

    {
        title: "Nowiny",
        file: "muzyka/piosenka5.mp3"
    },

    {
        title: "Priorytety",
        file: "muzyka/piosenka6.mp3"
    },

    {
        title: "Rób Co Chcesz",
        file: "muzyka/piosenka7.mp3"
    },

    {
        title: "Play + Rec",
        file: "muzyka/piosenka8.mp3"
    },

    {
        title: "C.D. Kinematografii",
        file: "muzyka/piosenka9.mp3"
    },

    {
        title: "Dla Pewnego Swego",
        file: "muzyka/piosenka10.mp3"
    },

    {
        title: "Mechaniczna Pomarańcza",
        file: "muzyka/piosenka11.mp3"
    }

];


// =====================================================
// ZMIENNE
// =====================================================

// Kolejność piosenek w aktualnej rundzie
let playlist = [];


// Aktualna pozycja w playlist
let currentPosition = 0;


// Wynik
let score = 0;


// Wybrany czas fragmentu
let selectedTime = 5;


// Timer zatrzymujący muzykę
let stopTimer = null;


// Czy odpowiedź została już sprawdzona
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

// Tworzymy losową kolejność wszystkich piosenek.

function shuffle(array) {

    const newArray = [...array];


    for (
        let i = newArray.length - 1;
        i > 0;
        i--
    ) {

        const random =
            Math.floor(Math.random() * (i + 1));


        [
            newArray[i],
            newArray[random]
        ] =
        [
            newArray[random],
            newArray[i]
        ];

    }


    return newArray;
}


// =====================================================
// NORMALIZOWANIE ODPOWIEDZI
// =====================================================

// Usuwa:
//
// wielkie litery
// małe litery
// spacje
// kropki
// przecinki
// myślniki
// znaki specjalne
// polskie znaki
//
// Dzięki temu:
//
// C.D. Kinematografii
//
// oraz:
//
// c d kINEMATOGRAFII!!!
//
// zostaną uznane za to samo.

function normalizeAnswer(text) {

    return text

        .toLowerCase()

        .normalize("NFD")

        .replace(
            /[\u0300-\u036f]/g,
            ""
        )

        .replace(
            /[^a-z0-9]/g,
            ""
        );
}


// =====================================================
// NOWA RUNDA
// =====================================================

function createNewRound() {

    // Losujemy wszystkie 11 piosenek
    playlist = shuffle(songs);


    // Zaczynamy od pierwszej
    currentPosition = 0;


    // Wynik zerujemy
    score = 0;


    // Ładujemy pierwszą
    loadSong();

}


// =====================================================
// AKTUALNA PIOSENKA
// =====================================================

function getCurrentSong() {

    return playlist[currentPosition];

}


// =====================================================
// ŁADOWANIE PIOSENKI
// =====================================================

function loadSong() {

    clearTimeout(stopTimer);


    audio.pause();


    const song =
        getCurrentSong();


    // Numer aktualnej piosenki
    songNumber.textContent =
        `Piosenka ${currentPosition + 1} z ${playlist.length}`;


    question.textContent =
        "Jaki jest tytuł piosenki?";


    answerInput.value = "";


    result.textContent = "";


    answered = false;


    // WAŻNE:
    // tutaj ustawiamy prawdziwy plik MP3

    audio.src = song.file;

    audio.load();


    playButton.textContent =
        "▶ ODTWÓRZ FRAGMENT";


    // WRÓĆ

    previousButton.disabled =
        currentPosition === 0;


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


        // Jeśli już gra
        if (!audio.paused) {

            audio.pause();


            playButton.textContent =
                "▶ ODTWÓRZ FRAGMENT";


            return;

        }


        try {

            // Zawsze zaczynamy od początku
            audio.currentTime = 0;


            await audio.play();


            playButton.textContent =
                "⏸ ODTWARZANIE...";


            // Zatrzymanie po 1 / 5 / 10 sekundach

            stopTimer =
                setTimeout(
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
// KONIEC PLIKU MP3
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

    if (answered) {

        return;

    }


    const userAnswer =
        normalizeAnswer(
            answerInput.value
        );


    if (userAnswer === "") {

        result.textContent =
            "❗ Wpisz odpowiedź.";

        return;

    }


    const correctAnswer =
        normalizeAnswer(
            getCurrentSong().title
        );


    if (
        userAnswer ===
        correctAnswer
    ) {

        score++;


        result.textContent =
            "✅ DOBRZE!";

    }

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
// ENTER
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


        // Jeśli jesteśmy na ostatniej
        // kończymy rundę.

        if (
            currentPosition >=
            playlist.length - 1
        ) {

            finishQuiz();

            return;

        }


        // Idziemy dalej

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
// KONIEC RUNDY
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
            Przeszedłeś wszystkie
            11 piosenek.
        </p>

        <h2>
            Poprawne odpowiedzi:
            ${score}
        </h2>

        <button
            onclick="createNewRound()"
        >
            🔀 NOWA LOSOWA RUNDA
        </button>

    `;

}


// =====================================================
// START
// =====================================================

// Losujemy piosenki przy uruchomieniu.

playlist =
    shuffle(songs);


// Start od pierwszej losowej.

loadSong();