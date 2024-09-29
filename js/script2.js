document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('game');
    const restartBtn = document.getElementById('restart');
    const difficultySelect = document.getElementById('difficulty');
    const scoreDisplay = document.getElementById('score');
    let flippedCards = [];
    let score = 0;
    let playerName = prompt('Digite seu nome:') || 'Jogador';

    //document.getElementById('player-name').textContent = playerName;

    function setupGame() {
        console.log("ta ino até aqui1");
        // Embaralha as cartas existentes
        const cards = Array.from(document.querySelectorAll('.card'));
        cards.forEach(card => {
            card.classList.remove('flipped'); // Reseta o estado das cartas
        });

        // Embaralha as cartas
        const shuffledCards = cards.sort(() => Math.random() - 0.5);
        board.innerHTML = ''; // Limpa o tabuleiro
        shuffledCards.forEach(card => board.appendChild(card)); // Adiciona as cartas embaralhadas de volta ao tabuleiro
        console.log("ta ino até aqui2");
        
        
        score = 0;
        scoreDisplay.textContent = score;
    }

    function flipCard() {
        if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
            this.classList.add('flipped'); // Adiciona a classe para animar a carta
            flippedCards.push(this);

            if (flippedCards.length === 2) {
                checkForMatch();
            }
        }
    }

    function checkForMatch() {
        const [first, second] = flippedCards;

        if (first.dataset.value === second.dataset.value) {
            flippedCards = [];
            score += 10;
            scoreDisplay.textContent = score;
            checkWin();
        } else {
            setTimeout(() => {
                first.classList.remove('flipped');
                second.classList.remove('flipped');
                flippedCards = [];
            }, 1000);
        }
    }

    function checkWin() {
        if (document.querySelectorAll('.card.flipped').length === document.querySelectorAll('.card').length) {
            //alert(`Parabéns, ${playerName}! Você ganhou com ${score} pontos.`);
            saveScore(playerName, score);
        }
    }

    function saveScore(player, score) {
        const scores = JSON.parse(localStorage.getItem('ranking')) || [];
        scores.push({ player, score });
        localStorage.setItem('ranking', JSON.stringify(scores));
    }

    // Adiciona evento de clique nas cartas
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', flipCard);
    });

    restartBtn.addEventListener('click', setupGame);

    setupGame(); // Inicializa o jogo
});
