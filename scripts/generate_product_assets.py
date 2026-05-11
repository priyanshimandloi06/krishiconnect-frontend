from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

assets = Path(__file__).resolve().parent.parent / 'src' / 'assets'
assets.mkdir(parents=True, exist_ok=True)

names = {
    'produce-potato.jpg': ('Potato', (210, 180, 140)),
    'produce-cauliflower.jpg': ('Cauliflower', (245, 245, 220)),
    'produce-cabbage.jpg': ('Cabbage', (173, 255, 47)),
    'produce-bottle-gourd.jpg': ('Bottle Gourd', (144, 238, 144)),
    'produce-cucumber.jpg': ('Cucumber', (152, 251, 152)),
    'produce-banana.jpg': ('Banana', (255, 255, 102)),
    'produce-apple.jpg': ('Apple', (255, 99, 71)),
    'produce-orange.jpg': ('Orange', (255, 165, 0)),
    'produce-papaya.jpg': ('Papaya', (255, 204, 153)),
    'produce-guava.jpg': ('Guava', (204, 255, 153)),
    'produce-grapes.jpg': ('Grapes', (138, 43, 226)),
    'produce-pomegranate.jpg': ('Pomegranate', (220, 20, 60)),
    'produce-pineapple.jpg': ('Pineapple', (255, 215, 0)),
    'produce-maize.jpg': ('Maize', (255, 255, 153)),
    'produce-barley.jpg': ('Barley', (222, 184, 135)),
    'produce-jowar.jpg': ('Jowar', (205, 133, 63)),
    'produce-bajra.jpg': ('Bajra', (189, 183, 107)),
    'produce-ragi.jpg': ('Ragi', (139, 69, 19)),
    'produce-oats.jpg': ('Oats', (238, 232, 170)),
}

try:
    font = ImageFont.truetype('arial.ttf', 30)
except Exception:
    font = ImageFont.load_default()

for file_name, (label, color) in names.items():
    path = assets / file_name
    if path.exists():
        print('exists', path)
        continue
    img = Image.new('RGB', (640, 480), color)
    draw = ImageDraw.Draw(img)
    bbox = draw.textbbox((0, 0), label, font=font)
    w = bbox[2] - bbox[0]
    h = bbox[3] - bbox[1]
    draw.text(((640-w)/2, (480-h)/2), label, fill='black', font=font)
    img.save(path, quality=85)
    print('created', path)