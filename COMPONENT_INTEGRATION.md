# Scroll Expansion Hero Component Integration

## ✅ Setup Complete

Your project has been successfully set up with:
- ✅ Next.js 16 with TypeScript
- ✅ Tailwind CSS v4
- ✅ shadcn/ui components
- ✅ Framer Motion for animations
- ✅ Scroll Expansion Hero component

## 📁 Project Structure

```
tennesseevideographer/
├── app/
│   ├── page.tsx                    # Main page (using the demo)
│   ├── layout.tsx                  # Root layout
│   └── globals.css                 # Global styles
├── components/
│   ├── ui/
│   │   └── scroll-expansion-hero.tsx    # Main component
│   └── blocks/
│       └── scroll-expansion-hero-demo.tsx # Demo implementation
├── lib/
│   └── utils.ts                    # Utility functions
└── components.json                 # shadcn/ui configuration
```

## 🎯 Component Location

The main component is located at:
```
/components/ui/scroll-expansion-hero.tsx
```

### Why `/components/ui`?

The `/components/ui` folder is the standard location for shadcn/ui components. This convention:
- ✅ Keeps UI primitives organized and separate from business logic
- ✅ Makes it easy to identify reusable components
- ✅ Follows shadcn/ui best practices
- ✅ Allows for easy component discovery and maintenance

## 🚀 Running the Project

Start the development server:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Installed Dependencies

All required dependencies have been installed:

```json
{
  "framer-motion": "^12.23.26",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "lucide-react": "^0.562.0",
  "tailwind-merge": "^3.4.0"
}
```

## 🎨 Component Usage

### Basic Usage

```tsx
import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero';

export default function MyPage() {
  return (
    <ScrollExpandMedia
      mediaType="image"
      mediaSrc="https://images.unsplash.com/photo-1682687982501-1e58ab814714"
      bgImageSrc="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
      title="Your Amazing Title"
      date="Your Subtitle"
      scrollToExpand="Scroll to Expand"
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Your Content</h2>
        <p className="text-lg mb-8">Your description here...</p>
      </div>
    </ScrollExpandMedia>
  );
}
```

### Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mediaType` | `'video' \| 'image'` | `'video'` | Type of media to display |
| `mediaSrc` | `string` | Required | URL of the video or image |
| `posterSrc` | `string` | Optional | Poster image for video |
| `bgImageSrc` | `string` | Required | Background image URL |
| `title` | `string` | Optional | Main title (splits on first space) |
| `date` | `string` | Optional | Subtitle or date text |
| `scrollToExpand` | `string` | Optional | Instruction text |
| `textBlend` | `boolean` | `false` | Enable text blend mode |
| `children` | `ReactNode` | Optional | Content shown after expansion |

### Video Support

The component supports:
- ✅ Direct video URLs (mp4, webm, etc.)
- ✅ YouTube embed URLs
- ✅ Autoplay with mute
- ✅ Loop playback
- ✅ Custom poster images

### Image Support

For images, the component uses Next.js Image optimization:
- ✅ Automatic image optimization
- ✅ Responsive sizing
- ✅ Lazy loading
- ✅ External image support (Unsplash configured)

## 🎭 Demo Variants

The demo file includes 4 pre-built variants:

1. **VideoExpansionTextBlend** - Video with text blend effect
2. **ImageExpansionTextBlend** - Image with text blend effect
3. **VideoExpansion** - Video without text blend
4. **ImageExpansion** - Image without text blend

Import any variant:

```tsx
import { VideoExpansion } from '@/components/blocks/scroll-expansion-hero-demo';

export default function Page() {
  return <VideoExpansion />;
}
```

## 🖼️ Using Your Own Media

### For Images

Replace the Unsplash URLs with your own:

```tsx
mediaSrc="https://your-domain.com/image.jpg"
bgImageSrc="https://your-domain.com/background.jpg"
```

**Important:** Add your domain to `next.config.ts`:

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

### For Videos

Use direct video URLs or YouTube links:

```tsx
// Direct video
mediaSrc="https://your-domain.com/video.mp4"

// YouTube
mediaSrc="https://www.youtube.com/watch?v=YOUR_VIDEO_ID"
// or
mediaSrc="https://www.youtube.com/embed/YOUR_VIDEO_ID"
```

### For Local Assets

Place files in the `/public` folder:

```tsx
mediaSrc="/videos/my-video.mp4"
bgImageSrc="/images/background.jpg"
```

## 🎨 Customization

### Colors

The component uses Tailwind CSS classes. Customize colors in the component:

```tsx
// Change text colors (currently blue-200)
className='text-blue-200'  // Change to any Tailwind color

// Change overlay opacity
className='bg-black/30'    // Adjust the opacity value
```

### Animations

Adjust scroll sensitivity in the component:

```tsx
// Line 63: Desktop scroll sensitivity
const scrollDelta = e.deltaY * 0.0009; // Increase for faster expansion

// Line 93: Mobile scroll sensitivity
const scrollFactor = deltaY < 0 ? 0.008 : 0.005; // Adjust values
```

### Sizing

Modify expansion dimensions:

```tsx
// Line 173-174
const mediaWidth = 300 + scrollProgress * (isMobileState ? 650 : 1250);
const mediaHeight = 400 + scrollProgress * (isMobileState ? 200 : 400);
```

## 🔧 Troubleshooting

### Images Not Loading

1. Check `next.config.ts` has the correct domain in `remotePatterns`
2. Verify the image URL is accessible
3. Check browser console for CORS errors

### Video Not Playing

1. Ensure video URL is direct (ends in .mp4, .webm, etc.)
2. For YouTube, use embed format
3. Check browser console for errors
4. Verify autoplay is allowed (requires muted)

### Scroll Not Working

1. Ensure component is full-screen
2. Check for conflicting scroll event listeners
3. Test on different browsers
4. Verify `mediaFullyExpanded` state is updating

## 📱 Responsive Behavior

The component is fully responsive:
- Mobile: Smaller expansion range, touch-optimized
- Tablet: Medium expansion range
- Desktop: Full expansion range

Breakpoints are handled automatically using Tailwind's responsive classes.

## 🎯 Best Practices

1. **Performance**: Use optimized images (WebP format recommended)
2. **Accessibility**: Add meaningful alt text to images
3. **Video Size**: Keep videos under 10MB for better loading
4. **Content**: Keep title concise (2-3 words works best)
5. **Testing**: Test on multiple devices and browsers

## 🌟 Next Steps

1. Replace demo content with your own media
2. Customize colors to match your brand
3. Adjust scroll sensitivity to your preference
4. Add more content sections as children
5. Integrate with your existing pages

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [shadcn/ui](https://ui.shadcn.com/)

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the component source code
3. Test with the demo variants first
4. Check browser console for errors

---

**Component Source**: [21st.dev](https://21st.dev/r/arunachalam0606/scroll-expansion-hero)

**Integration Date**: January 2, 2026

