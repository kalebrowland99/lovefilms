export type PortfolioItem = {
  shortcode: string;
  url: string;
};

/**
 * Quick Previews embeds. These must be live @theloveteam posts: Instagram
 * renders its "link may be broken" error for any post that is gone, which is
 * what happened to the previous set (dead shortcodes, replaced Nov 20, 2026).
 */
export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    shortcode: 'Df52IGTj8xu',
    url: 'https://www.instagram.com/reel/Df52IGTj8xu/',
  },
  {
    shortcode: 'Df52EwhD1NL',
    url: 'https://www.instagram.com/reel/Df52EwhD1NL/',
  },
  {
    shortcode: 'Df52AuDj3KC',
    url: 'https://www.instagram.com/reel/Df52AuDj3KC/',
  },
  {
    shortcode: 'Df3QARkj3Ji',
    url: 'https://www.instagram.com/reel/Df3QARkj3Ji/',
  },
  {
    shortcode: 'Df3P9Aqj2jw',
    url: 'https://www.instagram.com/reel/Df3P9Aqj2jw/',
  },
  {
    shortcode: 'Df3P1-8DzEY',
    url: 'https://www.instagram.com/reel/Df3P1-8DzEY/',
  },
];
