#!/usr/bin/env python3
import base64, struct, zlib, os

def create_png(size, filename):
    w = h = size
    raw = b''
    for y in range(h):
        raw += b'\x00'
        for x in range(w):
            cx, cy = w/2, h/2
            dx, dy = x - cx, y - cy
            dist = (dx**2 + dy**2)**0.5
            r_outer = w * 0.48
            r_inner = w * 0.38

            if dist <= r_outer:
                # background circle - dark green
                r, g, b, a = 59, 109, 17, 255
                # wheat stalk area
                stalk_w = w * 0.06
                if abs(dx) < stalk_w and dy < 0:
                    r, g, b = 239, 159, 39  # amber wheat
                # leaf blobs
                if (dx + w*0.15)**2 + (dy + h*0.05)**2 < (w*0.13)**2:
                    r, g, b = 97, 196, 89
                if (dx - w*0.15)**2 + (dy + h*0.05)**2 < (w*0.13)**2:
                    r, g, b = 97, 196, 89
                # grain top
                if abs(dx) < w*0.08 and dist < r_inner*0.6 and dy < -h*0.05:
                    r, g, b = 250, 199, 117
                raw += bytes([r, g, b, a])
            else:
                raw += b'\x00\x00\x00\x00'

    def chunk(name, data):
        c = struct.pack('>I', len(data)) + name + data
        return c + struct.pack('>I', zlib.crc32(name + data) & 0xffffffff)

    header = b'\x89PNG\r\n\x1a\n'
    ihdr = chunk(b'IHDR', struct.pack('>IIBBBBB', w, h, 8, 6, 0, 0, 0))

    rows = []
    row_size = w * 4 + 1
    for i in range(h):
        rows.append(raw[i*row_size:(i+1)*row_size])

    compressed = zlib.compress(raw, 9)
    idat = chunk(b'IDAT', compressed)
    iend = chunk(b'IEND', b'')

    with open(filename, 'wb') as f:
        f.write(header + ihdr + idat + iend)
    print(f"Created {filename}")

os.makedirs('icons', exist_ok=True)
create_png(192, 'icons/icon-192.png')
create_png(512, 'icons/icon-512.png')
print("Icons generated!")
