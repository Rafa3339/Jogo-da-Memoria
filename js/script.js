document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('game'); // Certifique-se de que o ID está correto
    const restartBtn = document.getElementById('restart');
    const difficultySelect = document.getElementById('difficulty');
    const scoreDisplay = document.getElementById('score');
    let flippedCards = [];
    let score = 0;
    let playerName = prompt('Digite seu nome:') || 'Jogador';
    let matchCount = 0; // Contador de acertos
    document.getElementById('player-name').textContent = playerName;

    function setupGame() {
        // Embaralha as cartas existentes
        const cards = Array.from(document.querySelectorAll('.card'));
        cards.forEach(card => {
            card.classList.remove('flipped'); // Reseta o estado das cartas
        });

        // Embaralha as cartas
        const shuffledCards = cards.sort(() => Math.random() - 0.5);
        board.innerHTML = ''; // Limpa o tabuleiro
        shuffledCards.forEach(card => board.appendChild(card)); // Adiciona as cartas embaralhadas de volta ao tabuleiro

        score = 0;
        scoreDisplay.textContent = score;
        matchCount = 0; // Reseta o contador de acertos
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
            matchCount++; // Incrementa o contador de acertos
            checkWin();

            // Verifica se atingiu 5 acertos
            if (matchCount % 5 === 0) {
                reshuffleCards();
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

    function reshuffleCards() {
        // Seleciona todas as cartas que ainda não foram acertadas (não estão viradas)
        const unflippedCards = Array.from(document.querySelectorAll('.card:not(.flipped)'));
        
        // Verifica se há pelo menos 6 cartas não acertadas para reembaralhar
        if (unflippedCards.length >= 6) {
            // Seleciona 6 cartas aleatórias
            const selectedCards = [];
            while (selectedCards.length < 6) {
                const randomIndex = Math.floor(Math.random() * unflippedCards.length);
                selectedCards.push(unflippedCards.splice(randomIndex, 1)[0]);
            }

            // Adiciona o destaque amarelo
            selectedCards.forEach(card => card.classList.add('highlight'));

            // Remove o destaque amarelo após 1 segundo
            setTimeout(() => {
                selectedCards.forEach(card => card.classList.remove('highlight'));
                // Embaralha as 6 cartas selecionadas
                const shuffledSelectedCards = selectedCards.sort(() => Math.random() - 0.5);

                // Reposiciona as cartas embaralhadas no tabuleiro
                shuffledSelectedCards.forEach(card => board.appendChild(card));
            }, 1000);
        }
    }

    // Adiciona evento de clique nas cartas
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', flipCard);
    });

    restartBtn.addEventListener('click', setupGame);

    setupGame(); // Inicializa o jogo
});
