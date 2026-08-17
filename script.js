document.addEventListener("DOMContentLoaded", function () {

    let wybranyCzas = 5;
    let aktualnaPiosenka = null;
    let wynik = 0;
    let odpowiedzSprawdzona = false;
    let numerPiosenki = 0;
    let timer = null;

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


    // ELEMENTY STRONY

    const audio = document.getElementById("audio");
    const przyciskiCzasu = document.querySelectorAll(".time-button");

    const playButton = document.getElementById("playButton");
    const answer = document.getElementById("answer");
    const submitAnswer = document.getElementById("submitAnswer");

    const result = document.getElementById("result");

    const nextButton = document.getElementById("nextButton");
    const previousButton = document.getElementById("previousButton");

    const songNumber = document.getElementById("songNumber");
    const score = document.getElementById("score");


    // SPRAWDZENIE ELEMENTÓW

    if (
        !audio ||
        !playButton ||
        !answer ||
        !submitAnswer ||
        !result ||
        !nextButton ||
        !previousButton ||
        !songNumber ||
        !score
    ) {
        console.error("Błąd: brakuje elementu HTML.");
        return;
    }


    // WYBÓR CZASU

    przyciskiCzasu.forEach(function (button) {

        button.addEventListener("click", function () {

            przyciskiCzasu.forEach(function (b) {
                b.classList.remove("active");
            });

            button.classList.add("active");

            wybranyCzas = Number(button.dataset.time);

            zatrzymajAudio();
        });

    });


    // ZATRZYMANIE AUDIO

    function zatrzymajAudio() {

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


    // LOSOWANIE PIOSENKI

    function losujPiosenke() {

        const index = Math.floor(
            Math.random() * piosenki.length
        );

        aktualnaPiosenka = piosenki[index];
    }


    // NOWA RUNDA

    function nowaPiosenka() {

        zatrzymajAudio();

        losujPiosenke();

        odpowiedzSprawdzona = false;

        answer.value = "";

        result.textContent = "";

        numerPiosenki++;

        songNumber.textContent =
            "Piosenka " + numerPiosenki;
    }


    // ODTWARZANIE

    async function odtworzFragment() {

        if (!aktualnaPiosenka) {
            nowaPiosenka();
        }

        zatrzymajAudio();

        audio.src = aktualnaPiosenka.plik;

        audio.load();

        try {

            await new Promise(function (resolve, reject) {

                if (audio.readyState >= 1) {
                    resolve();
                    return;
                }

                function loaded() {
                    cleanup();
                    resolve();
                }

                function error() {
                    cleanup();
                    reject(new Error("Nie można załadować MP3."));
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


            let maxStart =
                audio.duration - wybranyCzas;

            if (
                !Number.isFinite(maxStart) ||
                maxStart < 0
            ) {
                maxStart = 0;
            }


            audio.currentTime =
                Math.random() * maxStart;


            await audio.play();


            timer = setTimeout(function () {

                audio.pause();

                try {
                    audio.currentTime = 0;
                } catch (e) {
                    // nic
                }

                timer = null;

            }, wybranyCzas * 1000);


        } catch (error) {

            if (error.name === "AbortError") {
                return;
            }

            console.error(
                "Błąd odtwarzania:",
                error
            );

            result.textContent =
                "⚠️ Nie udało się odtworzyć muzyki.";
        }
    }


    // PRZYCISK ODTWÓRZ

    playButton.addEventListener(
        "click",
        function () {

            odtworzFragment();

        }
    );


    // SPRAWDZANIE ODPOWIEDZI

    submitAnswer.addEventListener(
        "click",
        function () {

            if (!aktualnaPiosenka) {
                return;
            }

            if (odpowiedzSprawdzona) {

                result.textContent =
                    "Najpierw kliknij „Kolejna piosenka”.";

                return;
            }


            const wpisana =
                answer.value
                    .trim()
                    .toLowerCase();


            if (wpisana === "") {

                result.textContent =
                    "Wpisz tytuł piosenki!";

                return;
            }


            const poprawna =
                aktualnaPiosenka.tytul
                    .trim()
                    .toLowerCase();


            if (wpisana === poprawna) {

                wynik++;

                result.textContent =
                    "🎉 DOBRZE! +1 punkt";

            } else {

                result.textContent =
                    "❌ ŹLE! Poprawna odpowiedź: " +
                    aktualnaPiosenka.tytul;
            }


            score.textContent =
                "Poprawne odpowiedzi: " + wynik;


            odpowiedzSprawdzona = true;

        }
    );


    // ENTER = SPRAWDŹ

    answer.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                submitAnswer.click();
            }

        }
    );


    // KOLEJNA PIOSENKA

    nextButton.addEventListener(
        "click",
        function () {

            nowaPiosenka();

        }
    );


    // WRÓĆ

    previousButton.addEventListener(
        "click",
        function () {

            zatrzymajAudio();

            aktualnaPiosenka = null;

            odpowiedzSprawdzona = false;

            answer.value = "";

            result.textContent = "";

        }
    );


    // PIERWSZA PIOSENKA

    nowaPiosenka();


    console.log("PAKTO QUIZ działa poprawnie.");

});
