/* =====================================================
   CATÁLOGO DE PRODUTOS — Script principal
   Paleta: preto + verde claro | Finalização via WhatsApp
   ===================================================== */

/* ===== CONFIGURAÇÃO ===== */
// 👉 TROQUE AQUI pelo número real da empresa (DDI + DDD + número, sem espaços)
const NUMERO_WHATSAPP = "55 81 9718-8123";

// 👉 Nome da loja (aparece na mensagem do WhatsApp)
const NOME_LOJA = "Minha Produtora";

/* ===== PRODUTOS DE EXEMPLO ===== */
const PRODUTOS = [
  {
    id: 1,
    nome: "Arroz Tipo 1",
    categoria: "Grãos",
    preco: 28.90,
    icone: "fa-bowl-rice",
    descricao: "Arroz tipo 1, pacote de 5kg. Ideal para o dia a dia, soltinho e de alta qualidade."
  },
  {
    id: 2,
    nome: "Feijão Carioca",
    categoria: "Grãos",
    preco: 7.50,
    icone: "fa-seedling",
    descricao: "Feijão carioca selecionado, pacote de 1kg. Cozimento rápido e saboroso."
  },
  {
    id: 3,
    nome: "Farinha de Trigo",
    categoria: "Grãos",
    preco: 22.00,
    icone: "fa-wheat-awn",
    descricao: "Farinha de trigo especial para pães e massas, pacote de 5kg."
  },
  {
    id: 4,
    nome: "Café Torrado e Moído",
    categoria: "Bebidas",
    preco: 18.90,
    icone: "fa-mug-hot",
    descricao: "Café torrado e moído, pacote de 500g. Aroma e sabor intensos."
  },
  {
    id: 5,
    nome: "Água Mineral",
    categoria: "Bebidas",
    preco: 6.50,
    icone: "fa-bottle-water",
    descricao: "Água mineral sem gás, garrafa de 1,5 litros."
  },
  {
    id: 6,
    nome: "Óleo de Soja",
    categoria: "Mercearia",
    preco: 7.90,
    icone: "fa-bottle-droplet",
    descricao: "Óleo de soja refinado, garrafa de 900ml."
  },
  {
    id: 7,
    nome: "Açúcar Cristal",
    categoria: "Mercearia",
    preco: 19.50,
    icone: "fa-cubes",
    descricao: "Açúcar cristal, saco de 5kg. Ideal para o comércio."
  },
  {
    id: 8,
    nome: "Molho de Tomate",
    categoria: "Mercearia",
    preco: 3.90,
    icone: "fa-jar",
    descricao: "Molho de tomate tradicional, pote de 340g."
  },
  {
    id: 9,
    nome: "Milho Verde",
    categoria: "Enlatados",
    preco: 4.20,
    icone: "fa-can-food",
    descricao: "Milho verde em conserva, lata de 200g."
  },
  {
    id: 10,
    nome: "Sardinha em Óleo",
    categoria: "Enlatados",
    preco: 6.80,
    icone: "fa-fish-fins",
    descricao: "Sardinha em óleo comestível, lata de 125g."
  },
  {
    id: 11,
    nome: "Macarrão Espaguete",
    categoria: "Padaria e Massas",
    preco: 4.90,
    icone: "fa-utensils",
    descricao: "Espaguete de sêmola, pacote de 500g."
  },
  {
    id: 12,
    nome: "Ovos Brancos",
    categoria: "Padaria e Massas",
    preco: 12.00,
    icone: "fa-egg",
    descricao: "Ovos brancos tamanho grande, cartela com 12 unidades."
  }
];

/* ===== ESTADO DO CARRINHO ===== */
let carrinho = [];

/* ===== ELEMENTOS DA PÁGINA ===== */
const gradeProdutos = document.getElementById("gradeProdutos");
const filtros = document.getElementById("filtros");
const modalProduto = document.getElementById("modalProduto");
const painelCarrinho = document.getElementById("painelCarrinho");
const overlay = document.getElementById("overlay");
const toast = document.getElementById("toast");
const badgeCarrinho = document.getElementById("badgeCarrinho");
const totalCarrinho = document.getElementById("totalCarrinho");
const itensCarrinho = document.getElementById("itensCarrinho");

let produtoSelecionado = null; // produto aberto no modal

/* ===== FUNÇÕES AUXILIARES ===== */
function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function salvarCarrinho() {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function carregarCarrinho() {
  const salvo = localStorage.getItem("carrinho");
  if (salvo) {
    try {
      carrinho = JSON.parse(salvo);
    } catch (e) {
      carrinho = [];
    }
  }
}

function mostrarToast(mensagem) {
  toast.textContent = mensagem;
  toast.classList.add("toast--visivel");
  setTimeout(() => toast.classList.remove("toast--visivel"), 2200);
}

/* ===== RENDERIZAR CATEGORIAS ===== */
function renderizarCategorias() {
  const categorias = ["Todos", ...new Set(PRODUTOS.map(p => p.categoria))];

  filtros.innerHTML = categorias
    .map((cat, i) =>
      `<button class="categoria-btn${i === 0 ? " categoria-btn--ativo" : ""}"
               data-categoria="${cat}">${cat}</button>`
    )
    .join("");

  filtros.querySelectorAll(".categoria-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      filtros.querySelectorAll(".categoria-btn").forEach(b =>
        b.classList.remove("categoria-btn--ativo")
      );
      btn.classList.add("categoria-btn--ativo");
      renderizarProdutos(btn.dataset.categoria);
    });
  });
}

/* ===== RENDERIZAR PRODUTOS ===== */
function renderizarProdutos(categoria = "Todos") {
  const lista = categoria === "Todos"
    ? PRODUTOS
    : PRODUTOS.filter(p => p.categoria === categoria);

  gradeProdutos.innerHTML = lista
    .map(p => `
      <div class="produto" data-id="${p.id}">
        <div class="produto__imagem"><i class="fa-solid ${p.icone}"></i></div>
        <div class="produto__info">
          <span class="produto__categoria">${p.categoria}</span>
          <h3 class="produto__nome">${p.nome}</h3>
          <p class="produto__preco">${formatarPreco(p.preco)}</p>
        </div>
      </div>
    `)
    .join("");

  gradeProdutos.querySelectorAll(".produto").forEach(card => {
    card.addEventListener("click", () => abrirModal(Number(card.dataset.id)));
  });
}

/* ===== MODAL DE DETALHE ===== */
function abrirModal(id) {
  const p = PRODUTOS.find(prod => prod.id === id);
  if (!p) return;

  produtoSelecionado = p;
  document.getElementById("modalImagem").innerHTML =
    `<i class="fa-solid ${p.icone}"></i>`;
  document.getElementById("modalCategoria").textContent = p.categoria;
  document.getElementById("modalNome").textContent = p.nome;
  document.getElementById("modalDescricao").textContent = p.descricao;
  document.getElementById("modalPreco").textContent = formatarPreco(p.preco);

  modalProduto.classList.add("modal--aberto");
  overlay.classList.add("overlay--visivel");
}

function fecharModal() {
  modalProduto.classList.remove("modal--aberto");
  if (!painelCarrinho.classList.contains("carrinho--aberto")) {
    overlay.classList.remove("overlay--visivel");
  }
  produtoSelecionado = null;
}

document.getElementById("fecharModal").addEventListener("click", fecharModal);

document.getElementById("btnAdicionar").addEventListener("click", () => {
  if (produtoSelecionado) {
    adicionarAoCarrinho(produtoSelecionado.id);
    fecharModal();
    mostrarToast("Produto adicionado ao carrinho!");
  }
});

/* ===== CARRINHO ===== */
function adicionarAoCarrinho(id) {
  const item = carrinho.find(i => i.id === id);
  if (item) {
    item.quantidade += 1;
  } else {
    carrinho.push({ id: id, quantidade: 1 });
  }
  salvarCarrinho();
  atualizarBadge();
  renderizarCarrinho();
}

function alterarQuantidade(id, delta) {
  const item = carrinho.find(i => i.id === id);
  if (!item) return;

  item.quantidade += delta;
  if (item.quantidade <= 0) {
    carrinho = carrinho.filter(i => i.id !== id);
  }
  salvarCarrinho();
  atualizarBadge();
  renderizarCarrinho();
}

function removerDoCarrinho(id) {
  carrinho = carrinho.filter(i => i.id !== id);
  salvarCarrinho();
  atualizarBadge();
  renderizarCarrinho();
}

function calcularTotal() {
  return carrinho.reduce((soma, item) => {
    const p = PRODUTOS.find(prod => prod.id === item.id);
    return soma + (p ? p.preco * item.quantidade : 0);
  }, 0);
}

function renderizarCarrinho() {
  if (carrinho.length === 0) {
    itensCarrinho.innerHTML =
      '<p style="color: var(--cinza); text-align: center;">Seu carrinho está vazio.</p>';
    totalCarrinho.textContent = formatarPreco(0);
    return;
  }

  itensCarrinho.innerHTML = carrinho
    .map(item => {
      const p = PRODUTOS.find(prod => prod.id === item.id);
      if (!p) return "";
      return `
        <div class="carrinho-item">
          <div class="carrinho-item__imagem"><i class="fa-solid ${p.icone}"></i></div>
          <div class="carrinho-item__info">
            <p class="carrinho-item__nome">${p.nome}</p>
            <p class="carrinho-item__preco">${formatarPreco(p.preco)}</p>
            <div class="carrinho-item__qtd">
              <button class="qtd-btn" data-acao="menos" data-id="${p.id}">-</button>
              <span class="qtd-valor">${item.quantidade}</span>
              <button class="qtd-btn" data-acao="mais" data-id="${p.id}">+</button>
            </div>
          </div>
          <button class="carrinho-item__remover" data-acao="remover" data-id="${p.id}">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      `;
    })
    .join("");

  totalCarrinho.textContent = formatarPreco(calcularTotal());

  itensCarrinho.querySelectorAll("[data-acao]").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const acao = btn.dataset.acao;
      const id = Number(btn.dataset.id);
      if (acao === "mais") alterarQuantidade(id, 1);
      if (acao === "menos") alterarQuantidade(id, -1);
      if (acao === "remover") removerDoCarrinho(id);
    });
  });
}

function atualizarBadge() {
  const totalItens = carrinho.reduce((soma, i) => soma + i.quantidade, 0);
  badgeCarrinho.textContent = totalItens;
}

/* ===== ABRIR / FECHAR CARRINHO ===== */
function abrirCarrinho() {
  renderizarCarrinho();
  painelCarrinho.classList.add("carrinho--aberto");
  overlay.classList.add("overlay--visivel");
}

function fecharCarrinho() {
  painelCarrinho.classList.remove("carrinho--aberto");
  if (!modalProduto.classList.contains("modal--aberto")) {
    overlay.classList.remove("overlay--visivel");
  }
}

document.getElementById("btnCarrinho").addEventListener("click", abrirCarrinho);
document.getElementById("fecharCarrinho").addEventListener("click", fecharCarrinho);

overlay.addEventListener("click", () => {
  fecharCarrinho();
  fecharModal();
});

/* ===== FINALIZAR COMPRA PELO WHATSAPP ===== */
document.getElementById("btnFinalizar").addEventListener("click", () => {
  if (carrinho.length === 0) {
    mostrarToast("Seu carrinho está vazio!");
    return;
  }

  const linhas = carrinho
    .map(item => {
      const p = PRODUTOS.find(prod => prod.id === item.id);
      const subtotal = p ? p.preco * item.quantidade : 0;
      return `• ${p.nome} - ${item.quantidade}x - ${formatarPreco(subtotal)}`;
    })
    .join("\n");

  const total = formatarPreco(calcularTotal());

  const mensagem =
    `Olá! Gostaria de finalizar minha compra na ${NOME_LOJA} com os seguintes itens:\n\n` +
    `${linhas}\n\n` +
    `Total: ${total}\n\n` +
    `Pode prosseguir com a compra?`;

  const url = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, "_blank");
});

/* ===== INICIALIZAÇÃO ===== */
carregarCarrinho();
renderizarCategorias();
renderizarProdutos();
atualizarBadge();
renderizarCarrinho();