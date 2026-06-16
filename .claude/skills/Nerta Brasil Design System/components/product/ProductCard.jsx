import React from 'react';
import { Badge } from '../core/Badge.jsx';
import { Button } from '../core/Button.jsx';

/**
 * ProductCard — the canonical Nerta catalog card (PDF §10 anatomy).
 * Navy surface, line label, white name, gold category, dilution highlight,
 * attribute badges, floating product image (no shadow), Mercado Livre CTA.
 * When stock === 0 the CTA becomes a disabled "Produto Indisponível".
 */
export function ProductCard({
  lineLabel,
  name,
  category,
  dilution,
  attributes = [],
  description,
  imageSrc,
  imageAlt,
  mlUrl,
  stock = 1,
  featured = false,
  onBuy,
  style,
  // absorbed so they don't leak onto the DOM
  active,
  slug,
  short,
  line,
  icon,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const outOfStock = stock === 0;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        transition: 'border-color var(--duration-base) var(--ease-standard), transform var(--duration-base) var(--ease-standard)',
        ...(hover ? { borderColor: 'var(--border-strong)', transform: 'translateY(-3px)' } : {}),
        ...style,
      }}
      {...rest}
    >
      {featured && (
        <div style={{ position: 'absolute', top: 14, right: 14, zIndex: 2 }}>
          <Badge tone="gold" solid>Destaque</Badge>
        </div>
      )}

      {/* Floating product image on navy — no shadow */}
      <div
        style={{
          height: 196,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(120% 90% at 50% 30%, #163258 0%, #0D1B2E 72%)',
          padding: 20,
        }}
      >
        {imageSrc ? (
          <img src={imageSrc} alt={imageAlt || name} style={{ maxHeight: '100%', maxWidth: '70%', objectFit: 'contain' }} />
        ) : (
          <div style={{ color: 'var(--navy-border)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Bombona 25L
          </div>
        )}
      </div>

      <div style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
        {lineLabel && (
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--sky-blue)' }}>
            {lineLabel}
          </div>
        )}

        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 19, color: 'var(--white)', letterSpacing: '-0.01em', lineHeight: 1.15 }}>
            {name}
          </h3>
          {category && (
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: 'var(--provisao-gold)', marginTop: 3 }}>
              {category}
            </div>
          )}
        </div>

        {(dilution || attributes.length > 0) && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {dilution && <Badge tone="blue" solid>{`Diluição ${dilution}`}</Badge>}
            {attributes.map((a) => (
              <Badge key={a} tone="teal">{a}</Badge>
            ))}
          </div>
        )}

        {description && (
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: 'var(--muted-text)' }}>{description}</p>
        )}

        <div style={{ marginTop: 'auto', paddingTop: 6 }}>
          {outOfStock ? (
            <Button variant="primary" fullWidth disabled disabledLabel="Produto Indisponível" />
          ) : (
            <Button variant="primary" fullWidth href={mlUrl} external onClick={onBuy}>
              Comprar no Mercado Livre
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
