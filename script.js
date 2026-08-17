document.addEventListener("DOMContentLoaded", () => {

    let czas = 5;
    let piosenka = null;
    let wynik = 0;
    let sprawdzona = false;
    let numer = 0;
    let timer = null;

    const piosenki = [
        ["https://imagetourl.cloud/ljpik97i.mp3", "Aż Strach Pomyśleć"],
        ["https://imagetourl.cloud/xdfujtna.mp3", "Chwile Ulotne"],
        ["https://imagetourl.cloud/1qmsx1py.mp3", "Ja to Ja"],
        ["https://imagetourl.cloud/7tdpxo8c.mp3", "Jestem Bogiem"],
        ["https://imagetourl.cloud/amc0kizs.mp3", "Nowiny"],
        ["https://imagetourl.cloud/zuxb7m4p.mp3", "Priorytety"],
        ["https://imagetourl.cloud/kv8qoc1o.mp3", "Rób Co Chcesz"],
        ["https://imagetourl.cloud/dckspyi1.mp3", "Play + Rec"],
        ["https://imagetourl.cloud/uk4uz7ky.mp3", "C.D. Kinematografii"],
        ["https://imagetourl.cloud/uh6pnkgr.mp3", "Dla Pewnego Swego"],
        ["https://imagetourl.cloud/9kf76yxi.mp3", "Mechaniczna Pomarańcza"],
        ["https://imagetourl.cloud/v69kvgtq.mp3", "'Le Się Zmahauem"],
        ["https://imagetourl.cloud/iala857t.mp3", "Tak Jak Telewizor (Kipper Remix)"],
        ["https://imagetourl.cloud/mq6jz5zy.mp3", "Na Mocy Paktu"],
        ["https://imagetourl.cloud/kggwsu0n.mp3", "Ja To Ja 2 (Dokładnie Tak!)"],
        ["https://imagetourl.cloud/pug5vxd1.mp3", "Wielkie Dzięki"]
    ];

    const audio = document.getElementById("audio");
    const czasButtons = document.querySelectorAll(".time-button");
    const play = document.getElementById("playButton");
    const answer = document.getElementById("answer");
    const submit = document.getElementById("submitAnswer");
    const result = document.getElementById("result");
    const next = document.getElementById("nextButton");
    const previous = document.getElementById("previousButton");
    const songNumber = document.getElementById("songNumber");
    const score = document.getElementById("score");

    function stop() {
        if (timer) clearTimeout(timer);
        timer = null;
        audio.pause();
        audio.currentTime = 0;
    }

    function nowaPiosenka() {
        stop();

        numer++;

        if (numer > 16) numer = 1;

        piosenka =
            piosenki[Math.floor(Math.random() * piosenki.length)];

        songNumber.textContent = "Piosenka " + numer;
        answer.value = "";
        result.textContent = "";
        sprawdzona = false;
    }

    czasButtons.forEach(button => {
        button.addEventListener("click", () => {

            czas = Number(button.dataset.time);

            czasButtons.forEach(b =>
                b.classList.remove("active")
            );

            button.classList.add("active");

            stop();
        });
    });

    play.addEventListener("click", async () => {

        if (!piosenka) nowaPiosenka();

        stop();

        audio.src = piosenka[0];
        audio.load();

        try {

            await new Promise((resolve, reject) => {

                if (audio.readyState >= 1) {
                    resolve();
                    return;
                }

                audio.onloadedmetadata = resolve;
                audio.onerror = reject;
            });

            const max =
                Math.max(0, audio.duration - czas);

            audio.currentTime =
                Math.random() * max;

            await audio.play();

            timer = setTimeout(() => {
                audio.pause();
                audio.currentTime = 0;
            }, czas * 1000);

        } catch (e) {

            console.error("Błąd audio:", e);

            result.textContent =
                "⚠️ Nie udało się odtworzyć muzyki.";
        }
    });

    function sprawdzOdpowiedz() {

        if (!piosenka || sprawdzona) return;

        const wpisana =
            answer.value.trim().toLowerCase();

        if (!wpisana) {
            result.textContent = "Wpisz tytuł piosenki!";
            return;
        }

        const poprawna =
            piosenka[1].toLowerCase();

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
            "Poprawne odpowiedzi: " + wynik;

        sprawdzona = true;
    }

    submit.addEventListener("click", sprawdzOdpowiedz);

    answer.addEventListener("keydown", e => {
        if (e.key === "Enter") {
            e.preventDefault();
            sprawdzOdpowiedz();
        }
    });

    next.addEventListener("click", nowaPiosenka);

    previous.addEventListener("click", () => {
        stop();
        piosenka = null;
        answer.value = "";
        result.textContent = "";
        sprawdzona = false;
    });

    nowaPiosenka();

    console.log("PAKTO QUIZ działa.");
});
