/**
 * Verifica se o usuário está logado e exibe a mensagem de boas-vindas.
 */
function saudarUsuario() {
    const usuarioLogado = sessionStorage.getItem('usuarioLogado');
    if (usuarioLogado) {
        document.getElementById('saudacao').innerText = `Bem-vindo, ${usuarioLogado}`;
    } else {
        // Se tentar acessar a home sem logar, força voltar pro login
        window.location.href = 'login.html';
    }
}

/**
 * Dados das roupas do catálogo (Hardcoded conforme pedido)
 */
const catalogo = {
    matue: {
        maquinaDoTempo: ["É Sal", "Máquina do Tempo", "Cogulândia", "Antes", "Gorila Roxo", "Vem Chapar"],
        tresTresTres: ["333", "Crack com Mussarela", "O Chamado", "Castlevania", "Voo do Dragão", "Maria"]
    },
    lilgiela33: {
        tantoFaz: ["Tanto Faz", "Sem Sentido", "Noite Fria", "Olhos Caídos", "Cicatrizes", "Vazio"],
        hateThisAlbum: ["hate", "dor", "fake", "numb", "scars", "alone"]
    }
};

/**
 * Função para gerar os cards em HTML semântico (<article>).
 * Recebe a lista de nomes e o ID da div onde as roupas serão inseridas.
 */
function renderizarCards(listaRoupas, idContainer) {
    const container = document.getElementById(idContainer);
    let html = '';

    // Loop pela lista para montar cada card
    for (let i = 0; i < listaRoupas.length; i++) {
        // Criação do card com ícone genérico em SVG para simular a camiseta
        html += `
            <article class="card">
                <div class="card-icon">
                    <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#c0c0c0" stroke-width="2">
                        <path d="M20.66 6.98l-7.3-3.46c-1.12-.53-2.61-.53-3.73 0L2.34 6.98a1.5 1.5 0 0 0-.64 2.1l1.52 2.5a1.5 1.5 0 0 0 2.22.42L6 11.6V20a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8.4l.56.4a1.5 1.5 0 0 0 2.22-.42l1.52-2.5a1.5 1.5 0 0 0-.64-2.1z"></path>
                    </svg>
                </div>
                <h4>T-Shirt "${listaRoupas[i]}"</h4>
                <p>Edição Limitada</p>
            </article>
        `;
    }
    
    // Insere os artigos no HTML
    container.innerHTML = html;
}

// Inicializa a página
saudarUsuario();
renderizarCards(catalogo.matue.maquinaDoTempo, 'grid-matue-1');
renderizarCards(catalogo.matue.tresTresTres, 'grid-matue-2');
renderizarCards(catalogo.lilgiela33.tantoFaz, 'grid-lilgiela-1');
renderizarCards(catalogo.lilgiela33.hateThisAlbum, 'grid-lilgiela-2');