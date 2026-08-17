let wybranyCzas = 0;
let aktualnaPiosenka = null;
let wynik = 0;
let odpowiedzSprawdzona = false;
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


// ======================================================
// CZEKAMY, AŻ HTML BĘDZIE GOTOWY
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

    // ==================================================
    // ELEMENTY HTML
    // ==================================================

    const audio = document.getElementById("audio-player");
    const przyciskiCzasu = document.querySelectorAll(".time-button");
    const startButton = document.getElementById("start-button");
    const startScreen = document.querySelector(".start-screen");
    const gameScreen = document.querySelector(".game-screen");
    const poleOdpowiedzi = document.getElementById("answer");
    const przyciskZgaduj = document.getElementById("guess-button");
    const wynikTekst = document.getElementById("result");
    const wynikPunkty = document.getElementById("score");
    const nextButton = document.getElementById("next-button");
    const backButton = document.getElementById("back-button");


    // ==================================================
    // SPRAWDZENIE HTML
    // ==================================================

    const brakujaceElementy = [];

    if (!audio) brakujaceElementy.push("#audio-player");
    if (!startButton) brakujaceElementy.push("#start-button");
    if (!startScreen) brakujaceElementy.push(".start-screen");
    if (!gameScreen) brakujaceElementy.push(".game-screen");
    if (!poleOdpowiedzi) brakujaceElementy.push("#answer");
    if (!przyciskZgaduj) brakujaceElementy.push("#guess-button");
    if (!wynikTekst) brakujaceElementy.push("#result");
    if (!wynikPunkty) brakujaceElementy.push("#score");
    if (!nextButton) brakujaceElementy.push("#next-button");
    if (!backButton) brakujaceElementy.push("#back-button");

    if (brakujaceElementy.length > 0) {

        console.error(
            "Brakujące elementy HTML:",
            brakujaceElementy.join(", ")
        );

        return;
    }


    // ==================================================
    // WYBÓR CZASU
    // ==================================================

    przyciskiCzasu.forEach(przycisk => {

        przycisk.addEventListener("click", () => {

            przyciskiCzasu.forEach(p => {
                p.classList.remove("selected");
            });

            przycisk.classList.add("selected");

            wybranyCzas = Number(
                przycisk.dataset.time
            );

        });

    });


    // ==================================================
    // ZATRZYMANIE AUDIO
    // ==================================================

    function zatrzymajAudio() {

        if (timerOdtwarzania !== null) {

            clearTimeout(timerOdtwarzania);

            timerOdtwarzania = null;
        }

        audio.pause();

        audio.onloadedmetadata = null;
        audio.oncanplay = null;

        try {

            audio.currentTime = 0;

        } catch (error) {

            // Nic

        }

    }


    // ==================================================
    // LOSOWANIE PIOSENKI
    // ==================================================

    function wylosujPiosenke() {

        const numer = Math.floor(
            Math.random() * piosenki.length
        );

        aktualnaPiosenka = piosenki[numer];

    }


    // ==================================================
    // ODTWARZANIE FRAGMENTU
    // ==================================================

    async function odtworzFragment() {

        if (!aktualnaPiosenka) {
            return;
        }

        zatrzymajAudio();

        audio.src = aktualnaPiosenka.plik;
        audio.preload = "auto";
        audio.volume = 1;

        try {

            audio.load();


            // ------------------------------------------
            // CZEKAJ NA METADANE
            // ------------------------------------------

            await new Promise((resolve, reject) => {

                if (audio.readyState >= 1) {

                    resolve();
                    return;

                }

                let zakonczone = false;

                const timeout = setTimeout(() => {

                    if (zakonczone) return;

                    zakonczone = true;

                    reject(
                        new Error(
                            "Nie udało się załadować pliku audio."
                        )
                    );

                }, 15000);


                const metadata = () => {

                    if (zakonczone) return;

                    zakonczone = true;

                    clearTimeout(timeout);

                    resolve();

                };


                const blad = () => {

                    if (zakonczone) return;

                    zakonczone = true;

                    clearTimeout(timeout);

                    reject(
                        new Error(
                            "Błąd ładowania pliku audio."
                        )
                    );

                };


                audio.addEventListener(
                    "loadedmetadata",
                    metadata,
                    { once: true }
                );

                audio.addEventListener(
                    "error",
                    blad,
                    { once: true }
                );

            });


            // ------------------------------------------
            // LOSOWY POCZĄTEK PIOSENKI
            // ------------------------------------------

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


            // ------------------------------------------
            // CZEKAJ AŻ AUDIO BĘDZIE GOTOWE
            // ------------------------------------------

            await new Promise((resolve, reject) => {

                if (audio.readyState >= 3) {

                    resolve();
                    return;

                }

                let zakonczone = false;

                const timeout = setTimeout(() => {

                    if (zakonczone) return;

                    zakonczone = true;

                    reject(
                        new Error(
                            "Audio nie jest gotowe do odtwarzania."
                        )
                    );

                }, 15000);


                const gotowe = () => {

                    if (zakonczone) return;

                    zakonczone = true;

                    clearTimeout(timeout);

                    resolve();

                };


                const blad = () => {

                    if (zakonczone) return;

                    zakonczone = true;

                    clearTimeout(timeout);

                    reject(
                        new Error(
                            "Błąd przygotowywania audio."
                        )
                    );

                };


                audio.addEventListener(
                    "canplay",
                    gotowe,
                    { once: true }
                );

                audio.addEventListener(
                    "error",
                    blad,
                    { once: true }
                );

            });


            // ------------------------------------------
            // ODTWARZANIE
            // ------------------------------------------

            await audio.play();


            // ------------------------------------------
            // ZATRZYMAJ PO WYBRANYM CZASIE
            // ------------------------------------------

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


    // ==================================================
    // NOWA RUNDA
    // ==================================================

    function rozpocznijRunde() {

        odpowiedzSprawdzona = false;

        poleOdpowiedzi.value = "";

        wynikTekst.textContent = "";

        wylosujPiosenke();

        odtworzFragment();

        poleOdpowiedzi.focus();

    }


    // ==================================================
    // START GRY
    // ==================================================

    startButton.addEventListener("click", () => {

        if (wybranyCzas === 0) {

            alert(
                "Najpierw wybierz 1, 5 albo 10 sekund!"
            );

            return;
        }


        startScreen.style.display = "none";

        gameScreen.style.display = "block";


        rozpocznijRunde();

    });


    // ==================================================
    // ZGADYWANIE
    // ==================================================

    przyciskZgaduj.addEventListener("click", () => {

        if (!aktualnaPiosenka) {
            return;
        }


        if (odpowiedzSprawdzona) {

            wynikTekst.textContent =
                "Najpierw kliknij „Kolejna piosenka”.";

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


        const poprawnaOdpowiedz =
            aktualnaPiosenka.tytul
                .toLowerCase();


        if (odpowiedz === poprawnaOdpowiedz) {

            wynik++;

            wynikPunkty.textContent = wynik;

            wynikTekst.textContent =
                "🎉 DOBRZE! +1 punkt";

        } else {

            wynikTekst.textContent =
                "❌ ŹLE! Poprawna odpowiedź: " +
                aktualnaPiosenka.tytul;

        }


        odpowiedzSprawdzona = true;

    });


    // ==================================================
    // ENTER = ZGADUJ
    // ==================================================

    poleOdpowiedzi.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                event.preventDefault();

                przyciskZgaduj.click();

            }

        }
    );


    // ==================================================
    // KOLEJNA PIOSENKA
    // ==================================================

    nextButton.addEventListener("click", () => {

        if (wybranyCzas === 0) {
            return;
        }

        rozpocznijRunde();

    });


    // ==================================================
    // COFNIJ
    // ==================================================

    backButton.addEventListener("click", () => {

        zatrzymajAudio();


        audio.removeAttribute("src");

        audio.load();


        aktualnaPiosenka = null;

        odpowiedzSprawdzona = false;


        poleOdpowiedzi.value = "";

        wynikTekst.textContent = "";


        gameScreen.style.display = "none";

        startScreen.style.display = "block";

    });


    // ==================================================
    // GOTOWE
    // ==================================================

    console.log("Pakto Quiz został uruchomiony poprawnie.");

});
