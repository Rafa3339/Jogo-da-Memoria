document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('game');
    const restartBtn = document.getElementById('restart');
    const scoreDisplay = document.getElementById('score');
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
        // Obtém todas as cartas não acertadas (não viradas)
        const unflippedCards = Array.from(document.querySelectorAll('.card:not(.flipped)'));
        const allCards = Array.from(document.querySelectorAll('.card')); // Todas as cartas no tabuleiro
    
        if (unflippedCards.length > 1) {  // Só embaralha se houver mais de 1 carta não acertada
            // Embaralha as cartas não viradas
            const shuffledUnflippedCards = unflippedCards.sort(() => Math.random() - 0.5);
    
            // Cria uma nova lista para reconstruir o tabuleiro com as cartas na mesma ordem
            const newBoard = [];
    
            allCards.forEach(card => {
                if (card.classList.contains('flipped')) {
                    // Mantém as cartas acertadas (viradas) em suas posições originais
                    newBoard.push(card);
                } else {
                    // Substitui as cartas não acertadas pelas embaralhadas
                    newBoard.push(shuffledUnflippedCards.shift());
                }
            });
    
            // Limpa o tabuleiro e reconstrói com a nova ordem
            board.innerHTML = '';
            newBoard.forEach(card => board.appendChild(card));
        }
    }
    

    const cards = document.querySelectorAll('.card');
    cards.forEach(card => card.addEventListener('click', flipCard));

    restartBtn.addEventListener('click', setupGame);

    setupGame();
});
