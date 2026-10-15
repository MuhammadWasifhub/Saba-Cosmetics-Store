'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Banner } from '@/lib/types';

type BannerWithSlug = Banner & { product_slug?: string | null };

export default function HeroBannerSlider({ banners }: { banners: BannerWithSlug[] }) {
  const slides = banners.filter((b) => b.image_url);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef<number>(0);

  useEffect(() => {
    if (slides.length <= 1 || paused) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 4500);
    return () => clearInterval(t);
  }, [slides.length, paused]);

  useEffect(() => {
    if (index >= slides.length && slides.length > 0) setIndex(0);
  }, [slides.length, index]);

  if (slides.length === 0) {
    return (
      <div className="hbs-empty">
        <div className="hbs-empty-orb orb-1" />
        <div className="hbs-empty-orb orb-2" />
        <p className="hbs-empty-text">Beauty, curated.</p>
      </div>
    );
  }

  const go = (i: number) => setIndex(((i % slides.length) + slides.length) % slides.length);

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  }

  function onTouchMove(e: React.TouchEvent) {
    if (touchStartX.current == null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  }

  function onTouchEnd() {
    const delta = touchDeltaX.current;
    if (Math.abs(delta) > 50) {
      go(delta < 0 ? index + 1 : index - 1);
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
  }

  return (
    <div
      className="hbs-root"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      role="region"
      aria-label="Featured banners"
    >
      <div className="hbs-frame">
        {slides.map((b, i) => {
          const active = i === index;
          const href = b.product_slug ? `/products/${b.product_slug}` : null;

          const media = (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={b.image_url}
                alt={b.title || 'Featured'}
                className={`hbs-img ${active ? 'is-active' : ''}`}
                draggable={false}
              />
              <div className="hbs-overlay" />

              {(b.title || b.subtitle) && (
                <div className={`hbs-caption ${active ? 'is-active' : ''}`}>
                  {b.subtitle && <p className="hbs-cap-sub">{b.subtitle}</p>}
                  {b.title && <h3 className="hbs-cap-title">{b.title}</h3>}
                  {href && <span className="hbs-cap-cta">Shop now →</span>}
                </div>
              )}
            </>
          );

          return (
            <div
              key={b.id ?? i}
              className={`hbs-slide ${active ? 'is-active' : ''}`}
              aria-hidden={!active}
            >
              {href ? (
                <Link href={href} className="hbs-link">
                  {media}
                </Link>
              ) : (
                <div className="hbs-link">{media}</div>
              )}
            </div>
          );
        })}

        {slides.length > 1 && (
          <>
            <button
              type="button"
              className="hbs-arrow hbs-arrow-prev"
              aria-label="Previous banner"
              onClick={() => go(index - 1)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              className="hbs-arrow hbs-arrow-next"
              aria-label="Next banner"
              onClick={() => go(index + 1)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>

            <div className="hbs-dots" role="tablist" aria-label="Banner navigation">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Go to banner ${i + 1}`}
                  className={`hbs-dot ${i === index ? 'is-active' : ''}`}
                  onClick={() => go(i)}
                />
              ))}
            </div>

            <div className="hbs-progress" aria-hidden="true">
              <div
                key={index + '-' + paused}
                className={`hbs-progress-bar ${paused ? 'paused' : ''}`}
              />
            </div>
          </>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .hbs-root {
          width: 100%;
          height: 100%;
          position: relative;
          user-select: none;
        }

        .hbs-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 5;
          max-height: 560px;
          height: 100%;
          border-radius: var(--radius-xl);
          overflow: hidden;
          background: var(--color-blush-pale);
          box-shadow: 0 20px 60px rgba(36,28,24,0.12), 0 4px 12px rgba(36,28,24,0.06);
        }

        .hbs-slide {
          position: absolute;
          inset: 0;
          opacity: 0;
          visibility: hidden;
          transition: opacity 700ms var(--ease-out), visibility 0ms 700ms;
          z-index: 1;
        }

        .hbs-slide.is-active {
          opacity: 1;
          visibility: visible;
          z-index: 2;
          transition: opacity 700ms var(--ease-out), visibility 0ms 0ms;
        }

        .hbs-link {
          display: block;
          width: 100%;
          height: 100%;
          position: relative;
        }

        .hbs-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(1);
          transition: transform 700ms var(--ease-out);
        }

        .hbs-slide.is-active .hbs-img {
          animation: kenburns 7s var(--ease-out) forwards;
        }

        .hbs-overlay {
          position: absolute;
          inset: 0;
          background: var(--grad-overlay);
          pointer-events: none;
        }

        .hbs-caption {
          position: absolute;
          left: 24px;
          right: 24px;
          bottom: 44px;
          color: var(--color-white);
          z-index: 3;
          transform: translateY(14px);
          opacity: 0;
          transition: opacity 520ms var(--ease-out) 200ms, transform 520ms var(--ease-out) 200ms;
          pointer-events: none;
        }

        .hbs-caption.is-active {
          opacity: 1;
          transform: translateY(0);
        }

        .hbs-cap-sub {
          font-size: 12px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          opacity: 0.85;
          margin-bottom: 6px;
        }

        .hbs-cap-title {
          font-family: var(--font-display);
          font-size: clamp(20px, 2.4vw, 28px);
          font-weight: 400;
          color: var(--color-white);
          line-height: 1.15;
          margin-bottom: 12px;
        }

        .hbs-cap-cta {
          display: inline-block;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.02em;
          border-bottom: 1px solid rgba(255,255,255,0.7);
          padding-bottom: 2px;
        }

        .hbs-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          color: var(--color-ink);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 4;
          opacity: 0;
          transition: opacity 260ms var(--ease-out), background 260ms var(--ease-out), transform 260ms var(--ease-out);
          box-shadow: 0 4px 14px rgba(0,0,0,0.1);
        }

        .hbs-arrow-prev { left: 14px; }
        .hbs-arrow-next { right: 14px; }

        .hbs-root:hover .hbs-arrow {
          opacity: 1;
        }

        .hbs-arrow:hover {
          background: var(--color-white);
          transform: translateY(-50%) scale(1.08);
        }

        .hbs-dots {
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 6px;
          z-index: 5;
          padding: 6px 10px;
          border-radius: 999px;
          background: rgba(255,255,255,0.28);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .hbs-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: rgba(255,255,255,0.65);
          transition: width 260ms var(--ease-out), background 260ms var(--ease-out);
          padding: 0;
        }

        .hbs-dot.is-active {
          width: 20px;
          border-radius: 999px;
          background: var(--color-white);
        }

        .hbs-progress {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: rgba(255,255,255,0.15);
          z-index: 5;
          overflow: hidden;
        }

        .hbs-progress-bar {
          height: 100%;
          width: 0;
          background: var(--color-white);
          opacity: 0.7;
          animation: hbsProgress 4500ms linear forwards;
        }

        .hbs-progress-bar.paused {
          animation-play-state: paused;
        }

        @keyframes hbsProgress {
          from { width: 0; }
          to { width: 100%; }
        }

        .hbs-empty {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 5;
          max-height: 64vh;
          border-radius: var(--radius-xl);
          overflow: hidden;
          background: var(--grad-hero);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hbs-empty-orb {
          position: absolute;
        }

        .hbs-empty-text {
          position: relative;
          font-family: var(--font-display);
          font-size: 26px;
          color: var(--color-blush-deep);
          z-index: 2;
        }

        @media (max-width: 900px) {
          .hbs-frame {
            aspect-ratio: 16 / 11;
            max-height: 38vh;
          }
          .hbs-caption {
            left: 18px;
            right: 18px;
            bottom: 34px;
          }
          .hbs-arrow {
            display: none;
          }
        }

        @media (max-width: 560px) {
          .hbs-frame {
            aspect-ratio: 4 / 3;
            max-height: 34vh;
            border-radius: var(--radius-lg);
          }
          .hbs-caption {
            bottom: 26px;
          }
          .hbs-cap-title {
            font-size: 20px;
          }
        }
      ` }} />
    </div>
  );
}