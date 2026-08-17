document.addEventListener("DOMContentLoaded", () => {

    // ================================
    // USTAWIENIA
    // ================================

    let czas = 5;
    let piosenka = null;
    let wynik = 0;
    let sprawdzona = false;
    let numer = 0;
    let timer = null;
    let koniec = false;


    // ================================
    // 16 PIOSENEK
    // ================================

    const piosenki = [
        [
            "https://imagetourl.cloud/ljpik97i.mp3",
            "Aż Strach Pomyśleć"
        ],
        [
            "https://imagetourl.cloud/xdfujtna.mp3",
            "Chwile Ulotne"
        ],
        [
            "https://imagetourl.cloud/1qmsx1py.mp3",
            "Ja to Ja"
        ],
        [
            "https://imagetourl.cloud/7tdpxo8c.mp3",
            "Jestem Bogiem"
        ],
        [
            "https://imagetourl.cloud/amc0kizs.mp3",
            "Nowiny"
        ],
        [
            "https://imagetourl.cloud/zuxb7m4p.mp3",
            "Priorytety"
        ],
        [
            "https://imagetourl.cloud/kv8qoc1o.mp3",
            "Rób Co Chcesz"
        ],
        [
            "https://imagetourl.cloud/dckspyi1.mp3",
            "Play + Rec"
        ],
        [
            "https://imagetourl.cloud/uk4uz7ky.mp3",
            "C.D. Kinematografii"
        ],
        [
            "https://imagetourl.cloud/uh6pnkgr.mp3",
            "Dla Pewnego Swego"
        ],
        [
            "https://imagetourl.cloud/9kf76yxi.mp3",
            "Mechaniczna Pomarańcza"
        ],
        [
            "https://imagetourl.cloud/v69kvgtq.mp3",
            "'Le Się Zmahauem"
        ],
        [
            "https://imagetourl.cloud/iala857t.mp3",
            "Tak Jak Telewizor (Kipper Remix)"
        ],
        [
            "https://imagetourl.cloud/mq6jz5zy.mp3",
            "Na Mocy Paktu"
        ],
        [
            "https://imagetourl.cloud/kggwsu0n.mp3",
            "Ja To Ja 2 (Dokładnie Tak!)"
        ],
        [
            "https://imagetourl.cloud/pug5vxd1.mp3",
            "Wielkie Dzięki"
        ]
    ];


    // ================================
    // ELEMENTY HTML
    // ================================

    const audio =
        document.getElementById("audio");

    const czasButtons =
        document.querySelectorAll(".time-button");

    const play =
        document.getElementById("playButton");

    const answer =
        document.getElementById("answer");

    const submit =
        document.getElementById("submitAnswer");

    const result =
        document.getElementById("result");

    const next =
        document.getElementById("nextButton");

    const previous =
        document.getElementById("previousButton");

    const songNumber =
        document.getElementById("songNumber");

    const score =
        document.getElementById("score");

    const quiz =
        document.getElementById("quiz");


    // ================================
    // ZATRZYMANIE AUDIO
    // ================================

    function stop() {

        if (timer !== null) {

            clearTimeout(timer);

            timer = null;
        }

        audio.pause();

        try {
            audio.currentTime = 0;
        } catch (e) {
            // nic
        }
    }


    // ================================
    // LOSOWANIE PIOSENKI
    // ================================

    function losujPiosenke() {

        const index =
            Math.floor(
                Math.random() * piosenki.length
            );

        piosenka =
            piosenki[index];
    }


    // ================================
    // NOWA PIOSENKA
    // ================================

    function nowaPiosenka() {

        // JEŚLI BYŁA 16. PIOSENKA
        if (numer >= piosenki.length) {

            koniec = true;

            stop();

            result.textContent =
                "🏁 KONIEC QUIZU!";

            next.style.display = "none";

            play.style.display = "none";

            submit.style.display = "none";

            answer.style.display = "none";

            return;
        }


        stop();

        numer++;


        // Losowanie

        losujPiosenke();


        // Numer

        songNumber.textContent =
            `Piosenka ${numer} / ${piosenki.length}`;


        // Reset

        answer.value = "";

        result.textContent = "";

        sprawdzona = false;


        // Przywrócenie przycisków

        play.style.display = "";

        submit.style.display = "";

        answer.style.display = "";

        next.style.display = "";


        koniec = false;
    }


    // ================================
    // WYBÓR CZASU
    // ================================

    czasButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                if (koniec) {
                    return;
                }

                czas =
                    Number(
                        button.dataset.time
                    );


                czasButtons.forEach(b => {
                    b.classList.remove("active");
                });


                button.classList.add("active");


                stop();
            }
        );

    });


    // ================================
    // ODTWARZANIE
    // ================================

    play.addEventListener(
        "click",
        async () => {

            if (koniec) {
                return;
            }


            if (!piosenka) {
                nowaPiosenka();
            }


            stop();


            audio.src =
                piosenka[0];

            audio.load();


            try {

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


                let maxStart =
                    audio.duration - czas;


                if (
                    !Number.isFinite(maxStart) ||
                    maxStart < 0
                ) {
                    maxStart = 0;
                }


                audio.currentTime =
                    Math.random() * maxStart;


                await audio.play();


                timer =
                    setTimeout(
                        () => {

                            audio.pause();

                            try {
                                audio.currentTime = 0;
                            } catch (e) {}

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

        if (koniec) {
            return;
        }


        if (!piosenka) {
            return;
        }


        if (sprawdzona) {

            result.textContent =
                "Najpierw kliknij „Kolejna piosenka”.";

            return;
        }


        const wpisana =
            answer.value
                .trim()
                .toLowerCase();


        if (!wpisana) {

            result.textContent =
                "Wpisz tytuł piosenki!";

            return;
        }


        const poprawna =
            piosenka[1]
                .trim()
                .toLowerCase();


        if (wpisana === poprawna) {

            wynik++;


            result.textContent =
                "🎉 DOBRZE! +1 punkt";

        } else {

            result.textContent =
                "❌ ŹLE! Poprawna odpowiedź: " +
                piosenka[1];
        }


        score.textContent =
            "Poprawne odpowiedzi: " +
            wynik;


        sprawdzona = true;
    }


    // ================================
    // SPRAWDŹ
    // ================================

    submit.addEventListener(
        "click",
        sprawdzOdpowiedz
    );


    // ================================
    // ENTER
    // ================================

    answer.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter" &&
                !koniec
            ) {

                event.preventDefault();

                sprawdzOdpowiedz();
            }

        }
    );


    // ================================
    // KOLEJNA
    // ================================

    next.addEventListener(
        "click",
        () => {

            if (koniec) {
                return;
            }

            nowaPiosenka();

        }
    );


    // ================================
    // WRÓĆ
    // ================================

    previous.addEventListener(
        "click",
        () => {

            if (koniec) {
                return;
            }

            stop();

            piosenka = null;

            answer.value = "";

            result.textContent = "";

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
