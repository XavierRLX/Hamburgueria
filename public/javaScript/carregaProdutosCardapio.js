async function carregaProdutosCardapio() {

  const url = `${supabaseUrl}/rest/v1/produtos?select=*`;
  const response = await fetch(url, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'apikey': apiKey,
          'Authorization': `Bearer ${apiKey}`
      },
  });

  if (response.ok) {
      const data = await response.json();
      const produtoList = document.querySelector('.produtosCaradapio'); // Seleciona a div com classe 'row'
      produtoList.innerHTML = ''; // Limpa a lista de produtos

      data.forEach(produto => {
          const produtoItem = document.createElement('div');
          produtoItem.innerHTML = `
          <article class="card card-width p-0 m-5 ">
          <img
            src="https://static-images.ifood.com.br/image/upload/t_medium/pratos/93b7ffd6-fdaf-4c18-8d9e-7b06e12178cd/202103010403_jbFL_.jpeg"
            class="card-img-top img-card" alt="...">
          <div class="card-body">
            <h5 class="nomeProduto card-title">${produto.nome}</h5>
            <p class="descProduto card-text">${produto.descricao}</p>
            <div class="flex">
              <p>R$:</p>
              <div><input value="${produto.preco}" class="preçoProduto" readonly></div>
            </div>
            <a data-bs-toggle="modal" id="comprarProduto1" href="#exampleModalToggle" href="#"
              class="botaoComprar btn">Comprar</a>
          </div>
        </article>`
        produtoList.appendChild(produtoItem);
      });
  } else {
      alert('Erro ao carregar a lista de categoria');
  }
}

document.addEventListener('DOMContentLoaded', carregaProdutosCardapio);
