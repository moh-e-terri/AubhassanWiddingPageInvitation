import { Heart, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { weddingConfig } from '@/config/wedding.config';

export function FooterSection() {
  const { copy, groom, naqoot } = weddingConfig;

  return (
    <footer className="footer">
      <Heart size={32} color="#c9a24d" className="footer__icon" aria-hidden />
      <p className="footer__quote">"{copy.footerQuote}"</p>
      <p className="footer__credit">
        {groom.nickname} — {groom.fullName}
      </p>

      {naqoot.enabled && (
        <Link to="/naqoot" className="footer__link">
          نقوّط أبو حسان
        </Link>
      )}

      <div className="footer__note">
        <Sparkles size={14} color="#c9a24d" aria-hidden />
        <span>ملاحظة: {copy.noPhotosNote}</span>
        <Sparkles size={14} color="#c9a24d" aria-hidden />
      </div>
    </footer>
  );
}
