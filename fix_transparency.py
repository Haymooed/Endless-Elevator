from PIL import Image
import os

def make_transparent(img_path):
    img = Image.open(img_path).convert("RGBA")
    datas = img.getdata()

    new_data = []
    for item in datas:
        # If the pixel is pure white or very close to it, make it transparent
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)

    img.putdata(new_data)
    img.save(img_path)
    print(f"Processed {img_path}")

sprite_dir = "/home/ubuntu/Endless-Elevator/assets/sprites"
for filename in os.listdir(sprite_dir):
    if filename.endswith(".png"):
        make_transparent(os.path.join(sprite_dir, filename))
