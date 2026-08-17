let wybranyCzas = 5;
let aktualnaPiosenka = null;
let wynik = 0;
let odpowiedzSprawdzona = false;
let numerPiosenki = 0;
let timerOdtwarzania = null;

const piosenki = [
    {
        plik: "https://imagetourl.cloud/ljpik97i.mp3",
        tytul: "Aż Strach Pomyśleć"
    },
    {
        plik: "https://imagetourl.cloud/xdfujtna.mp3",
        tytul: "Chwile Ulotne"
    },
    {
        plik: "https://imagetourl.cloud/1qmsx1py.mp3",
        tytul: "Ja to Ja"
    },
    {
        plik: "https://imagetourl.cloud/7tdpxo8c.mp3",
        tytul: "Jestem Bogiem"
    },
    {
        plik: "https://imagetourl.cloud/amc0kizs.mp3",
        tytul: "Nowiny"
    },
    {
        plik: "https://imagetourl.cloud/zuxb7m4p.mp3",
        tytul: "Priorytety"
    },
    {
        plik: "https://imagetourl.cloud/kv8qoc1o.mp3",
        tytul: "Rób Co Chcesz"
    },
    {
        plik: "https://imagetourl.cloud/dckspyi1.mp3",
        tytul: "Play + Rec"
    },
    {
        plik: "https://imagetourl.cloud/uk4uz7ky.mp3",
        tytul: "C.D. Kinematografii"
    },
    {
        plik: "https://imagetourl.cloud/uh6pnkgr.mp3",
        tytul: "Dla Pewnego Swego"
    },
    {
        plik: "https://imagetourl.cloud/9kf76yxi.mp3",
        tytul: "Mechaniczna Pomarańcza"
    },
    {
        plik: "https://imagetourl.cloud/v69kvgtq.mp3",
        tytul: "'Le Się Zmahauem"
    },
    {
        plik: "https://imagetourl.cloud/iala857t.mp3",
        tytul: "Tak Jak Telewizor (Kipper Remix)"
    },
    {
        plik: "https://imagetourl.cloud/mq6jz5zy.mp3",
        tytul: "Na Mocy Paktu"
    },
    {
        plik: "https://imagetourl.cloud/kggwsu0n.mp3",
        tytul: "Ja To Ja 2 (Dokładnie Tak!)"
    },
    {
        plik: "https://imagetourl.cloud/pug5vxd1.mp3",
        tytul: "Wielkie Dzięki"
    }
];


// ============================================
// ELEMENTY HTML
// ============================================

const audio = document.getElementById("audio");
const przyciskiCzasu = document.querySelectorAll(".time-button");

const playButton = document.getElementById("playButton");
const poleOdpowiedzi = document.getElementById("answer");
const submitAnswer = document.getElementById("submitAnswer");

const wynikTekst = document.getElementById("result");
const wynikPunkty = document.getElementById("score");

const nextButton = document.getElementById("nextButton");
const previousButton = document.getElementById("previousButton");

const songNumber = document.getElementById("songNumber");


// ============================================
// WYBÓR CZASU
// ============================================

przyciskiCzasu.forEach(przycisk => {

    przycisk.addEventListener("click", () => {

        przyciskiCzasu.forEach(p => {
            p.classList.remove("active");
        });

        przycisk.classList.add("active");

        wybranyCzas = Number(przycisk.dataset.time);

        zatrzymajAudio();
    });

});


// ============================================
// ZATRZYMANIE AUDIO
// ============================================

function zatrzymajAudio() {

    if (timerOdtwarzania !== null) {

        clearTimeout(timerOdtwarzania);

        timerOdtwarzania = null;
    }

    audio.pause();

    try {
        audio.currentTime = 0;
    } catch (error) {
        // Nic
    }
}


// ============================================
// LOSOWANIE PIOSENKI
// ============================================

function wylosujPiosenke() {

    const numer = Math.floor(
        Math.random() * piosenki.length
    );

    aktualnaPiosenka = piosenki[numer];
}


// ============================================
// ODTWARZANIE FRAGMENTU
// ============================================

async function odtworzFragment() {

    if (!aktualnaPiosenka) {
        return;
    }

    zatrzymajAudio();

    audio.src = aktualnaPiosenka.plik;
    audio.preload = "auto";

    try {

        audio.load();

        await new Promise((resolve, reject) => {

            if (audio.readyState >= 1) {
                resolve();
                return;
            }

            const timeout = setTimeout(() => {

                reject(
                    new Error(
                        "Nie udało się załadować muzyki."
                    )
                );

            }, 15000);


            const loaded = () => {

                clearTimeout(timeout);
                resolve();

            };


            const error = () => {

                clearTimeout(timeout);

                reject(
                    new Error(
                        "Błąd ładowania pliku MP3."
                    )
                );

            };


            audio.addEventListener(
                "loadedmetadata",
                loaded,
                { once: true }
            );

            audio.addEventListener(
                "error",
                error,
                { once: true }
            );

        });


        // LOSOWY POCZĄTEK

        let maksymalnyStart =
            audio.duration - wybranyCzas;


        if (
            !Number.isFinite(maksymalnyStart) ||
            maksymalnyStart < 0
        ) {
            maksymalnyStart = 0;
        }


        const losowyStart =
            Math.random() * maksymalnyStart;


        audio.currentTime = losowyStart;


        // ODTWARZANIE

        await audio.play();


        // STOP PO WYBRANYM CZASIE

        timerOdtwarzania = setTimeout(() => {

            audio.pause();

            try {
                audio.currentTime = 0;
            } catch (error) {
                // Nic
            }

            timerOdtwarzania = null;

        }, wybranyCzas * 1000);


    } catch (error) {

        if (error.name === "AbortError") {
            return;
        }

        console.error(
            "Błąd odtwarzania:",
            error
        );

        wynikTekst.textContent =
            "⚠️ Nie udało się odtworzyć muzyki.";
    }
}


// ============================================
// NOWA PIOSENKA
// ============================================

function nowaPiosenka() {

    odpowiedzSprawdzona = false;

    poleOdpowiedzi.value = "";

    wynikTekst.textContent = "";

    wylosujPiosenke();

    numerPiosenki++;

    songNumber.textContent =
        "Piosenka " + numerPiosenki;

    zatrzymajAudio();
}


// ============================================
// ODTWÓRZ PRZYCISKIEM
// ============================================

playButton.addEventListener("click", () => {

    if (!aktualnaPiosenka) {
        nowaPiosenka();
    }

    odtworzFragment();

});


// ============================================
// SPRAWDZANIE ODPOWIEDZI
// ============================================

submitAnswer.addEventListener("click", () => {

    if (!aktualnaPiosenka) {
        return;
    }


    if (odpowiedzSprawdzona) {

        wynikTekst.textContent =
            "Najpierw przejdź do kolejnej piosenki.";

        return;
    }


    const odpowiedz =
        poleOdpowiedzi.value
            .trim()
            .toLowerCase();


    if (odpowiedz === "") {

        wynikTekst.textContent =
            "Wpisz tytuł piosenki!";

        return;
    }


    const poprawna =
        aktualnaPiosenka.tytul
            .trim()
            .toLowerCase();


    if (odpowiedz === poprawna) {

        wynik++;

        wynikTekst.textContent =
            "🎉 DOBRZE! +1 punkt";

    } else {

        wynikTekst.textContent =
            "❌ ŹLE! Poprawna odpowiedź: " +
            aktualnaPiosenka.tytul;
    }


    wynikPunkty.textContent =
        "Poprawne odpowiedzi: " + wynik;


    odpowiedzSprawdzona = true;

});


// ============================================
// ENTER = SPRAWDŹ
// ============================================

poleOdpowiedzi.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            event.preventDefault();

            submitAnswer.click();
        }

    }
);


// ============================================
// KOLEJNA PIOSENKA
// ============================================

nextButton.addEventListener("click", () => {

    nowaPiosenka();

});


// ============================================
// WRÓĆ
// ============================================

previousButton.addEventListener("click", () => {

    zatrzymajAudio();

    aktualnaPiosenka = null;

    odpowiedzSprawdzona = false;

    poleOdpowiedzi.value = "";

    wynikTekst.textContent = "";

});


// ============================================
// START PIERWSZEJ PIOSENKI
// ============================================

nowaPiosenka();

console.log("PAKTO QUIZ uruchomiony poprawnie.");
