# Films — how to add your videos

The site supports **multiple videos per category** — drop them in here and the marquee/grid update automatically.

## Folder structure

```
images/videos/
├── fb-1.mp4              ← Food & Bev video 1
├── fb-2.mp4              ← Food & Bev video 2  (optional)
├── fb-3.mp4              ← Food & Bev video 3  (optional)
├── hospitality-1.mp4
├── ...
├── jewellery-1.mp4       ✓ uploaded (Reel 4)
├── jewellery-2.mp4       ✓ uploaded (Reel 6)
├── jewellery-3.mp4       ✓ uploaded (Reel 8)
└── posters/
    ├── jewellery-1.jpg   ✓ generated
    ├── jewellery-2.jpg   ✓ generated
    └── jewellery-3.jpg   ✓ generated
```

## Categories wired into the site

| Slug | Display name | Status |
|------|-------------|--------|
| `fb` | Food & Bev | placeholder |
| `hospitality` | Hospitality | placeholder |
| `industrial` | Industrial | placeholder |
| `clothing` | Clothing | placeholder |
| `jewellery` | Jewellery | **3 videos uploaded ✓** |
| `product` | Product | placeholder |

## Encoding settings used (jewellery batch)

```bash
# Compress video — visually identical to source, ~6-8 MB per 20 sec clip
ffmpeg -i input.mp4 \
  -c:v libx264 -preset fast -crf 23 -pix_fmt yuv420p \
  -movflags +faststart -an -y output.mp4

# Generate poster from 2-sec mark, 720px wide
ffmpeg -ss 2 -i video.mp4 -frames:v 1 -q:v 4 -vf scale=720:-2 -y poster.jpg
```

## How videos load (lazy + safe)

1. Page loads with NO videos downloaded — sources use `data-src`, not `src`
2. As cards scroll into view, JS HEAD-probes each MP4 to confirm it exists
3. File found → swap in, play muted on loop, remove placeholder shimmer
4. File missing → placeholder stays (looks intentional, not broken)
5. Videos pause when scrolled out of view (saves battery)

## Aspect ratios

Each card has a `data-ratio` attribute controlling its size in the marquee:

| Ratio | Card size | Use for |
|-------|-----------|---------|
| `9:16` | 260×460 | Vertical Reels (default — used for jewellery) |
| `4:5` | 320×400 | Instagram portrait posts |
| `1:1` | 380×380 | Square commercials |
| `16:9` | 540×304 | Cinematic landscape ads |

To change a card's ratio, edit `data-ratio="9:16"` on the card's `<div>` in `work.html` or `index.html`.
