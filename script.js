document.addEventListener("DOMContentLoaded", () => {

    // ================================
    // USTAWIENIA
    // ================================

    let czas = 5;
    let wynik = 0;
    let sprawdzona = false;
    let numer = 0;
    let timer = null;
    let koniec = false;


    // ================================
    // PIOSENKI
    // KOLEJNOŚĆ JEST WAŻNA
    // ================================

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


    // ================================
    // ELEMENTY
    // ================================

    const audio =
        document.getElementById("audio");

    const czasButtons =
        document.querySelectorAll(".time-button");

    const playButton =
        document.getElementById("playButton");

    const answer =
        document.getElementById("answer");

    const submitButton =
        document.getElementById("submitAnswer");

    const result =
        document.getElementById("result");

    const nextButton =
        document.getElementById("nextButton");

    const previousButton =
        document.getElementById("previousButton");

    const songNumber =
        document.getElementById("songNumber");

    const score =
        document.getElementById("score");


    // ================================
    // ZATRZYMANIE AUDIO
    // ================================

    function zatrzymajAudio() {

        if (timer !== null) {

            clearTimeout(timer);

            timer = null;
        }

        audio.pause();

        audio.currentTime = 0;
    }


    // ================================
    // USTAWIENIE PIOSENKI
    // ================================

    function ustawPiosenke() {

        // numer zaczyna się od 1,
        // tablica od 0

        const indeks = numer - 1;

        // dokładnie ta piosenka,
        // która odpowiada numerowi

        return piosenki[indeks];
    }


    // ================================
    // NOWA PIOSENKA
    // ================================

    function nowaPiosenka() {

        if (numer >= piosenki.length) {

            koniec = true;

            zatrzymajAudio();

            songNumber.textContent =
                "KONIEC QUIZU";

            result.textContent =
                "🏁 KONIEC QUIZU!";

            playButton.style.display = "none";

            answer.style.display = "none";

            submitButton.style.display = "none";

            nextButton.style.display = "none";

            return;
        }


        zatrzymajAudio();

        numer++;

        // WAŻNE:
        // piosenka jest przypisana
        // do numeru

        const piosenka =
            ustawPiosenke();


        songNumber.textContent =
            `Piosenka ${numer} / ${piosenki.length}`;


        answer.value = "";

        result.textContent = "";

        sprawdzona = false;


        // zapamiętujemy aktualną

        window.aktualnaPiosenka =
            piosenka;
    }


    // ================================
    // WYBÓR CZASU
    // ================================

    czasButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                if (koniec) return;

                czas =
                    Number(
                        button.dataset.time
                    );


                czasButtons.forEach(b => {
                    b.classList.remove("active");
                });


                button.classList.add("active");


                zatrzymajAudio();
            }
        );

    });


    // ================================
    // ODTWARZANIE
    // ================================

    playButton.addEventListener(
        "click",
        async () => {

            if (koniec) return;


            const piosenka =
                window.aktualnaPiosenka;


            if (!piosenka) return;


            zatrzymajAudio();


            // Ustawiamy plik

            audio.src =
                piosenka.plik;

            audio.load();


            try {

                // Czekamy aż przeglądarka
                // rozpozna długość MP3

                await new Promise(
                    (resolve, reject) => {

                        if (
                            audio.readyState >= 1
                        ) {

                            resolve();

                            return;
                        }


                        const loaded = () => {

                            cleanup();

                            resolve();
                        };


                        const error = () => {

                            cleanup();

                            reject(
                                new Error(
                                    "Nie można załadować MP3."
                                )
                            );
                        };


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
                // ZAWSZE POCZĄTEK PIOSENKI
                // ==================================

                audio.currentTime = 0;


                // Odtwarzanie

                await audio.play();


                // Zatrzymanie po wybranym czasie

                timer =
                    setTimeout(
                        () => {

                            audio.pause();

                            audio.currentTime = 0;

                            timer = null;

                        },
                        czas * 1000
                    );


            } catch (error) {

                console.error(
                    "Błąd audio:",
                    error
                );


                result.textContent =
                    "⚠️ Nie udało się odtworzyć muzyki.";
            }

        }
    );


    // ================================
    // SPRAWDZANIE ODPOWIEDZI
    // ================================

    function sprawdzOdpowiedz() {

        if (koniec) return;


        if (sprawdzona) {

            result.textContent =
                "Najpierw kliknij „Kolejna piosenka”.";

            return;
        }


        const piosenka =
            window.aktualnaPiosenka;


        if (!piosenka) return;


        const odpowiedz =
            answer.value
                .trim()
                .toLowerCase();


        if (odpowiedz === "") {

            result.textContent =
                "Wpisz tytuł piosenki!";

            return;
        }


        const poprawna =
            piosenka.tytul
                .trim()
                .toLowerCase();


        if (odpowiedz === poprawna) {

            wynik++;

            result.textContent =
                "🎉 DOBRZE! +1 punkt";

        } else {

            result.textContent =
                "❌ ŹLE! Poprawna odpowiedź: " +
                piosenka.tytul;
        }


        score.textContent =
            "Poprawne odpowiedzi: " + wynik;


        sprawdzona = true;
    }


    // ================================
    // PRZYCISK SPRAWDŹ
    // ================================

    submitButton.addEventListener(
        "click",
        sprawdzOdpowiedz
    );


    // ================================
    // ENTER
    // ================================

    answer.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                event.preventDefault();

                sprawdzOdpowiedz();
            }

        }
    );


    // ================================
    // KOLEJNA PIOSENKA
    // ================================

    nextButton.addEventListener(
        "click",
        () => {

            if (koniec) return;

            nowaPiosenka();
        }
    );


    // ================================
    // WRÓĆ
    // ================================

    previousButton.addEventListener(
        "click",
        () => {

            zatrzymajAudio();

            result.textContent = "";

            answer.value = "";

            sprawdzona = false;
        }
    );


    // ================================
    // START
    // ================================

    nowaPiosenka();


    console.log(
        "PAKTO QUIZ działa. Piosenek:",
        piosenki.length
    );

});
