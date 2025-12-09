#!/usr/bin/env python3
"""
Script para gerar imagens placeholder para produtos da JV STORE.
Padrão: fundo preto, moldura branca fina, texto central com nome/categoria, fonte bold.
"""

from PIL import Image, ImageDraw, ImageFont
import json
import os
from pathlib import Path

# Configurações
PLACEHOLDER_WIDTH = 400
PLACEHOLDER_HEIGHT = 400
BORDER_WIDTH = 3
BACKGROUND_COLOR = (0, 0, 0)  # Preto
BORDER_COLOR = (255, 255, 255)  # Branco
TEXT_COLOR = (255, 255, 255)  # Branco
FONT_SIZE = 36

# Cores por categoria (variações opcionais)
CATEGORY_COLORS = {
    'bonés': (25, 35, 60),  # Azul escuro
    'camisetas': (50, 50, 50),  # Cinza
    'calças': (15, 15, 15),  # Preto mais profundo
    'jaquetas': (40, 30, 50),  # Roxo escuro
    'acessórios': (35, 45, 35),  # Verde escuro
}

def get_category_color(category):
    """Retorna a cor de fundo baseada na categoria."""
    category_lower = category.lower()
    return CATEGORY_COLORS.get(category_lower, BACKGROUND_COLOR)

def create_placeholder(product_name, category, output_path):
    """
    Cria uma imagem placeholder para um produto.
    
    Args:
        product_name: Nome do produto
        category: Categoria do produto
        output_path: Caminho para salvar a imagem
    """
    # Usa cor específica da categoria ou preto padrão
    bg_color = get_category_color(category)
    
    # Cria a imagem
    img = Image.new('RGB', (PLACEHOLDER_WIDTH, PLACEHOLDER_HEIGHT), bg_color)
    draw = ImageDraw.Draw(img)
    
    # Desenha a moldura branca
    draw.rectangle(
        [(BORDER_WIDTH, BORDER_WIDTH), 
         (PLACEHOLDER_WIDTH - BORDER_WIDTH, PLACEHOLDER_HEIGHT - BORDER_WIDTH)],
        outline=BORDER_COLOR,
        width=BORDER_WIDTH
    )
    
    # Tenta usar uma fonte bold, se não conseguir usa a padrão
    try:
        # Tenta encontrar uma fonte bold no sistema
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", FONT_SIZE)
    except (IOError, OSError):
        # Fallback para fonte padrão
        font = ImageFont.load_default()
    
    # Prepara o texto
    text = f"{product_name}\n– JV STORE"
    
    # Calcula o tamanho do texto para centralizá-lo
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    x = (PLACEHOLDER_WIDTH - text_width) // 2
    y = (PLACEHOLDER_HEIGHT - text_height) // 2
    
    # Desenha o texto
    draw.multiline_text((x, y), text, fill=TEXT_COLOR, font=font, align='center')
    
    # Salva a imagem
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    img.save(output_path)
    print(f"✓ Placeholder criado: {output_path}")

def main():
    """Função principal."""
    # Carrega os produtos
    with open('products.json', 'r', encoding='utf-8') as f:
        products = json.load(f)
    
    print(f"Gerando {len(products)} placeholders...")
    
    # Cria placeholders para cada produto
    for product in products:
        ref = product['ref']
        name = product['name']
        category = product['category']
        
        # Define o caminho de saída
        output_path = f"assets/images/placeholder_{ref}.jpg"
        
        # Cria o placeholder
        create_placeholder(name, category, output_path)
    
    print(f"\n✓ Todos os {len(products)} placeholders foram gerados com sucesso!")

if __name__ == '__main__':
    main()
