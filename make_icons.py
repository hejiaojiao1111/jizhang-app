# -*- coding: utf-8 -*-
"""生成记账本 App 图标：深色圆角底 + 白色 ¥ 符号"""
from PIL import Image, ImageDraw, ImageFont

BG = (38, 34, 31, 255)      # #26221F 与 App 主按钮同色
FG = (255, 255, 255, 255)

FONT_CANDIDATES = [
    'C:/Windows/Fonts/msyh.ttc',
    'C:/Windows/Fonts/segoeui.ttf',
    'C:/Windows/Fonts/arial.ttf',
    'C:/Windows/Fonts/arialbd.ttf',
]

def load_font(px):
    for fp in FONT_CANDIDATES:
        try:
            return ImageFont.truetype(fp, px)
        except Exception:
            continue
    return ImageFont.load_default()

def make_icon(size, path):
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    radius = int(size * 0.23)
    d.rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=BG)
    font = load_font(int(size * 0.5))
    text = '\u00a5'  # ¥
    bbox = d.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    x = (size - tw) / 2 - bbox[0]
    y = (size - th) / 2 - bbox[1]
    d.text((x, y), text, font=font, fill=FG)
    img.save(path, 'PNG')
    print('written', path, img.size)

base = 'C:/Users/keyie/WorkBuddy/2026-10-17-13-22-17/jizhang-app'
make_icon(192, base + '/icon-192.png')
make_icon(512, base + '/icon-512.png')
make_icon(180, base + '/apple-touch-icon.png')
