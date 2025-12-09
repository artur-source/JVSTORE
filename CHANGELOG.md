# Changelog - JV STORE

## [Versão 2.0] - 2025-12-08

### Adicionado
- **Geração Automática de Placeholders**: Implementado script Python (`generate_placeholders.py`) que gera automaticamente imagens placeholder para todos os produtos.
- **Padrão Visual Consistente**: Placeholders com fundo preto, moldura branca fina, texto central em bold com nome do produto e marca "JV STORE".
- **Cores por Categoria**: Variações de cores de fundo conforme a categoria do produto:
  - Bonés: Azul escuro
  - Camisetas: Cinza
  - Calças: Preto profundo
  - Jaquetas: Roxo escuro
  - Acessórios: Verde escuro
- **Frase Chave no Rodapé**: Adicionada a frase "A Moda que Veste a Sua Atitude" abaixo da logo no rodapé.
- **QR Code Aumentado**: Tamanho do QR Code do Instagram aumentado de 100x100px para 150x150px.

### Removido
- **Exibição de Estoque**: Removida a seção de informações de estoque dos cards de produtos.
- **Imagens Genéricas**: Removida a mensagem "Para consultar as imagens, entre em contato" dos placeholders.

### Modificado
- **script.js**: 
  - Removida a lógica de exibição de estoque nos cards de produtos.
  - Atualizado para usar as imagens placeholder geradas automaticamente.
- **index.html**: 
  - Adicionada a frase chave da marca no rodapé.
  - Estrutura do footer atualizada para incluir a tagline.
- **style.css**: 
  - Aumentado o tamanho do QR Code de 100x100px para 150x150px.
  - Adicionados estilos para a frase chave (`.footer-tagline`).

### Detalhes Técnicos
- **172 Placeholders Gerados**: Um para cada produto no catálogo.
- **Formato**: JPEG com resolução 400x400px.
- **Nomeação**: `placeholder_{ref}.jpg` onde `{ref}` é a referência do produto.
- **Localização**: `assets/images/placeholder_*.jpg`

### Como Usar
1. Executar o script de geração: `python3 generate_placeholders.py`
2. Os placeholders serão automaticamente criados na pasta `assets/images/`
3. O site carregará os placeholders automaticamente via JavaScript.

### Benefícios
- Catálogo visual coerente e profissional
- Reconhecimento imediato de categorias pelos usuários
- Sem necessidade de fotos reais dos produtos
- Manutenção simplificada de imagens
- Carregamento mais rápido do site

---

**Autor**: Manus AI  
**Data**: 2025-12-08
