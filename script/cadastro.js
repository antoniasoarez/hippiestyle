/* SISTEMA DE NOTIFICAÇÕES (TOAST) */

/**
 * Injeta no <head> o CSS necessário para estilizar as notificações.
 * Isso é feito criando uma tag <style> e adicionando as regras dentro dela.
 */
function criarEstiloNotificacao() {
    // Evita duplicar o estilo caso a função seja chamada mais de uma vez
    if (document.getElementById('estilo-notificacao')) return;

    const estilo = document.createElement('style');
    estilo.id = 'estilo-notificacao';

    estilo.textContent = `
        /* Container fixo no canto superior direito que vai empilhar as notificações */
        #container-notificacoes {
            position: fixed; /* CORREÇÃO: Adicionado position fixed */
            top: 20px;
            right: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
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

            /* Estado inicial: fora da tela e transparente, para animar a entrada */
            opacity: 0;
            transform: translateX(120%);
            transition: opacity 0.4s ease, transform 0.4s ease;
        }

        /* Classe adicionada logo após a criação, para disparar a animação de entrada */
        .notificacao.mostrar {
            opacity: 1;
            transform: translateX(0);
        }

        /* Classe adicionada antes de remover o elemento, para animar a saída */
        .notificacao.esconder {
            opacity: 0;
            transform: translateX(120%);
        }

        /* Cores de acordo com o tipo da notificação (seguindo a paleta da Hippiestyle) */
        .notificacao.sucesso {
            background-color: #14192b; /* azul marinho escuro */
            border: 1px solid #3a8bff;
        }

        .notificacao.erro {
            background-color: #1a1015;
            border: 1px solid #6b2b2b;
        }

        .notificacao.info {
            background-color: #0a0a10;
            border: 1px solid #14192b;
        }

        /* Botão que pode aparecer dentro da notificação (ex: "Ir para Login") */
        .notificacao button {
            display: block;
            margin-top: 10px;
            padding: 8px 12px;
            border: none;
            border-radius: 5px;
            background-color: #3a8bff;
            color: #ffffff;
            font-size: 13px;
            cursor: pointer;
        }

        .notificacao button:hover {
            background-color: #1f6fe0;
        }
    `;

    document.head.appendChild(estilo);
}

/**
 * Garante que exista na página um container para empilhar as notificações
 * Se ainda não existir, cria e adiciona no final do <body>
 */
function obterContainerNotificacoes() {
    let container = document.getElementById('container-notificacoes');

    if (!container) {
        container = document.createElement('div');
        container.id = 'container-notificacoes';
        document.body.appendChild(container);
    }

    return container;
}

/**
 * Função principal para exibir uma notificação na tela.
 */
function mostrarNotificacao(texto, tipo, duracao = 4000, botaoExtra) {
    criarEstiloNotificacao();
    const container = obterContainerNotificacoes();

    const notificacao = document.createElement('div');
    notificacao.className = `notificacao ${tipo}`;

    const mensagem = document.createElement('p');
    mensagem.textContent = texto;
    mensagem.style.margin = '0';
    notificacao.appendChild(mensagem);

    if (botaoExtra) {
        notificacao.appendChild(botaoExtra);
    }

    container.appendChild(notificacao);

    setTimeout(() => {
        notificacao.classList.add('mostrar');
    }, 10);

    const tempoParaEsconder = setTimeout(() => {
        esconderNotificacao(notificacao);
    }, duracao);

    return { notificacao, tempoParaEsconder };
}

/**
 * Remove a notificação da tela com uma animação suave de saída.
 */
function esconderNotificacao(notificacao) {
    notificacao.classList.remove('mostrar');
    notificacao.classList.add('esconder');

    setTimeout(() => {
        notificacao.remove();
    }, 400);
}


/* LÓGICA DE CADASTRO */

/**
 * Função principal, chamada quando o botão "Criar conta" é clicado.
 */
function criarConta() {
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const senha = document.getElementById('senha').value.trim();
    const confirmar = document.getElementById('confirmar').value.trim();

    // Validação de campos obrigatórios
    if (nome === '' || email === '' || senha === '' || confirmar === '') {
        mostrarNotificacao('Preencha todos os campos obrigatórios (nome, e-mail e senha).', 'erro', 4000);
        return;
    }

    // ADIÇÃO: Validação de senha forte (Mínimo de 8 caracteres, pelo menos uma letra, um número e um caractere especial)
    const regexSenhaForte = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!regexSenhaForte.test(senha)) {
        mostrarNotificacao('A senha deve ter no mínimo 8 caracteres, contendo pelo menos uma letra, um número e um caractere especial.', 'erro', 5000);
        return;
    }

    // Verifica se as senhas coincidem
    if (senha !== confirmar) {
        mostrarNotificacao('As senhas não coincidem. Verifique e tente novamente.', 'erro', 4000);
        return;
    }

    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    // Verifica se o e-mail já está cadastrado
    const emailJaExiste = usuarios.some(function (usuario) {
        return usuario.email.toLowerCase() === email.toLowerCase();
    });

    if (emailJaExiste) {
        mostrarNotificacao('Já existe uma conta cadastrada com este e-mail.', 'erro', 4000);
        return;
    }


    // Verifica se o e-mail é válido (verifica se contém "@"; verifica se contem "texto.com" após esse @; verifica se começa com número ou caractere especial)
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email)) {
        mostrarNotificacao('O e-mail informado é inválido.', 'erro');
        return;
    }

    //Limita a quantidade de caracteres do telefone para 11, caso o usuário tente inserir mais ou menos caracteres, ele será alertado com uma notificação de erro.
    if (telefone !== '' && telefone.length !== 11) {
        mostrarNotificacao('O telefone deve ter 11 caracteres.', 'erro');
        return;
    }

    const novoUsuario = {
        nome: nome,
        email: email,
        telefone: telefone,
        senha: senha
    };

    usuarios.push(novoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    limparFormulario();
    exibirNotificacaoDeCadastroConcluido();
}

function exibirNotificacaoDeCadastroConcluido() {
    const botaoLogin = document.createElement('button');
    botaoLogin.textContent = 'Ir para Login';

    const { notificacao, tempoParaEsconder } = mostrarNotificacao(
        'Cadastro realizado com sucesso!',
        'sucesso',
        5000,
        botaoLogin
    );

    // CORREÇÃO: Redirecionamento configurado num único local centralizado para evitar loops
    const redirecionar = () => {
        window.location.href = '../index.html';
    };

    const timeoutRedirecionamento = setTimeout(redirecionar, 5000);

    botaoLogin.addEventListener('click', function () {
        clearTimeout(tempoParaEsconder);
        clearTimeout(timeoutRedirecionamento);
        redirecionar();
    });
}

function limparFormulario() {
    document.getElementById('nome').value = '';
    document.getElementById('email').value = '';
    document.getElementById('telefone').value = '';
    document.getElementById('senha').value = '';
    document.getElementById('confirmar').value = '';
}

// Função para exibir mensagem de redirecionamento quando o usuário não está logado
function Redirecionamento(){
    let msgRedirecionamento = document.getElementById("msgRedirecionamento");
    msgRedirecionamento.textContent = "É necessário estar logado para acessar esta página.";
}