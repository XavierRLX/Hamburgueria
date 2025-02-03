async function carregaCategoriaCardapio() {
    try {
        const response = await fetch('/api/categorias'); // Agora chama o backend

        if (!response.ok) {
            throw new Error('Erro ao carregar categorias.');
        }

        const data = await response.json();
        const categoriaList = document.querySelector('.catItensCard');
        categoriaList.innerHTML = ''; // Limpa a lista de categorias

        data.forEach(categoria => {
            const categoriaItem = document.createElement('div');
            categoriaItem.innerHTML = `<p id="listaItensCat" class="opc-item">${categoria.nome}</p>`;
            categoriaItem.addEventListener('click', () => {
                carregaProdutosCardapio(categoria.pkCategoria); // Ajustado para usar pkCategoria
            });
            categoriaList.appendChild(categoriaItem);
        });
    } catch (error) {
        console.error(error);
        alert('Erro ao carregar a lista de categorias.');
    }
}

document.addEventListener('DOMContentLoaded', carregaCategoriaCardapio);
