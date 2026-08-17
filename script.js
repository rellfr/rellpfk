document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // USTAWIENIA
    // ==========================================

    let wybranyCzas = 5;
    let numerPiosenki = 0;
    let wynik = 0;
    let odpowiedzSprawdzona = false;
    let timer = null;
    let quizZakonczony = false;


    // ==========================================
    // PIOSENKI
    // INDEKS 0 = PIOSENKA 1
    // INDEKS 1 = PIOSENKA 2 itd.
    // ==========================================

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


    // ==========================================
    // ELEMENTY HTML
    // ==========================================

    const audio = document.getElementById("audio");
    const przyciskiCzasu = document.querySelectorAll(".time-button");
    const playButton = document.getElementById("playButton");
    const poleOdpowiedzi = document.getElementById("answer");
    const submitButton = document.getElementById("submitAnswer");
    const wynikTekst = document.getElementById("result");
    const nextButton = document.getElementById("nextButton");
    const previousButton = document.getElementById("previousButton");
    const songNumber = document.getElementById("songNumber");
    const score = document.getElementById("score");


    // ==========================================
    // ZATRZYMANIE AUDIO
    // ==========================================

    function zatrzymajAudio() {

        if (timer !== null) {
            clearTimeout(timer);
            timer = null;
        }

        audio.pause();

        audio.currentTime = 0;
    }


    // ==========================================
    // AKTUALNA PIOSENKA
    // ==========================================

    function aktualnaPiosenka() {

        // numer 1 -> indeks 0
        // numer 2 -> indeks 1
        // itd.

        return piosenki[numerPiosenki - 1];
    }


    // ==========================================
    // NOWA RUNDA
    // ==========================================

    function nowaRunda() {

        // JEŚLI BYŁO JUŻ 16 PIOSENEK
        if (numerPiosenki >= piosenki.length) {

            zakonczQuiz();

            return;
        }


        zatrzymajAudio();


        // ZWIĘKSZAMY NUMER O 1

        numerPiosenki++;


        // RESET ODPOWIEDZI

        odpowiedzSprawdzona = false;

        poleOdpowiedzi.value = "";

        wynikTekst.textContent = "";


        // POKAŻ NUMER

        songNumber.textContent =
            `Piosenka ${numerPiosenki} / ${piosenki.length}`;


        console.log(
            "RUNDA:",
            numerPiosenki,
            "TYTUŁ:",
            aktualnaPiosenka().tytul,
            "PLIK:",
            aktualnaPiosenka().plik
        );
    }


    // ==========================================
    // KONIEC
    // ==========================================

    function zakonczQuiz() {

        quizZakonczony = true;

        zatrzymajAudio();


        songNumber.textContent =
            "KONIEC QUIZU";


        wynikTekst.textContent =
            `🏁 KONIEC QUIZU! Wynik: ${wynik}/${piosenki.length}`;


        playButton.style.display = "none";

        poleOdpowiedzi.style.display = "none";

        submitButton.style.display = "none";

        nextButton.style.display = "none";
    }


    // ==========================================
    // WYBÓR CZASU
    // ==========================================

    przyciskiCzasu.forEach(przycisk => {

        przycisk.addEventListener("click", () => {

            if (quizZakonczony) {
                return;
            }


            wybranyCzas =
                Number(przycisk.dataset.time);


            przyciskiCzasu.forEach(p => {
                p.classList.remove("active");
            });


            przycisk.classList.add("active");


            zatrzymajAudio();
        });

    });


    // ==========================================
    // ODTWARZANIE
    // ZAWSZE OD 0:00
    // ==========================================

    playButton.addEventListener("click", async () => {

        if (quizZakonczony) {
            return;
        }


        const piosenka = aktualnaPiosenka();


        if (!piosenka) {
            return;
        }


        zatrzymajAudio();


        // TEN SAM PLIK CO TYTUŁ
        audio.src = piosenka.plik;

        audio.load();


        try {

            // Czekamy na MP3

            await new Promise((resolve, reject) => {

                if (audio.readyState >= 1) {
                    resolve();
                    return;
                }


                const timeout = setTimeout(() => {
                    cleanup();

                    reject(
                        new Error("Nie udało się załadować MP3.")
                    );
                }, 15000);


                function loaded() {

                    clearTimeout(timeout);
                    cleanup();
                    resolve();
                }


                function error() {

                    clearTimeout(timeout);
                    cleanup();

                    reject(
                        new Error("Błąd ładowania MP3.")
                    );
                }


                function cleanup() {

                    audio.removeEventListener(
                        "loadedmetadata",
                        loaded
                    );

                    audio.removeEventListener(
                        "error",
                        error
                    );
                }


                audio.addEventListener(
                    "loadedmetadata",
                    loaded
                );

                audio.addEventListener(
                    "error",
                    error
                );

            });


            // ==================================
            // ZAWSZE 0:00
            // ==================================

            audio.currentTime = 0;


            // ==================================
            // START
            // ==================================

            await audio.play();


            // ==================================
            // STOP PO WYBRANYM CZASIE
            // ==================================

            timer = setTimeout(() => {

                audio.pause();

                audio.currentTime = 0;

                timer = null;

            }, wybranyCzas * 1000);


        } catch (error) {

            console.error(
                "Błąd odtwarzania:",
                error
            );


            wynikTekst.textContent =
                "⚠️ Nie udało się odtworzyć muzyki.";
        }

    });


    // ==========================================
    // SPRAWDZANIE ODPOWIEDZI
    // ==========================================

    function sprawdzOdpowiedz() {

        if (quizZakonczony) {
            return;
        }


        const piosenka = aktualnaPiosenka();


        if (!piosenka) {
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


        const poprawna =
            piosenka.tytul
                .trim()
                .toLowerCase();


        // ==================================
        // PORÓWNANIE
        // ==================================

        if (odpowiedz === poprawna) {

            wynik++;

            wynikTekst.textContent =
                "🎉 DOBRZE! +1 punkt";

        } else {

            wynikTekst.textContent =
                "❌ ŹLE! Poprawna odpowiedź: " +
                piosenka.tytul;
        }


        score.textContent =
            "Poprawne odpowiedzi: " + wynik;


        odpowiedzSprawdzona = true;
    }


    // ==========================================
    // SPRAWDŹ
    // ==========================================

    submitButton.addEventListener(
        "click",
        sprawdzOdpowiedz
    );


    // ==========================================
    // ENTER
    // ==========================================

    poleOdpowiedzi.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                event.preventDefault();

                sprawdzOdpowiedz();
            }

        }
    );


    // ==========================================
    // KOLEJNA PIOSENKA
    // ==========================================

    nextButton.addEventListener(
        "click",
        () => {

            if (quizZakonczony) {
                return;
            }


            nowaRunda();
        }
    );


    // ==========================================
    // WRÓĆ
    // ==========================================

    previousButton.addEventListener(
        "click",
        () => {

            zatrzymajAudio();

            poleOdpowiedzi.value = "";

            wynikTekst.textContent = "";

            odpowiedzSprawdzona = false;
        }
    );


    // ==========================================
    // START QUIZU
    // ==========================================

    nowaRunda();


    console.log(
        "PAKTO QUIZ uruchomiony poprawnie.",
        "Liczba piosenek:",
        piosenki.length
    );

});
