document.addEventListener('DOMContentLoaded', () => {
    const areaDeJogo = document.getElementById('game');
    const resetBtn = document.getElementById('restart');
    const tempo = document.getElementById('timer');
    const ranking = document.getElementById('ranking-list');
    let cartasViradas = [];
    let tempoInicial;
    let intervaloTempo;
    var dificuldade;
    let nomeJogador; // pegar nome depois
    let contador = 0;
    let contadorReembaralha = 0;

    // Função para formatar o tempo como MM:SS
    function formatarTempo(segundos) {
        const minutos = Math.floor(segundos / 60);
        const segun = segundos % 60;
        return `${minutos < 10 ? '0' : ''}${minutos}:${segun < 10 ? '0' : ''}${segun}`;
    }

    // Função para iniciar o cronômetro
    function iniciarTemporizador() {
        tempoInicial = Date.now();
        intervaloTempo = setInterval(() => {
            const tempoGasto = Math.floor((Date.now() - tempoInicial) / 1000);
            tempo.textContent = formatarTempo(tempoGasto);
        }, 1000);
    }

    // Função para parar o cronômetro
    function pararCronometro() {
        clearInterval(intervaloTempo);
        const tempoTotal = Math.floor((Date.now() - tempoInicial) / 1000);
        return tempoTotal;
    }

    function configuraJogo() {
        const cartas = Array.from(document.querySelectorAll('.card'));
        cartas.forEach(carta => {
            carta.classList.remove('flipped');
        });

        const embaralha = cartas.sort(() => Math.random() - 0.5);
        areaDeJogo.innerHTML = '';
        embaralha.forEach(carta => areaDeJogo.appendChild(carta));

        contador = 0;
        contadorReembaralha = 0;
        tempo.textContent = "00:00";
        clearInterval(intervaloTempo);
        iniciarTemporizador(); // Inicia o cronômetro ao começar o jogo
    }

    function virarCarta() {
        if (cartasViradas.length < 2 && !this.classList.contains('flipped')) {
            this.classList.add('flipped');
            cartasViradas.push(this);

            if (cartasViradas.length === 2) {
                checarIguais();
            }
        }
    }

    function checarIguais() {
        const [primeira, segunda] = cartasViradas;

        if (primeira.dataset.value === segunda.dataset.value) {
            cartasViradas = [];
            contador++;
            contadorReembaralha++;

            checarVitoria();

            if (contadorReembaralha === 2 && dificuldade === 'hard') {
                reembaralhar();
                contadorReembaralha = 0;
            }
        } else {
            setTimeout(() => {
                primeira.classList.remove('flipped');
                segunda.classList.remove('flipped');
                cartasViradas = [];
            }, 1000);
        }
    }

    function checarVitoria() {
        if (document.querySelectorAll('.card.flipped').length === document.querySelectorAll('.card').length) {
            const tempoUsado = pararCronometro(); // Para o cronômetro e retorna o tempo total
            alert(`Parabéns, ${nomeJogador}! Você completou o jogo em ${formatarTempo(tempoUsado)}.`);
            salvarPontos(nomeJogador, tempoUsado); // Salva o tempo no ranking
            mostrarRank(); // Exibe o ranking atualizado
        }
    }

    function salvarPontos(jogador, time) {
        const placar = JSON.parse(localStorage.getItem('ranking')) || [];
        placar.push({ jogador, time });
        // Ordena as pontuações pelo menor tempo (ascendente)
        placar.sort((a, b) => a.time - b.time);
        // Mantém apenas os 5 melhores tempos
        localStorage.setItem('ranking', JSON.stringify(placar.slice(0, 5)));
    }

    function mostrarRank() {
        const placar = JSON.parse(localStorage.getItem('ranking')) || [];
        ranking.innerHTML = ''; // Limpa o ranking anterior

        // Exibe os top 5 jogadores com menor tempo
        placar.forEach((score, index) => {
            const listaRank = document.createElement('li');
            listaRank.textContent = `${index + 1}. ${score.jogador} - Tempo: ${formatarTempo(score.time)}`;
            ranking.appendChild(listaRank);
        });
    }

    function reembaralhar() {
        const naoViradas = Array.from(document.querySelectorAll('.card:not(.flipped)'));
        const todasCartas = Array.from(document.querySelectorAll('.card'));

        if (naoViradas.length > 1) {
            naoViradas.forEach(carta => {
                const verso = carta.querySelector('.back-face');
                if (verso) {
                    verso.classList.add('highlight');
                }
            });

            const naoViradasEmbaralhadas = naoViradas.sort(() => Math.random() - 0.5);

            const novaArea = [];
            todasCartas.forEach(carta => {
                if (carta.classList.contains('flipped')) {
                    novaArea.push(carta);
                } else {
                    novaArea.push(naoViradasEmbaralhadas.shift());
                }
            });

            areaDeJogo.innerHTML = '';
            novaArea.forEach(carta => areaDeJogo.appendChild(carta));

            setTimeout(() => {
                const destaque = document.querySelectorAll('.highlight');
                destaque.forEach(destacada => {
                    destacada.classList.remove('highlight');
                });
            }, 1200);
        }
    }

    const cartas = document.querySelectorAll('.card');
    cartas.forEach(carta => carta.addEventListener('click', virarCarta));

    resetBtn.addEventListener('click', configuraJogo);

    // Exibe o ranking ao carregar a página
    mostrarRank();
    

    document.getElementById('iniciar').addEventListener('click', () => {
        dificuldade = document.querySelector('input[name="dificuldade"]:checked').value;
        
        // Aqui você pode usar a dificuldade para configurar o jogo conforme necessário
        configuraJogo(); // Exemplo de função que você já tem
    });
    

    document.getElementById('clear-storage').addEventListener('click', () => {
        localStorage.removeItem('ranking'); // Para apagar um item específico
        // localStorage.clear(); // Para apagar todos os itens
        alert('Ranking limpo!');
    });
    
});