<!DOCTYPE html>
<html lang="pl">

<head>
    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>Pakto Quiz</title>

    <link rel="stylesheet" href="style.css">
</head>

<body>

    <!-- ================================ -->
    <!-- EKRAN STARTOWY -->
    <!-- ================================ -->

    <div class="start-screen">

        <h1>PAKTO QUIZ</h1>

        <p>Wybierz czas odtwarzania fragmentu:</p>

        <div class="time-buttons">

            <button
                class="time-button"
                data-time="1"
            >
                1 sekunda
            </button>

            <button
                class="time-button"
                data-time="5"
            >
                5 sekund
            </button>

            <button
                class="time-button"
                data-time="10"
            >
                10 sekund
            </button>

        </div>

        <button id="start-button">
            START
        </button>

    </div>


    <!-- ================================ -->
    <!-- EKRAN GRY -->
    <!-- ================================ -->

    <div class="game-screen">

        <h1>PAKTO QUIZ</h1>

        <div class="score-container">

            Wynik:
            <span id="score">0</span>

        </div>


        <!-- AUDIO -->

        <audio
            id="audio-player"
            preload="auto"
        ></audio>


        <!-- ODPOWIEDŹ -->

        <div class="answer-container">

            <input
                type="text"
                id="answer"
                placeholder="Wpisz tytuł piosenki..."
                autocomplete="off"
            >

            <button id="guess-button">
                ZGADUJ
            </button>

        </div>


        <!-- WYNIK -->

        <div id="result"></div>


        <!-- PRZYCISKI -->

        <div class="game-buttons">

            <button id="next-button">
                Kolejna piosenka
            </button>

            <button id="back-button">
                Cofnij
            </button>

        </div>

    </div>


    <!-- ================================ -->
    <!-- JAVASCRIPT -->
    <!-- ================================ -->

    <script src="script.js"></script>

</body>

</html>
