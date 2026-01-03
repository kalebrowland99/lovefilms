# Tennessee Videographer - Scroll Expansion Hero

A modern Next.js website featuring an immersive scroll expansion hero component for showcasing video and photography work.

## 🎯 Project Overview

This project is built with:
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first styling
- **shadcn/ui** - High-quality component library
- **Framer Motion** - Smooth animations

## ✨ Features

- 🎬 **Scroll Expansion Hero** - Interactive media showcase that expands as you scroll
- 📱 **Fully Responsive** - Optimized for mobile, tablet, and desktop
- 🎨 **Customizable** - Easy to modify colors, content, and behavior
- 🖼️ **Multi-Media Support** - Works with images, videos, and YouTube embeds
- ⚡ **Performance Optimized** - Next.js Image optimization and lazy loading
- 🎭 **Multiple Variants** - Pre-built demos with different styles

## 🚀 Quick Start

### Install Dependencies (Already Done)

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the demo.

### View Examples

- **Main Demo**: [http://localhost:3000](http://localhost:3000)
- **Tennessee Example**: [http://localhost:3000/example](http://localhost:3000/example)

## 📁 Project Structure

```
tennesseevideographer/
├── app/
│   ├── page.tsx                    # Main demo page
│   ├── example/
│   │   └── page.tsx               # Tennessee videographer example
│   ├── layout.tsx                 # Root layout
│   └── globals.css                # Global styles
├── components/
│   ├── ui/
│   │   └── scroll-expansion-hero.tsx    # Main component
│   └── blocks/
│       └── scroll-expansion-hero-demo.tsx # Demo variants
├── lib/
│   └── utils.ts                   # Utility functions
├── public/                        # Static assets
├── components.json                # shadcn/ui config
├── next.config.ts                 # Next.js config
├── tailwind.config.ts             # Tailwind config
└── tsconfig.json                  # TypeScript config
```

## 📖 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Get started in 3 steps
- **[COMPONENT_INTEGRATION.md](./COMPONENT_INTEGRATION.md)** - Complete integration guide

## 🎨 Component Usage

### Basic Example

```tsx
import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero';

export default function Page() {
  return (
    <ScrollExpandMedia
      mediaType="image"
      mediaSrc="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4"
      bgImageSrc="https://images.unsplash.com/photo-1518709268805-4e9042af9f23"
      title="Your Title"
      date="Your Subtitle"
      scrollToExpand="Scroll to Expand"
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Your Content</h2>
        <p className="text-lg">Your description here...</p>
      </div>
    </ScrollExpandMedia>
  );
}
```

### Available Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `mediaType` | `'video' \| 'image'` | No | Media type (default: 'video') |
| `mediaSrc` | `string` | Yes | URL of video/image |
| `posterSrc` | `string` | No | Video poster image |
| `bgImageSrc` | `string` | Yes | Background image URL |
| `title` | `string` | No | Main title text |
| `date` | `string` | No | Subtitle text |
| `scrollToExpand` | `string` | No | Instruction text |
| `textBlend` | `boolean` | No | Enable text blend mode |
| `children` | `ReactNode` | No | Content after expansion |

## 🎭 Pre-built Variants

```tsx
import { 
  VideoExpansion,           // Video without text blend
  ImageExpansion,           // Image without text blend
  VideoExpansionTextBlend,  // Video with text blend
  ImageExpansionTextBlend   // Image with text blend
} from '@/components/blocks/scroll-expansion-hero-demo';
```

## 🛠️ Customization

### Colors

Edit the component to change colors:

```tsx
// Change from blue-200 to your preferred color
className='text-blue-200'  // → text-purple-500, text-green-400, etc.
```

### Scroll Sensitivity

Adjust in `scroll-expansion-hero.tsx`:

```tsx
// Line 63: Desktop sensitivity
const scrollDelta = e.deltaY * 0.0009; // Increase for faster

// Line 93: Mobile sensitivity  
const scrollFactor = deltaY < 0 ? 0.008 : 0.005; // Adjust values
```

### Media Dimensions

Modify expansion size:

```tsx
// Lines 173-174
const mediaWidth = 300 + scrollProgress * (isMobileState ? 650 : 1250);
const mediaHeight = 400 + scrollProgress * (isMobileState ? 200 : 400);
```

## 🖼️ Adding Your Media

### Local Files

1. Place files in `/public/`:
   ```
   /public/images/hero.jpg
   /public/videos/showcase.mp4
   ```

2. Reference them:
   ```tsx
   mediaSrc="/images/hero.jpg"
   bgImageSrc="/images/background.jpg"
   ```

### External URLs

1. Add domain to `next.config.ts`:
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

2. Use the URL:
   ```tsx
   mediaSrc="https://your-domain.com/image.jpg"
   ```

## 🎬 Video Support

### Direct Video Files

```tsx
<ScrollExpandMedia
  mediaType="video"
  mediaSrc="/videos/my-video.mp4"
  posterSrc="/images/poster.jpg"
  // ... other props
/>
```

### YouTube Videos

```tsx
<ScrollExpandMedia
  mediaType="video"
  mediaSrc="https://www.youtube.com/watch?v=YOUR_VIDEO_ID"
  // ... other props
/>
```

## 📱 Responsive Design

The component automatically adapts to:
- **Mobile** (< 768px): Smaller expansion, touch-optimized
- **Tablet** (768px - 1024px): Medium expansion
- **Desktop** (> 1024px): Full expansion range

## 🔧 Troubleshooting

### Development Server Issues

If you see network interface errors, this is a sandbox-related warning and can be ignored. The server should still work.

### Images Not Loading

1. Check `next.config.ts` has the correct domain
2. Verify image URLs are accessible
3. Check browser console for CORS errors

### Video Not Playing

1. Use direct video URLs (.mp4, .webm)
2. For YouTube, use proper embed format
3. Ensure autoplay is allowed (requires mute)

### Scroll Not Working

1. Refresh the page
2. Check for JavaScript errors in console
3. Test in a different browser
4. Ensure no conflicting scroll listeners

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Deploy to Vercel

The easiest way to deploy:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repository to [Vercel](https://vercel.com) for automatic deployments.

## 📦 Dependencies

### Core Dependencies
- `next` - React framework
- `react` & `react-dom` - React library
- `typescript` - Type safety
- `framer-motion` - Animations
- `tailwindcss` - Styling

### UI Dependencies
- `class-variance-authority` - Component variants
- `clsx` - Conditional classes
- `tailwind-merge` - Merge Tailwind classes
- `lucide-react` - Icon library

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [shadcn/ui](https://ui.shadcn.com/)
- [TypeScript](https://www.typescriptlang.org/docs/)

## 📄 License

This project is open source and available for personal and commercial use.

## 🙏 Credits

- Component design from [21st.dev](https://21st.dev/r/arunachalam0606/scroll-expansion-hero)
- Built with [shadcn/ui](https://ui.shadcn.com/)
- Powered by [Next.js](https://nextjs.org/)

## 🤝 Support

For questions or issues:
1. Check the [QUICK_START.md](./QUICK_START.md) guide
2. Review [COMPONENT_INTEGRATION.md](./COMPONENT_INTEGRATION.md)
3. Check the troubleshooting section above
4. Inspect browser console for errors

---

**Built with ❤️ for Tennessee Videographers**

*Last Updated: January 2, 2026*
