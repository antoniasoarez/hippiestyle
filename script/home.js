/* SISTEMA DE NOTIFICAÇÕES (TOAST) — replicado aqui pois home.html não carrega login.js/cadastro.js */

function criarEstiloNotificacao() {
    if (document.getElementById('estilo-notificacao')) return;

    const estilo = document.createElement('style');
    estilo.id = 'estilo-notificacao';
    estilo.textContent = `
    #container-notificacoes {
      position: fixed;
      top: 20px;
      right: 20px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      z-index: 9999;
    }
    .notificacao {
      min-width: 260px;
      max-width: 320px;
      padding: 15px 18px;
      border-radius: 8px;
      color: #ffffff;
      font-family: Arial, sans-serif;
      font-size: 14px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
      opacity: 0;
      transform: translateX(120%);
      transition: opacity 0.4s ease, transform 0.4s ease;
    }
    .notificacao.mostrar { opacity: 1; transform: translateX(0); }
    .notificacao.esconder { opacity: 0; transform: translateX(120%); }
    .notificacao.sucesso { background-color: #14192b; border: 1px solid #3a8bff; }
    .notificacao.erro { background-color: #1a1015; border: 1px solid #6b2b2b; }
  `;
    document.head.appendChild(estilo);
}

function obterContainerNotificacoes() {
    let container = document.getElementById('container-notificacoes');
    if (!container) {
        container = document.createElement('div');
        container.id = 'container-notificacoes';
        document.body.appendChild(container);
    }
    return container;
}

function mostrarNotificacao(texto, tipo, duracao = 4000) {
    criarEstiloNotificacao();
    const container = obterContainerNotificacoes();

    const notificacao = document.createElement('div');
    notificacao.className = `notificacao ${tipo}`;

    const mensagem = document.createElement('p');
    mensagem.textContent = texto;
    mensagem.style.margin = '0';
    notificacao.appendChild(mensagem);

    container.appendChild(notificacao);

    setTimeout(() => notificacao.classList.add('mostrar'), 10);

    setTimeout(() => {
        notificacao.classList.remove('mostrar');
        notificacao.classList.add('esconder');
        setTimeout(() => notificacao.remove(), 400);
    }, duracao);
}

/* BOTÃO DE PERFIL */

function irParaPerfil() {
    const usuarioLogado = sessionStorage.getItem('usuarioLogado');

    if (usuarioLogado) {
        window.location.href = 'perfil.html';
    } else {
        mostrarNotificacao('Você precisa estar logado para acessar o perfil.', 'erro');
        setTimeout(() => {
            window.location.href = 'cadastro.html';
        }, 2000);
    }
}

document.getElementById('botaoPerfil').addEventListener('click', irParaPerfil);

/* NEWSLETTER */

function inscrever() {
    const emailInput = document.getElementById('email-newsletter');
    const email = emailInput.value.trim();
    const mensagem = document.getElementById('mensagem-inscricao');

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === '') {
        mostrarNotificacao('Digite seu e-mail para se inscrever.', 'erro');
        if (mensagem) mensagem.textContent = 'Digite um e-mail.';
        return;
    }

    if (!regexEmail.test(email)) {
        mostrarNotificacao('E-mail inválido. Verifique e tente novamente.', 'erro');
        if (mensagem) mensagem.textContent = 'E-mail inválido.';
        return;
    }

    mostrarNotificacao('Inscrição realizada com sucesso!', 'sucesso');
    if (mensagem) mensagem.textContent = 'Você foi inscrito com sucesso!';
    emailInput.value = '';
}