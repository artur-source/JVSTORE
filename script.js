document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('product-grid');
    const searchInput = document.getElementById('search-input');
    const searchToggle = document.getElementById('search-toggle');
    const searchBar = document.getElementById('search-bar');
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const categoryFiltersContainer = document.getElementById('category-filters');
    const clearFiltersButton = document.getElementById('clear-filters');
    const desktopMenu = document.getElementById('category-menu');
    const mobileCategoryMenu = document.getElementById('mobile-category-menu');
    const noResultsMessage = document.getElementById('no-results');

    let allProducts = [];
    let activeFilter = 'all';

    // --- 1. Carregamento de products.json ---
    async function loadProducts() {
        try {
            const response = await fetch('products.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allProducts = await response.json();
            
            // Adiciona uma propriedade 'category_slug' para facilitar a filtragem
            allProducts = allProducts.map(p => ({
                ...p,
                category_slug: p.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')
            }));

            renderCategories();
            filterAndRenderProducts();
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            productGrid.innerHTML = '<p>Não foi possível carregar o catálogo de produtos.</p>';
        }
    }

    // --- 2. Renderização de Categorias e Menus ---
    function renderCategories() {
        const categories = [...new Set(allProducts.map(p => p.category))].sort();
        
        // Adiciona a categoria "Todos"
        categories.unshift("Todos");

        // Limpa menus
        desktopMenu.innerHTML = '';
        mobileCategoryMenu.innerHTML = '';
        categoryFiltersContainer.innerHTML = '';

        categories.forEach(category => {
            const slug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            
            // Menu Desktop
            const desktopItem = document.createElement('li');
            desktopItem.innerHTML = `<a href="#catalog" data-filter="${slug}">${category}</a>`;
            desktopMenu.appendChild(desktopItem);

            // Menu Mobile
            const mobileItem = document.createElement('li');
            mobileItem.innerHTML = `<a href="#catalog" data-filter="${slug}">${category}</a>`;
            mobileCategoryMenu.appendChild(mobileItem);

            // Botões de Filtro
            const filterButton = document.createElement('button');
            filterButton.className = 'filter-button';
            filterButton.textContent = category;
            filterButton.dataset.filter = slug;
            categoryFiltersContainer.appendChild(filterButton);
        });

        // Adiciona listeners aos botões de filtro e links de menu
        document.querySelectorAll('[data-filter]').forEach(element => {
            element.addEventListener('click', (e) => {
                e.preventDefault();
                const filter = e.target.dataset.filter;
                setActiveFilter(filter);
                filterAndRenderProducts();
                // Fecha o menu mobile após clicar no link
                if (mobileMenu.classList.contains('open')) {
                    mobileMenu.classList.remove('open');
                }
                // Scroll suave para o catálogo
                document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    function setActiveFilter(filter) {
        activeFilter = filter;
        document.querySelectorAll('.filter-button').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            }
        });
    }

    // --- 3. Renderização de Produtos ---
    function renderProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.dataset.ref = product.ref;
        card.dataset.name = product.name.toLowerCase();
        card.dataset.category = product.category_slug;

        // Formatação de preço
        const formattedPrice = product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        // Informação de estoque
        let stockHtml = '';
        let totalStock = product.total_stock;
        let stockClass = totalStock <= 2 && totalStock > 0 ? 'stock-low' : '';
        let stockText = totalStock === 0 ? 'Esgotado' : `Estoque: ${totalStock}`;

        if (totalStock > 0) {
            stockHtml = `<p class="product-stock ${stockClass}">
                ${stockText}
                ${product.stock_info.map(s => s.size !== 'Único' ? `(${s.size}: ${s.stock})` : '').join(' ')}
            </p>`;
        } else {
            stockHtml = `<p class="product-stock stock-low">Esgotado</p>`;
        }

        // Link WhatsApp com mensagem pré-formatada
        const whatsappMessage = encodeURIComponent(`Olá, tenho interesse no produto ${product.name} - Ref: ${product.ref}.`);
        const whatsappLink = `https://wa.me/5511958855631?text=${whatsappMessage}`;

        card.innerHTML = `
            <div class="product-image-container">
                <div class="product-image-placeholder">
                    <p class="contact-message">Para consultar as imagens, entre em contato</p>
                </div>
            </div>
            <div class="product-details">
                <h3>${product.name}</h3>
                <p class="product-ref">Ref: ${product.ref}</p>
                ${stockHtml}
                <p class="product-price">${formattedPrice}</p>
                <a href="${whatsappLink}" target="_blank" class="btn btn-whatsapp" ${totalStock === 0 ? 'disabled' : ''}>
                    <i class="fab fa-whatsapp"></i> ${totalStock === 0 ? 'Esgotado' : 'Comprar via WhatsApp'}
                </a>
            </div>
        `;

        return card;
    }

    // --- 4. Busca e Filtros Client-Side ---
    function filterAndRenderProducts() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        const filteredProducts = allProducts.filter(product => {
            // Filtro por categoria
            const categoryMatch = activeFilter === 'todos' || product.category_slug === activeFilter;

            // Busca em tempo real (nome/ref) - case-insensitive
            const searchMatch = searchTerm === '' || product.name.toLowerCase().includes(searchTerm) || product.ref.toLowerCase().includes(searchTerm);

            return categoryMatch && searchMatch;
        });

        productGrid.innerHTML = '';
        if (filteredProducts.length === 0) {
            noResultsMessage.style.display = 'block';
        } else {
            noResultsMessage.style.display = 'none';
            filteredProducts.forEach(product => {
                productGrid.appendChild(renderProductCard(product));
            });
        }
        
        // Scroll suave para o catálogo quando há busca
        if (searchTerm !== '') {
            document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
        }
    }

    // --- 5. Event Listeners ---

    // Toggle Menu Hambúrguer
    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
        // Fecha a barra de busca se o menu for aberto
        if (mobileMenu.classList.contains('open') && searchBar.classList.contains('open')) {
            searchBar.classList.remove('open');
        }
    });

    // Toggle Barra de Busca
    searchToggle.addEventListener('click', () => {
        searchBar.classList.toggle('open');
        // Fecha o menu mobile se a barra de busca for aberta
        if (searchBar.classList.contains('open') && mobileMenu.classList.contains('open')) {
            mobileMenu.classList.remove('open');
        }
        if (searchBar.classList.contains('open')) {
            searchInput.focus();
        }
    });

    // Busca em tempo real
    searchInput.addEventListener('input', filterAndRenderProducts);

    // Limpar Filtros
    clearFiltersButton.addEventListener('click', () => {
        searchInput.value = '';
        setActiveFilter('todos');
        filterAndRenderProducts();
    });

    // Inicialização
    loadProducts();
    setActiveFilter('todos'); // Define o filtro inicial como "Todos"
});
