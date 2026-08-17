document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // USTAWIENIA
    // ==========================================

    let wybranyCzas = 5;
    let numerPiosenki = 0;
    let wynik = 0;
    let odpowiedzSprawdzona = false;
    let timerOdtwarzania = null;
    let koniecQuizu = false;


    // ==========================================
    // 16 PIOSENEK
    //
    // KOLEJNOŚĆ JEST STAŁA
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

    const audio =
        document.getElementById("audio");

    const przyciskiCzasu =
        document.querySelectorAll(".time-button");

    const playButton =
        document.getElementById("playButton");

    const poleOdpowiedzi =
        document.getElementById("answer");

    const submitButton =
        document.getElementById("submitAnswer");

    const wynikTekst =
        document.getElementById("result");

    const nextButton =
        document.getElementById("nextButton");

    const previousButton =
        document.getElementById("previousButton");

    const songNumber =
        document.getElementById("songNumber");

    const score =
        document.getElementById("score");


    // ==========================================
    // ZATRZYMANIE AUDIO
    // ==========================================

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


    // ==========================================
    // AKTUALNA PIOSENKA
    // ==========================================

    function pobierzAktualnaPiosenke() {

        if (numerPiosenki < 1) {
            return null;
        }

        return piosenki[numerPiosenki - 1];
    }


    // ==========================================
    // NOWA RUNDA
    // ==========================================

    function rozpocznijNastepnaPiosenke() {

        // Jeśli jest już 16. piosenka,
        // nie tworzymy 17.

        if (numerPiosenki >= piosenki.length) {

            zakonczQuiz();

            return;
        }


        zatrzymajAudio();


        numerPiosenki++;


        odpowiedzSprawdzona = false;


        poleOdpowiedzi.value = "";

        wynikTekst.textContent = "";


        songNumber.textContent =
            "Piosenka " +
            numerPiosenki +
            " / " +
            piosenki.length;


        // Przywracamy elementy,
        // gdy przechodzimy do kolejnej rundy.

        playButton.style.display = "";

        poleOdpowiedzi.style.display = "";

        submitButton.style.display = "";

        nextButton.style.display = "";


        koniecQuizu = false;
    }


    // ==========================================
    // KONIEC QUIZU
    // ==========================================

    function zakonczQuiz() {

        koniecQuizu = true;

        zatrzymajAudio();


        songNumber.textContent =
            "KONIEC QUIZU";


        wynikTekst.textContent =
            "🏁 KONIEC QUIZU!";


        playButton.style.display = "none";

        poleOdpowiedzi.style.display = "none";

        submitButton.style.display = "none";

        nextButton.style.display = "none";
    }


    // ==========================================
    // WYBÓR CZASU
    // ==========================================

    przyciskiCzasu.forEach(przycisk => {

        przycisk.addEventListener(
            "click",
            () => {

                if (koniecQuizu) {
                    return;
                }


                wybranyCzas =
                    Number(
                        przycisk.dataset.time
                    );


                przyciskiCzasu.forEach(p => {

                    p.classList.remove(
                        "active"
                    );

                });


                przycisk.classList.add(
                    "active"
                );


                zatrzymajAudio();
            }
        );

    });


    // ==========================================
    // ODTWARZANIE FRAGMENTU
    //
    // ZAWSZE OD 0:00
    // ==========================================

    playButton.addEventListener(
        "click",
        async () => {

            if (koniecQuizu) {
                return;
            }


            const aktualnaPiosenka =
                pobierzAktualnaPiosenke();


            if (!aktualnaPiosenka) {
                return;
            }


            zatrzymajAudio();


            audio.src =
                aktualnaPiosenka.plik;


            audio.preload = "auto";


            try {

                audio.load();


                // Czekamy na załadowanie
                // informacji o MP3.

                await new Promise(
                    (resolve, reject) => {

                        if (
                            audio.readyState >= 1
                        ) {

                            resolve();

                            return;
                        }


                        const timeout =
                            setTimeout(
                                () => {

                                    cleanup();

                                    reject(
                                        new Error(
                                            "Przekroczono czas ładowania audio."
                                        )
                                    );

                                },
                                15000
                            );


                        function loaded() {

                            clearTimeout(
                                timeout
                            );

                            cleanup();

                            resolve();
                        }


                        function error() {

                            clearTimeout(
                                timeout
                            );

                            cleanup();

                            reject(
                                new Error(
                                    "Błąd ładowania MP3."
                                )
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

                    }
                );


                // ==================================
                // ZAWSZE POCZĄTEK
                // ==================================

                audio.currentTime = 0;


                // ==================================
                // ODTWARZANIE
                // ==================================

                await audio.play();


                // ==================================
                // STOP PO 1 / 5 / 10 SEKUNDACH
                // ==================================

                timerOdtwarzania =
                    setTimeout(
                        () => {

                            audio.pause();

                            try {

                                audio.currentTime = 0;

                            } catch (error) {

                                // Nic
                            }


                            timerOdtwarzania =
                                null;

                        },
                        wybranyCzas * 1000
                    );


            } catch (error) {

                console.error(
                    "Błąd odtwarzania:",
                    error
                );


                wynikTekst.textContent =
                    "⚠️ Nie udało się odtworzyć muzyki.";
            }

        }
    );


    // ==========================================
    // SPRAWDZANIE ODPOWIEDZI
    // ==========================================

    function sprawdzOdpowiedz() {

        if (koniecQuizu) {
            return;
        }


        const aktualnaPiosenka =
            pobierzAktualnaPiosenke();


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
                "Wpisz tytuł piosenki.";

            return;
        }


        const poprawnaOdpowiedz =
            aktualnaPiosenka.tytul
                .trim()
                .toLowerCase();


        if (
            odpowiedz ===
            poprawnaOdpowiedz
        ) {

            wynik++;

            wynikTekst.textContent =
                "🎉 DOBRZE! +1 punkt";


        } else {

            wynikTekst.textContent =
                "❌ ŹLE! Poprawna odpowiedź: " +
                aktualnaPiosenka.tytul;
        }


        score.textContent =
            "Poprawne odpowiedzi: " +
            wynik;


        odpowiedzSprawdzona = true;
    }


    // ==========================================
    // PRZYCISK SPRAWDŹ
    // ==========================================

    submitButton.addEventListener(
        "click",
        sprawdzOdpowiedz
    );


    // ==========================================
    // ENTER = SPRAWDŹ
    // ==========================================

    poleOdpowiedzi.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter" &&
                !koniecQuizu
            ) {

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

            if (koniecQuizu) {
                return;
            }


            rozpocznijNastepnaPiosenke();
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
    // START
    // ==========================================

    rozpocznijNastepnaPiosenke();


    console.log(
        "PAKTO QUIZ uruchomiony poprawnie."
    );

});
