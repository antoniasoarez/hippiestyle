/* ==========================================
   SISTEMA DE NOTIFICAÇÕES (TOAST)
   ========================================== */

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
            position: fixed;
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


/* ==========================================
   LÓGICA DO CARRINHO
   ========================================== */

// Função unificada para gerenciar mensagens de feedback na tela (Sucesso/Erro)
function mostrarMensagem(texto, tipo) {
  // ADIÇÃO: Agora redireciona diretamente para o novo sistema Toast moderno
  // O tempo foi configurado para 2500ms (2.5 segundos) conforme o comportamento original do seu código
  mostrarNotificacao(texto, tipo, 2500);
}

// Lógica de Integração: Envia as propriedades estruturadas para o banco persistente do navegador
function addCarrinho(id, name, price, img, description) {
  // Busca a lista atualizada ou gera um array vazio de controle se for o primeiro item
  var carrinho = JSON.parse(localStorage.getItem('hippiestyle_cart')) || [];

  // Tenta localizar se o produto clicado já existe dentro da listagem através do ID único
  var produtoExistente = carrinho.find(function (item) {
    return item.id === id;
  });

  if (produtoExistente) {
    // Se já existir na lista, incrementa a quantidade nativa preservando a integridade dos dados
    produtoExistente.qty += 1;
  } else {
    // Se for um item inédito, monta o objeto completo esperado pela tela de fechamento de pedido
    var novoProduto = {
      id: id,
      name: name,
      price: price,
      qty: 1,
      img: img,
      description: description
    };
    carrinho.push(novoProduto);
  }

  // Salva o novo estado consolidado do array de volta ao localStorage do navegador
  localStorage.setItem('hippiestyle_cart', JSON.stringify(carrinho));

  // Aciona a mensagem de feedback azul elétrico herdada do CSS padrão
  mostrarMensagem(name + " foi adicionado ao carrinho com sucesso!", "sucesso");
}