document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('game');
    const restartBtn = document.getElementById('restart');
    const timerDisplay = document.getElementById('timer');
    const rankingList = document.getElementById('ranking-list');
    let flippedCards = [];
    let startTime;
    let timerInterval;
    var difficulty;
    let playerName = prompt('Digite seu nome:') || 'Jogador';
    let matchCount = 0;
    let reshuffleCounter = 0;
    document.getElementById('player-name').textContent = playerName;

    // Função para formatar o tempo como MM:SS
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Função para iniciar o cronômetro
    function startTimer() {
        startTime = Date.now();
        timerInterval = setInterval(() => {
            const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
            timerDisplay.textContent = formatTime(elapsedTime);
        }, 1000);
    }

    // Função para parar o cronômetro
    function stopTimer() {
        clearInterval(timerInterval);
        const totalTime = Math.floor((Date.now() - startTime) / 1000);
        return totalTime;
    }

    function setupGame() {
        const cards = Array.from(document.querySelectorAll('.card'));
        cards.forEach(card => {
            card.classList.remove('flipped');
        });

        const shuffledCards = cards.sort(() => Math.random() - 0.5);
        board.innerHTML = '';
        shuffledCards.forEach(card => board.appendChild(card));

        matchCount = 0;
        reshuffleCounter = 0;
        timerDisplay.textContent = "00:00";
        clearInterval(timerInterval);
        startTimer(); // Inicia o cronômetro ao começar o jogo
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
            matchCount++;
            reshuffleCounter++;

            checkWin();

            if (reshuffleCounter === 2 && difficulty === 'hard') {
                reshuffleCards();
                reshuffleCounter = 0;
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
            const timeSpent = stopTimer(); // Para o cronômetro e retorna o tempo total
            alert(`Parabéns, ${playerName}! Você completou o jogo em ${formatTime(timeSpent)}.`);
            saveScore(playerName, timeSpent); // Salva o tempo no ranking
            displayRanking(); // Exibe o ranking atualizado
        }
    }

    function saveScore(player, time) {
        const scores = JSON.parse(localStorage.getItem('ranking')) || [];
        scores.push({ player, time });
        // Ordena as pontuações pelo menor tempo (ascendente)
        scores.sort((a, b) => a.time - b.time);
        // Mantém apenas os 5 melhores tempos
        localStorage.setItem('ranking', JSON.stringify(scores.slice(0, 5)));
    }

    function displayRanking() {
        const scores = JSON.parse(localStorage.getItem('ranking')) || [];
        rankingList.innerHTML = ''; // Limpa o ranking anterior

        // Exibe os top 5 jogadores com menor tempo
        scores.forEach((score, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${index + 1}. ${score.player} - Tempo: ${formatTime(score.time)}`;
            rankingList.appendChild(listItem);
        });
    }

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

    // Exibe o ranking ao carregar a página
    displayRanking();
    

    document.getElementById('iniciar').addEventListener('click', () => {
        difficulty = document.querySelector('input[name="difficulty"]:checked').value;
        // Aqui você pode usar a dificuldade para configurar o jogo conforme necessário
        setupGame(); // Exemplo de função que você já tem
    });
    

    document.getElementById('clear-storage').addEventListener('click', () => {
        localStorage.removeItem('ranking'); // Para apagar um item específico
        // localStorage.clear(); // Para apagar todos os itens
        alert('Ranking limpo!');
    });
    
});