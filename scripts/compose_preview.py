#!/usr/bin/env python3
"""《她的姊妹节》换装完成态合成预览：盛装基底 + 分层组件按锚点叠加。
用法：uv run --with pillow --python 3.10 python scripts/compose_preview.py
锚点（target_w=内容目标宽px, cy=内容中心y px，画布 983x1601）即换装 UI 的对位基准。"""
from PIL import Image
C = "assets/char"
base = Image.open(f"{C}/盛装基底-v1.png").convert("RGBA")
W, H = base.size

PLANS = {
    "款式A": [("盛装衣裙-A", 584, 830), ("围腰绣片-A", 300, 868),
             ("银饰-泡项圈", 260, 455), ("节日头饰-银角", 460, -55)],
    "款式B": [("盛装衣裙-B", 640, 880), ("围腰绣片-B", 312, 880),
             ("银饰-项圈耳坠", 230, 470), ("节日头饰-银冠", 330, 150)],
}

for variant, plan in PLANS.items():
    comp = base.copy()
    for name, tw, cy in plan:
        im = Image.open(f"{C}/{name}-v1.png").convert("RGBA")
        bb = im.getbbox()
        s = tw / (bb[2] - bb[0])
        im = im.resize((int(im.width * s), int(im.height * s)), Image.LANCZOS)
        bb2 = im.getbbox()
        comp.alpha_composite(im, dest=(int(W * 0.5) - (bb2[0] + bb2[2]) // 2, int(cy) - (bb2[1] + bb2[3]) // 2))
    bg = Image.new("RGB", comp.size, (26, 36, 56))
    bg.paste(comp, mask=comp.split()[3])
    bg.save(f"{C}/盛装预览-{variant}-v1.png")
    print("saved", f"{C}/盛装预览-{variant}-v1.png")
