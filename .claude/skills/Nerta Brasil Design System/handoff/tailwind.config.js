/** Nerta Brasil — Tailwind theme tokens.
 *  Cole na raiz do projeto Next.js. Cores espelham tokens/colors.css.
 *  Regra #1: navy é o fundo padrão — nunca use bg-white em superfícies primárias.
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          deep: '#0D1B2E',    // fundo principal (inegociável)
          deeper: '#081320',  // profundidade / sunken
          mid: '#112644',     // cards / painéis
          light: '#163258',   // hover / raised
          border: '#1E3A5A',  // bordas sutis
        },
        nerta: {
          DEFAULT: '#1E7FC8', // azul primário — CTAs, links
          hover: '#2A8FD8',
          press: '#176FB0',
          sky: '#5BB8F5',     // palavras-chave, numeração editorial
        },
        provisao: {
          DEFAULT: '#C9951A', // dourado — EXCLUSIVO da parceria
          light: '#F4C94E',
          hover: '#DBA52A',
        },
        teal: {
          DEFAULT: '#1DB87E', // ícones de benefício, checks
        },
        ink: {
          title: '#FFFFFF',
          body: '#8A9BB0',    // corpo de texto (muted)
          tertiary: '#D9DDE3',
        },
        disabled: {
          bg: '#1A2A40',
          text: '#5A6B82',
        },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'Montserrat', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        kpi: ['48px', { lineHeight: '1', letterSpacing: '-0.02em' }],
        hero: ['54px', { lineHeight: '1.04', letterSpacing: '-0.02em' }],
      },
      letterSpacing: {
        headline: '-0.02em',
        label: '0.08em',
      },
      borderRadius: {
        card: '12px',        // raio padrão de card (8–12px)
        'card-sm': '8px',
        pill: '999px',
      },
      boxShadow: {
        card: '0 6px 20px rgba(8,19,32,0.45)',
        lg: '0 18px 48px rgba(8,19,32,0.55)',
        // produto flutua SEM sombra — não usar shadow em fotos de produto
      },
      backgroundImage: {
        'hero-navy': 'linear-gradient(135deg, #0D1B2E 0%, #163258 100%)',
      },
      ringColor: {
        focus: 'rgba(91,184,245,0.55)',
      },
    },
  },
  plugins: [],
};
