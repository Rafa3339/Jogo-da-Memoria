document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('game');
    const restartBtn = document.getElementById('restart');
    const scoreDisplay = document.getElementById('score');
    const difficulty = document.getElementById('difficulty');
    let flippedCards = [];
    let score = 0;
    let playerName = prompt('Digite seu nome:') || 'Jogador';
    let matchCount = 0; // Contador de acertos
    let reshuffleCounter = 0; // Contador para controlar o reembaralhamento
    document.getElementById('player-name').textContent = playerName;

    function setupGame() {
        const cards = Array.from(document.querySelectorAll('.card'));
        cards.forEach(card => {
            card.classList.remove('flipped'); // Reseta o estado das cartas
        });

        const shuffledCards = cards.sort(() => Math.random() - 0.5);
        board.innerHTML = '';
        shuffledCards.forEach(card => board.appendChild(card));

        score = 0;
        scoreDisplay.textContent = score;
        matchCount = 0;
        reshuffleCounter = 0;
    }

    function flipCard() {
        if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
            this.classList.add('flipped');
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
            matchCount++;
            reshuffleCounter++;

            checkWin();

            // A cada 2 pares corretos, reembaralha as cartas não acertadas
            if (reshuffleCounter === 2) {
                reshuffleCards();
                reshuffleCounter = 0; // Reseta o contador de reembaralhamento
            }
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
            alert(`Parabéns, ${playerName}! Você ganhou com ${score} pontos.`);
            saveScore(playerName, score);
        }
    }

    function saveScore(player, score) {
        const scores = JSON.parse(localStorage.getItem('ranking')) || [];
        scores.push({ player, score });
        localStorage.setItem('ranking', JSON.stringify(scores));
    }

    // Reembaralha apenas as cartas não acertadas sem alterar a posição das cartas viradas
    function reshuffleCards() {
        const unflippedCards = Array.from(document.querySelectorAll('.card:not(.flipped)'));
        const allCards = Array.from(document.querySelectorAll('.card'));
    
        if (unflippedCards.length > 1) {
            unflippedCards.forEach(card => {
                const backFace = card.querySelector('.back-face');
                if (backFace) {
                    backFace.classList.add('highlight');
                }
            });
    
            const shuffledUnflippedCards = unflippedCards.sort(() => Math.random() - 0.5);
    
            const newBoard = [];
            allCards.forEach(card => {
                if (card.classList.contains('flipped')) {
                    newBoard.push(card);
                } else {
                    newBoard.push(shuffledUnflippedCards.shift());
                }
            });
    
            board.innerHTML = '';
            newBoard.forEach(card => board.appendChild(card));
    
            // Remove a classe highlight após 2 segundos
            setTimeout(() => {
                const highlighted = document.querySelectorAll('.highlight');
                highlighted.forEach(highlight => {
                    highlight.classList.remove('highlight');
                });
            }, 1200);
        }
    }
    
    

    const cards = document.querySelectorAll('.card');
    cards.forEach(card => card.addEventListener('click', flipCard));

    restartBtn.addEventListener('click', setupGame);

    setupGame();
});
