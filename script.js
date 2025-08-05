const produtos = [
  {
    nome: "Cupim Bovino",
    descricao: "Recheado com alho, bacon e calabresa",
    preco: 59.9,
    imagem: "./assets/cupim-bovino.png"
  },
  {
    nome: "Lagarto Bovino Angus",
    descricao: "Com calabresa, cenoura e vagem",
    preco: 59.9,
    imagem: "./assets/lagarto-angus.jpg"
  },
  {
    nome: "Filézinho Suíno",
    descricao: "Farofa cremosa agridoce",
    preco: 42.9,
    imagem: "./assets/filezinho-suino.png"
  },
  {
    nome: "Copa Suína",
    descricao: "Com calabresa, bacon, cenoura e vagem",
    preco: 37.9,
    imagem: "./assets/copa-suina.jpg"
  },
  {
    nome: "Frango do Léo",
    descricao: "Purê de batata, calabresa e bacon",
    preco: 39.9,
    imagem: "./assets/frango.png"
  },
  {
    nome: "Costela Bovina",
    descricao: "Com farofa, cream cheese e calabresa",
    preco: 79.9,
    imagem: "./assets/costela-bovina.jpeg"
  },
  {
    nome: "Panceta Suína",
    descricao: "Farofa, alho, cream cheese",
    preco: 46.9,
    imagem: "./assets/panceta.jpg"
  },
  {
    nome: "Peito de Frango",
    descricao: "Recheado com linguiça e cream cheese",
    preco: 49.9,
    imagem: "./assets/peito-de-frango.jpg"
  },
  {
    nome: "Kit Burguer",
    descricao: "4 pães brioche, 4 carnes, 8 queijos, 100g bacon",
    preco: 65.0,
    imagem: "./assets/kit-hamburguer.jpeg"
  }
];

let carrinho = [];

function adicionarAoCarrinho(index) {
  const produto = produtos[index];
  const itemExistente = carrinho.find(item => item.nome === produto.nome);
  
  if (itemExistente) {
    itemExistente.quantidade++;
    itemExistente.precoTotal = itemExistente.preco * itemExistente.quantidade;
  } else {
    carrinho.push({
      ...produto,
      quantidade: 1,
      precoTotal: produto.preco
    });
  }
  
  atualizarCarrinho();
  
  // Feedback visual
  const button = document.querySelectorAll('.produto button')[index];
  button.textContent = '✔ Adicionado';
  button.style.backgroundColor = 'var(--tertiary)';
  
  setTimeout(() => {
    button.textContent = 'Adicionar';
    button.style.backgroundColor = '';
  }, 1000);
}

function removerDoCarrinho(index) {
  if (carrinho[index].quantidade > 1) {
    carrinho[index].quantidade--;
    carrinho[index].precoTotal = carrinho[index].preco * carrinho[index].quantidade;
  } else {
    carrinho.splice(index, 1);
  }
  atualizarCarrinho();
}

function adicionarMaisUm(index) {
  carrinho[index].quantidade++;
  carrinho[index].precoTotal = carrinho[index].preco * carrinho[index].quantidade;
  atualizarCarrinho();
}

function removerItem(index) {
  carrinho.splice(index, 1);
  atualizarCarrinho();
}

function atualizarCarrinho() {
  const lista = document.getElementById("carrinho-itens");
  const total = document.getElementById("total");
  const cartCount = document.getElementById("cartCount");
  
  lista.innerHTML = "";
  let soma = 0;
  
  carrinho.forEach((item, index) => {
    soma += item.precoTotal;
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="item-nome">${item.nome}</span>
      <div class="item-controls">
        <div class="quantity-control">
          <button onclick="removerDoCarrinho(${index})">-</button>
          <span>${item.quantidade}</span>
          <button onclick="adicionarMaisUm(${index})">+</button>
        </div>
        <span class="item-preco">R$ ${item.precoTotal.toFixed(2)}</span>
        <button class="remove-btn" onclick="removerItem(${index})">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
    lista.appendChild(li);
  });
  
  total.textContent = soma.toFixed(2);
  cartCount.textContent = carrinho.reduce((total, item) => total + item.quantidade, 0);
}

function toggleCart() {
  const cartSidebar = document.getElementById("cartSidebar");
  const cartOverlay = document.getElementById("cartOverlay");
  
  cartSidebar.classList.toggle("open");
  cartOverlay.classList.toggle("active");
  
  // Bloquear scroll do body quando o carrinho estiver aberto
  document.body.style.overflow = cartSidebar.classList.contains("open") ? "hidden" : "";
}

function enviarPedido() {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio. Adicione produtos antes de enviar.");
    return;
  }

  const tipoEntrega = document.getElementById("entrega-retirada").value;
  const pagamento = document.getElementById("forma-pagamento").value;
  
  let texto = "*PEDIDO - LINGUIÇA ARTESANAL DO LÉO*%0A%0A";
  texto += "*Itens do pedido:*%0A";

  carrinho.forEach(item => {
    texto += `➤ ${item.nome} (${item.quantidade}x) - R$ ${item.precoTotal.toFixed(2)}%0A`;
  });

  texto += `%0A*Total:* R$ ${document.getElementById("total").textContent}`;
  texto += `%0A*${tipoEntrega === 'retirada' ? 'Retirada' : 'Entrega'}*`;
  
  if (tipoEntrega === "entrega") {
    const rua = document.getElementById("rua").value;
    const numero = document.getElementById("numero").value;
    const bairro = document.getElementById("bairro").value;
    const complemento = document.getElementById("complemento").value;
    
    if (!rua || !numero || !bairro) {
      alert("Por favor, preencha todos os campos obrigatórios do endereço para entrega.");
      return;
    }
    
    texto += `%0A*Endereço:* ${rua}, ${numero} - ${bairro}`;
    if (complemento) texto += ` (${complemento})`;
  }
  
  texto += `%0A*Pagamento:* ${pagamento}`;
  texto += "%0A%0AObrigado pelo seu pedido!";

  const numero = "SEU_NUMERO_AQUI";
  window.open(`https://wa.me/${18996193899}?text=${texto}`, "_blank");
  
  // Limpar carrinho após envio
  carrinho = [];
  atualizarCarrinho();
  
  // Fechar o carrinho
  toggleCart();
  
  // Resetar campos de endereço
  if (tipoEntrega === "entrega") {
    document.getElementById("rua").value = "";
    document.getElementById("numero").value = "";
    document.getElementById("bairro").value = "";
    document.getElementById("complemento").value = "";
  }
}

// Renderizar produtos na tela
window.onload = () => {
  const container = document.getElementById("produtos");
  produtos.forEach((item, i) => {
    const produtoDiv = document.createElement("div");
    produtoDiv.className = "produto";
    produtoDiv.innerHTML = `
      <img src="${item.imagem}" alt="${item.nome}">
      <h3>${item.nome}</h3>
      <p>${item.descricao}</p>
      <p><strong>R$ ${item.preco.toFixed(2)}</strong></p>
      <button onclick="adicionarAoCarrinho(${i})">Adicionar</button>
    `;
    container.appendChild(produtoDiv);
  });

  // Event listeners para o carrinho
  document.getElementById("cartIcon").addEventListener("click", toggleCart);
  document.getElementById("cartOverlay").addEventListener("click", toggleCart);
  document.getElementById("closeCart").addEventListener("click", toggleCart);

  // Mostrar/ocultar campo de endereço
  document.getElementById("entrega-retirada").addEventListener("change", function() {
    const enderecoGroup = document.getElementById("enderecoGroup");
    if (this.value === "entrega") {
      enderecoGroup.style.display = "grid";
    } else {
      enderecoGroup.style.display = "none";
    }
  });

  // Fechar carrinho com ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.getElementById("cartSidebar").classList.contains("open")) {
      toggleCart();
    }
  });
  // Suavizar rolagem para a seção de contato
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});
};