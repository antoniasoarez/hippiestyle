// Array global (para esta página) que armazenará os produtos cadastrados.
let listaProdutos = [];

/**
 * Exibe mensagens de feedback (Sucesso ou Erro)
 */
function mostrarMensagem(texto, tipo) {
    const divMsg = document.getElementById('mensagem');
    divMsg.textContent = texto;
    divMsg.className = `msg ${tipo}`;
    
    // Remove a mensagem após 2.5 segundos para não poluir a tela
    setTimeout(() => {
        divMsg.style.display = 'none';
    }, 2500);
}

/**
 * Atualiza a contagem total de produtos exibida na tela.
 */
function atualizarQuantidade() {
    document.getElementById('txtQuantidade').innerText = `Total de produtos: ${listaProdutos.length}`;
}

/**
 * Renderiza o array no HTML, recriando as tags <li>
 */
function listarProdutos() {
    const ul = document.getElementById('ulProdutos');
    ul.innerHTML = ''; // Limpa a lista antes de desenhar de novo

    // Percorre o array e cria um <li> para cada item
    for (let i = 0; i < listaProdutos.length; i++) {
        const li = document.createElement('li');
        li.textContent = listaProdutos[i];
        ul.appendChild(li);
    }
    
    // Sempre que listamos, atualizamos a quantidade total
    atualizarQuantidade();
}

/**
 * Valida o campo vazio usando trim() e adiciona ao array.
 */
function cadastrarProduto() {
    const input = document.getElementById('iptProduto');
    const nomeProduto = input.value.trim();

    if (nomeProduto === '') {
        mostrarMensagem('Campo vazio.', 'error');
        return;
    }

    // Adiciona o produto ao final do array
    listaProdutos.push(nomeProduto);
    
    // Limpa o input
    input.value = '';
    
    mostrarMensagem('Produto cadastrado.', 'success');
    
    // Atualiza a visualização
    listarProdutos();
}

/**
 * Remove o último produto do array.
 */
function removerProduto() {
    if (listaProdutos.length === 0) {
        mostrarMensagem('Nenhum produto para remover.', 'error');
        return;
    }

    // Método pop() remove e retorna o último elemento de um array
    listaProdutos.pop();
    
    mostrarMensagem('Produto removido.', 'success');
    listarProdutos();
}

/**
 * Organiza os produtos em ordem alfabética.
 */
function ordenarProdutos() {
    if (listaProdutos.length === 0) {
        mostrarMensagem('Nenhum produto para organizar.', 'error');
        return;
    }

    // sort() misturado com localeCompare ajusta acentuação corretamente
    listaProdutos.sort((a, b) => a.localeCompare(b));
    
    mostrarMensagem('Lista organizada.', 'success');
    listarProdutos();
}