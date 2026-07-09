// Gerenciamento e persistência do Estado da aplicação usando a chave exata requisitada
let cart = JSON.parse(localStorage.getItem('hippiestyle_cart')) || [];

// Função utilitária interna de formatação financeira em padrão brasileiro (BRL)
function formatBRL(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Renderiza dinamicamente os cards modernos de e-commerce e preenche os resumos calculados
function renderizarCarrinho() {
    const ulCarrinho = document.getElementById('ulCarrinho');
    const paineisControle = document.getElementById('paineisControle');
    const colunaResumo = document.getElementById('colunaResumo');

    // Validação preventiva contra manipulação incorreta da DOM externa
    if (!ulCarrinho) return;

    // Caso o carrinho esteja vazio: aplica o Estado Vazio visual com ícone e aviso amigável
    if (!cart || cart.length === 0) {
        if (paineisControle) paineisControle.style.display = 'none';
        if (colunaResumo) colunaResumo.style.display = 'none';

        ulCarrinho.innerHTML = `
            <div class="vazio-wrapper">
                <p>Seu carrinho de compras está vazio no momento.</p>
                <button type="button" class="btn-finalizar" style="max-width: 220px;" onclick="window.location.href='produtos.html'">Voltar para a Loja</button>
            </div>
        `;
        
        // Zera os contadores nativos requeridos
        document.getElementById('txtQuantidadeCarrinho').innerText = "Total de produtos: 0";
        document.getElementById('txtTotalCarrinho').innerText = "Total: R$ 0,00";
        localStorage.removeItem('hippiestyle_cart');
        return;
    }

    // Restaura exibição normal dos blocos de e-commerce estruturados
    if (paineisControle) paineisControle.style.display = 'flex';
    if (colunaResumo) colunaResumo.style.display = 'block';

    ulCarrinho.innerHTML = '';

    // Loop de renderização dos cards ricos em informações e botões de incremento/decremento
    cart.forEach(item => {
        const subtotalItem = item.price * item.qty;
        const itemDescricao = item.description || "Design exclusivo da coleção HippieStyle.";
        const imagemSrc = item.img || 'https://via.placeholder.com/140';

        const li = document.createElement('li');
        li.className = 'card-produto-carrinho';
        li.innerHTML = `
            <img src="${imagemSrc}" alt="${item.name}">
            
            <div class="detalhes-produto">
                <h4>${item.name}</h4>
                <p class="descricao-carrinho">${itemDescricao}</p>
                <p class="preco-unitario">${formatBRL(item.price)}</p>
            </div>

            <div class="controles-valores-item">
                <div class="stepper-quantidade">
                    <button type="button" onclick="alterarQuantidade(${item.id}, -1)">-</button>
                    <span class="num-qtd">${item.qty}</span>
                    <button type="button" onclick="alterarQuantidade(${item.id}, 1)">+</button>
                </div>
                
                <div class="subtotal-produto">
                    ${formatBRL(subtotalItem)}
                </div>

                <button type="button" class="btn-remover-item" onclick="removerItemIndividual(${item.id})" title="Remover este produto">✕</button>
            </div>
        `;
        ulCarrinho.appendChild(li);
    });

    atualizarResumoValores();
}

// Altera incrementalmente a quantidade do item (+ e -) integrando a validação mínima de 1 item
function alterarQuantidade(id, mudanca) {
    cart = cart.map(item => {
        if (item.id === id) {
            const novaQtd = item.qty + mudanca;
            return { ...item, qty: Math.max(1, novaQtd) };
        }
        return item;
    });
    
    exibirMensagemFeedback("Quantidade atualizada.", "sucesso");
    salvarEstadoERenderizar();
}

// Exclui completamente um item específico do array através do botão de fechar (✕)
function removerItemIndividual(id) {
    cart = cart.filter(item => item.id !== id);
    exibirMensagemFeedback("Produto removido do carrinho.", "sucesso");
    salvarEstadoERenderizar();
}

// Função obrigatória: Remove o último elemento adicionado ao array de dados
function removerUltimoProduto() {
    if (cart.length > 0) {
        const itemRemovido = cart.pop();
        exibirMensagemFeedback(`"${itemRemovido.name}" removido com sucesso.`, "sucesso");
        salvarEstadoERenderizar();
    } else {
        exibirMensagemFeedback("Não há itens para remover.", "erro");
    }
}

// Função obrigatória: Ordenação alfabética de A a Z baseada na propriedade string .name
function ordenarCarrinho() {
    if (cart.length > 1) {
        cart.sort((a, b) => a.name.localeCompare(b.name));
        exibirMensagemFeedback("Carrinho ordenado alfabeticamente.", "sucesso");
        salvarEstadoERenderizar();
    } else {
        exibirMensagemFeedback("Itens insuficientes para ordenar.", "erro");
    }
}

// Função obrigatória: Esvazia por completo o vetor e limpa a memória local
function limparCarrinho() {
    cart = [];
    exibirMensagemFeedback("Carrinho esvaziado com sucesso.", "sucesso");
    salvarEstadoERenderizar();
}

// Lógica de cálculo matemático do fechamento financeiro lateral (com simulação de frete e desconto)
function atualizarResumoValores() {
    let totalItens = 0;
    let subtotalGeral = 0;

    cart.forEach(item => {
        totalItens += item.qty;
        subtotalGeral += (item.price * item.qty);
    });

    // Regras de negócio simuladas de e-commerce premium
    const frete = (subtotalGeral > 150 || subtotalGeral === 0) ? 0 : 15.00;
    const desconto = subtotalGeral > 100 ? subtotalGeral * 0.10 : 0; // 10% de desconto acima de R$100
    const valorTotalFinal = subtotalGeral + frete - desconto;

    // Atualização dos nós de texto obrigatórios solicitados no escopo original
    document.getElementById('txtQuantidadeCarrinho').innerText = `Total de produtos: ${totalItens}`;
    document.getElementById('txtTotalCarrinho').innerText = `Total: ${formatBRL(valorTotalFinal)}`;

    // Atualização dos novos nós de interface do resumo avançado lateral
    document.getElementById('txtSubtotalSimulado').innerText = formatBRL(subtotalGeral);
    document.getElementById('txtFreteSimulado').innerText = frete === 0 ? 'Grátis' : formatBRL(frete);
    document.getElementById('txtDescontoSimulado').innerText = `- ${formatBRL(desconto)}`;
}

// Função obrigatória: Executa a finalização limpando o estado após validação de segurança
function finalizarCompra() {
    if (cart.length === 0) {
        exibirMensagemFinalizacao("O carrinho está vazio. Adicione produtos.", "erro");
        return;
    }

    cart = [];
    salvarEstadoERenderizar();

    const campoFinalizacao = document.getElementById('finalizacao');
    if (campoFinalizacao) {
        campoFinalizacao.innerText = "Pedido realizado com sucesso! Obrigado por comprar na HippieStyle.";
        campoFinalizacao.className = "sucesso";
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Utilitário de persistência sincronizada no localStorage e atualização instantânea na UI
function salvarEstadoERenderizar() {
    localStorage.setItem('hippiestyle_cart', JSON.stringify(cart));
    renderizarCarrinho();
}

// Exibe notificações flutuantes temporárias no elemento #mensagem
function exibirMensagemFeedback(texto, classe) {
    const elementoMensagem = document.getElementById('mensagem');
    if (elementoMensagem) {
        elementoMensagem.innerText = texto;
        elementoMensagem.className = classe;
        setTimeout(() => {
            elementoMensagem.innerText = '';
            elementoMensagem.className = '';
        }, 3000);
    }
}

function exibirMensagemFinalizacao(texto, classe) {
    const campoFinalizacao = document.getElementById('finalizacao');
    if (campoFinalizacao) {
        campoFinalizacao.innerText = texto;
        campoFinalizacao.className = classe;
    }
}

// Inicializa a escuta do ciclo de carregamento estrutural do documento
document.addEventListener('DOMContentLoaded', () => {
    renderizarCarrinho();
});