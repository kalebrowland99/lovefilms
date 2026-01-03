# Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Start the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the demo.

### 2. View the Example

Visit [http://localhost:3000/example](http://localhost:3000/example) to see a Tennessee videographer example.

### 3. Customize Your Page

Edit `/app/page.tsx` to use your own content:

```tsx
import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero';

export default function Home() {
  return (
    <ScrollExpandMedia
      mediaType="image"
      mediaSrc="/your-image.jpg"
      bgImageSrc="/your-background.jpg"
      title="Your Title Here"
      date="Your Subtitle"
      scrollToExpand="Scroll to Expand"
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Your Content</h2>
        <p className="text-lg">Your description...</p>
      </div>
    </ScrollExpandMedia>
  );
}
```

## 📁 Key Files

- **Component**: `/components/ui/scroll-expansion-hero.tsx`
- **Demo**: `/components/blocks/scroll-expansion-hero-demo.tsx`
- **Example**: `/app/example/page.tsx`
- **Main Page**: `/app/page.tsx`

## 🎯 Quick Customization

### Change Colors

In the component file, search for `text-blue-200` and replace with your preferred Tailwind color:

```tsx
className='text-blue-200'  // Change to text-purple-500, text-green-400, etc.
```

### Add Your Images

1. Place images in `/public/images/`
2. Use them like this:

```tsx
mediaSrc="/images/my-video.jpg"
bgImageSrc="/images/my-background.jpg"
```

### Use External Images

Add your domain to `/next.config.ts`:

```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'your-domain.com',
    },
  ],
}
```

## 🎬 Video Tips

### YouTube Videos

```tsx
mediaSrc="https://www.youtube.com/watch?v=YOUR_VIDEO_ID"
```

### Direct Video Files

```tsx
mediaSrc="/videos/my-video.mp4"
posterSrc="/images/video-poster.jpg"
```

## 🎨 Pre-built Variants

Import ready-to-use variants:

```tsx
import { 
  VideoExpansion, 
  ImageExpansion,
  VideoExpansionTextBlend,
  ImageExpansionTextBlend 
} from '@/components/blocks/scroll-expansion-hero-demo';

export default function Page() {
  return <VideoExpansion />;
}
```

## 📱 Test on Mobile

The component is fully responsive. Test by:
1. Opening Chrome DevTools (F12)
2. Click device toolbar (Ctrl+Shift+M)
3. Select a mobile device
4. Test scrolling with mouse/touch

## 🔧 Common Issues

**Images not loading?**
- Check `next.config.ts` has the correct domain
- Verify image URLs are accessible

**Video not playing?**
- Use direct URLs ending in .mp4, .webm
- For YouTube, use embed format
- Ensure autoplay is allowed (requires mute)

**Scroll not working?**
- Refresh the page
- Check browser console for errors
- Test in a different browser

## 📚 Full Documentation

See `COMPONENT_INTEGRATION.md` for complete documentation.

## 🎉 You're Ready!

Start customizing and building your amazing scroll expansion experience!

