document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('game');
    const timerDisplay = document.getElementById('timer');
    const finalTimer = document.getElementById('final-timer')
    const rankingEasy = document.getElementById('ranking-easy');
    const rankingHard = document.getElementById('ranking-hard');
    let flippedCards = [];
    let startTime;
    let timerInterval;
    var difficulty;
    let playerName;
    let matchCount = 0;
    let reshuffleCounter = 0;

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
            finalTimer.textContent = formatTime(timeSpent);
            const vitoria = document.getElementById('mensagem');
            vitoria.innerHTML = `Parabéns, ${playerName}! Você completou o jogo em ${formatTime(timeSpent)}.<br>Voltando ao menu...`; // Altera o conteúdo da span
            saveScore(playerName, timeSpent); // Salva o tempo no ranking
            document.getElementById('ganhou').classList.remove('display-none');
            document.getElementById('ganhou').classList.add('display-flex');
            setTimeout(() => {
                document.getElementById('ganhou').classList.remove('display-flex');
                document.getElementById('ganhou').classList.add('display-none');
                document.getElementById('cronometro').classList.remove('display-flex');
                document.getElementById('cronometro').classList.add('display-none');
                document.getElementById('menu-final').classList.remove('display-none');
                document.getElementById('menu-final').classList.add('display-flex');
                document.getElementById('game').classList.remove('display-grid');
                document.getElementById('game').classList.add('display-none');
            }, 3000);
            
            // document.getElementById('ranking').classList.remove('display-none');
            // document.getElementById('ranking').classList.add('display-flex');
        }
    }

    function saveScore(player, time) {
        if(difficulty === 'hard'){
            const scores = JSON.parse(localStorage.getItem('ranking-hard')) || [];
            scores.push({ player, time });
            scores.sort((a, b) => a.time - b.time);
            localStorage.setItem('ranking-hard', JSON.stringify(scores.slice(0, 5)));
        }
        else{
            const scores = JSON.parse(localStorage.getItem('ranking-easy')) || [];
            scores.push({ player, time });
            scores.sort((a, b) => a.time - b.time);
            localStorage.setItem('ranking-easy', JSON.stringify(scores.slice(0, 5)));
        }
    }

    function displayRanking() {
        rankingEasy.innerHTML = ''; // Limpa o ranking anterior antes de adicionar os novos dados
        rankingHard.innerHTML = ''; // Limpa o ranking anterior antes de adicionar os novos dados
        
        const scoresHard = JSON.parse(localStorage.getItem('ranking-hard')) || [];
        const scoresEasy = JSON.parse(localStorage.getItem('ranking-easy')) || [];
    
        scoresHard.forEach((score, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${index + 1}. ${score.player} - Tempo: ${formatTime(score.time)}`;
            rankingHard.appendChild(listItem);
        });
    
        scoresEasy.forEach((score, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${index + 1}. ${score.player} - Tempo: ${formatTime(score.time)}`;
            rankingEasy.appendChild(listItem);
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
            }, 1000);
        }
    }

    const cards = document.querySelectorAll('.card');
    cards.forEach(card => card.addEventListener('click', flipCard));

    document.getElementById('restart').addEventListener('click', () =>{
        document.getElementById('cronometro').classList.remove('display-none');
        document.getElementById('cronometro').classList.add('display-flex');
        document.getElementById('menu-final').classList.remove('display-flex');
        document.getElementById('menu-final').classList.add('display-none');
        document.getElementById('game').classList.remove('display-none');
        document.getElementById('game').classList.add('display-grid');
        document.getElementById('ranking').classList.remove('display-flex');
        document.getElementById('ranking').classList.add('display-none');
        setupGame();
    });
    // Exibe o ranking ao carregar a página
    document.getElementById("rank").addEventListener('click', () => {
        document.getElementById('menu-final').classList.remove('display-flex');
        document.getElementById('menu-final').classList.add('display-none');
        document.getElementById("ranking").classList.remove('display-none');
        document.getElementById("ranking").classList.add('display-flex');
        displayRanking();
    });


    document.getElementById('voltar').addEventListener('click', () => {
        document.getElementById('ranking').classList.remove('display-flex');
        document.getElementById('ranking').classList.add('display-none');
        document.getElementById('menu-final').classList.remove('display-none');
        document.getElementById('menu-final').classList.add('display-flex');
    })  

    document.getElementById('iniciar').addEventListener('click', () => {
        difficulty = document.querySelector('input[name="difficulty"]:checked').value;
        playerName = document.getElementById('name').value;
        if (playerName.trim() === '') {
            alert('Por favor, digite seu nome!');
            return; // Não inicia o jogo se o nome não estiver preenchido
        }
        
        document.getElementById('menu-inicial').classList.remove('display-flex');
        document.getElementById('menu-inicial').classList.add('display-none');
        document.getElementById('game').classList.remove('display-none');
        document.getElementById('game').classList.add('display-grid');
        document.getElementById('cronometro').classList.remove('display-none');
        document.getElementById('cronometro').classList.add('display-flex');
        
        // Aqui você pode usar a dificuldade para configurar o jogo conforme necessário
        setupGame(); // Exemplo de função que você já tem
    });
    

    document.getElementById('clear-storage').addEventListener('click', () => {
        localStorage.clear(); // Para apagar todos os itens
        alert('Ranking limpo!');
    });
    
});