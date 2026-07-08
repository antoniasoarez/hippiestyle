



// Este arquivo controla o carrinho de compras da página Produtos.
// Como o projeto é simples, o carrinho é apenas um array guardado
// na memória enquanto a página estiver aberta (se atualizar a página, ele zera).

// Array que guarda os produtos adicionados ao carrinho
var carrinho = [];

// Função que mostra as mensagens de feedback (sucesso ou erro) na tela
function mostrarMensagem(texto, tipo) {
  var mensagem = document.getElementById("mensagem");

  mensagem.innerText = texto;

  // Troca a classe do elemento para pintar a mensagem de azul (sucesso) ou vermelho (erro)
  mensagem.className = tipo;

  // Depois de 2.5 segundos a mensagem some sozinha, pra não ficar poluindo a tela
  setTimeout(function () {
    mensagem.innerText = "";
    mensagem.className = "";
  }, 2500);
}

// Função que atualiza o texto de quantos produtos tem no carrinho
function atualizarQuantidadeCarrinho() {
  var texto = document.getElementById("txtQuantidadeCarrinho");
  texto.innerText = "Total de produtos: " + carrinho.length;
}

// Função que soma o preço de todos os produtos do carrinho e mostra o total
function atualizarTotalCarrinho() {
  var soma = 0;

  // Percorre o array somando o preço de cada produto
  for (var i = 0; i < carrinho.length; i++) {
    soma = soma + carrinho[i].preco;
  }

  var texto = document.getElementById("txtTotalCarrinho");

  // toFixed(2) deixa sempre com duas casas decimais, e o replace troca o ponto por vírgula
  texto.innerText = "Total: R$ " + soma.toFixed(2).replace(".", ",");
}

// Função que redesenha a lista <ul> do carrinho na tela
function listarCarrinho() {
  var ul = document.getElementById("ulCarrinho");

  // Limpa a lista antes de desenhar de novo, pra não duplicar os itens
  ul.innerHTML = "";

  // Cria um <li> para cada produto que está no array carrinho
  for (var i = 0; i < carrinho.length; i++) {
    var li = document.createElement("li");

    // Monta o texto do item juntando nome e preço formatado
    li.innerText = carrinho[i].nome + " - R$ " + carrinho[i].preco.toFixed(2).replace(".", ",");

    ul.appendChild(li);
  }

  // Toda vez que a lista é redesenhada, atualiza a quantidade e o total também
  atualizarQuantidadeCarrinho();
  atualizarTotalCarrinho();
}

// Função chamada quando a pessoa clica no botão "ver produto" de um card
// Ela recebe o nome e o preço do produto clicado
function verProduto(nome, preco) {

  // Cria um objeto simples para representar o produto
  var produto = {
    nome: nome,
    preco: preco
  };

  // Adiciona o produto dentro do array do carrinho
  carrinho.push(produto);

  mostrarMensagem(nome + " foi adicionado ao carrinho!", "sucesso");

  // Atualiza a lista mostrada na tela
  listarCarrinho();
}

// Função que remove o último produto adicionado no carrinho
function removerUltimoProduto() {
  if (carrinho.length === 0) {
    mostrarMensagem("O carrinho já está vazio.", "erro");
    return;
  }

  // Método pop() remove e retorna o último elemento de um array
  var produtoRemovido = carrinho.pop();

  mostrarMensagem(produtoRemovido.nome + " foi removido do carrinho.", "sucesso");

  listarCarrinho();
}

// Função que esvazia o carrinho inteiro
function limparCarrinho() {
  if (carrinho.length === 0) {
    mostrarMensagem("O carrinho já está vazio.", "erro");
    return;
  }

  // Zera o array, tirando todos os produtos de uma vez
  carrinho = [];

  mostrarMensagem("Carrinho esvaziado.", "sucesso");

  listarCarrinho();
}

// Função que organiza os produtos do carrinho em ordem alfabética pelo nome
function ordenarCarrinho() {
  if (carrinho.length === 0) {
    mostrarMensagem("Nenhum produto para organizar.", "erro");
    return;
  }

  // sort() com localeCompare organiza o texto respeitando acentuação
  carrinho.sort(function (produtoA, produtoB) {
    return produtoA.nome.localeCompare(produtoB.nome);
  });

  mostrarMensagem("Carrinho organizado.", "sucesso");

  listarCarrinho();
}