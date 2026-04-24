# Films — how to drop your videos in

Place 6 video files here (one per category):

```
images/videos/
├── fb.mp4            ← Food & Beverage
├── hospitality.mp4   ← Hospitality
├── industrial.mp4    ← Industrial
├── clothing.mp4      ← Clothing
├── jewellery.mp4     ← Jewellery
├── product.mp4       ← Product
└── posters/
    ├── fb.jpg
    ├── hospitality.jpg
    ├── industrial.jpg
    ├── clothing.jpg
    ├── jewellery.jpg
    └── product.jpg
```

## Video specs (for fast loading)

- **Format:** MP4, H.264 codec, AAC audio (even though they play muted)
- **Orientation:** Portrait, 9:16 (ideal: 720×1280 or 1080×1920)
- **Duration:** 3–8 seconds, seamless loop (first frame = last frame)
- **Size:** under 1.5 MB each — use HandBrake's "Web → Gmail Large 3 Minutes 720p30" preset
- **Audio:** can leave it in; playback is forced muted

## Poster specs

Each poster is the first (or hero) frame of the video, saved as JPG:
- **Size:** 720×1280, JPG, quality 78, around 60–120 KB
- These show instantly before the video loads

## How it works

- On page load, NO videos are downloaded (they use `data-src`, not `src`)
- As you scroll and a card enters the viewport, JS checks if the MP4 exists
- If it does: the video swaps in, plays muted on loop
- If the file isn't uploaded yet: the placeholder stays (shimmer + play icon)
- Videos pause automatically when they scroll out of view (saves battery)

So you can ship the site with 0, 3, or 6 videos — it always looks intentional.
