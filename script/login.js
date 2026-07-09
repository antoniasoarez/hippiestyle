/* SISTEMA DE NOTIFICAÇÕES PADRONIZADO (TOAST) PARA O LOGIN */

function criarEstiloNotificacao() {
    if (document.getElementById('estilo-notificacao')) return;

    const estilo = document.createElement('style');
    estilo.id = 'estilo-notificacao';

    /* CORREÇÃO: Comentários do CSS ajustados */
    estilo.textContent = `
        /* Container fixo no canto superior direito que vai empilhar as notificações */
        #container-notificacoes {
            position: fixed;
            top: 20px;
            right: 20px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            z-index: 9999;
        }

        /* Estilo base de cada notificação */
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

        .notificacao.mostrar {
            opacity: 1;
            transform: translateX(0);
        }

        .notificacao.esconder {
            opacity: 0;
            transform: translateX(120%);
        }

        .notificacao.sucesso {
            background-color: #14192b;
            border: 1px solid #3a8bff;
        }

        .notificacao.erro {
            background-color: #1a1015;
            border: 1px solid #6b2b2b;
        }
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

/* CORREÇÃO: Função de notificação implementada no Login para padronizar */
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

    setTimeout(() => {
        notificacao.classList.add('mostrar');
    }, 10);

    setTimeout(() => {
        notificacao.classList.remove('mostrar');
        notificacao.classList.add('esconder');
        setTimeout(() => { notificacao.remove(); }, 400);
    }, duracao);
}

/**
 * Função responsável por validar as credenciais do usuário puxando os dados do localStorage.
 */
function fazerLogin() {
    /* CORREÇÃO: IDs corrigidos para baterem com o login.html */
    const emailInput = document.getElementById('email').value.trim();
    const senhaInput = document.getElementById('senha').value.trim();

    // Fallback inline para a div de mensagem estática 
    const divMsg = document.getElementById('mensagem');

    if (emailInput === '' || senhaInput === '') {
        mostrarNotificacao('Por favor, preencha todos os campos.', 'erro');
        if(divMsg) { divMsg.textContent = 'Preencha os campos.'; divMsg.className = 'msg error'; }
        return;
    }

    /* CORREÇÃO CRÍTICA: Recupera o array de usuários que foi gravado no cadastro */
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    // Procura no array se existe algum objeto usuário com correspondência exata de email e senha
    const usuarioEncontrado = usuarios.find(function (usuario) {
        return usuario.email.toLowerCase() === emailInput.toLowerCase() && usuario.senha === senhaInput;
    });

    if (usuarioEncontrado) {
        // Grava no SessionStorage o estado da sessão atual logada
        sessionStorage.setItem('usuarioLogado', usuarioEncontrado.nome);

        mostrarNotificacao('Acesso liberado. Redirecionando...', 'sucesso');
        if(divMsg) { divMsg.textContent = 'Acesso liberado.'; divMsg.className = 'msg success'; }

        // Redireciona para a página Home após o feedback visual
        setTimeout(() => {
            window.location.href = '../pages/home.html';
        }, 1500);
    } else {
        // Caso as credenciais não correspondam a nenhum usuário cadastrado
        mostrarNotificacao('E-mail ou senha inválidos.', 'erro');
        if(divMsg) { divMsg.textContent = 'Usuário ou senha inválidos.'; divMsg.className = 'msg error'; }
    }
}