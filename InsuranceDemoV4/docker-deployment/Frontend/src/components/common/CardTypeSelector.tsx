import React from 'react';
import { CARD_CONFIGS, type CardType } from '../../lib/utils/cardValidation';
import * as S from '../../styles/common/CardTypeSelector.styled';

interface CardTypeSelectorProps {
  selected: CardType;
  onChange: (type: CardType) => void;
  error?: string;
}

/* ── SVG-based brand logos ── */
const VisaLogo = () => (
  <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
    <rect width="32" height="20" rx="3" fill="#1A1F71"/>
    <text x="3" y="15" fontFamily="Arial" fontWeight="bold" fontSize="11" fill="white">VISA</text>
  </svg>
);

const MastercardLogo = () => (
  <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
    <rect width="32" height="20" rx="3" fill="#252525"/>
    <circle cx="12" cy="10" r="7" fill="#EB001B"/>
    <circle cx="20" cy="10" r="7" fill="#F79E1B"/>
    <path d="M16 4.8a7 7 0 0 1 0 10.4A7 7 0 0 1 16 4.8z" fill="#FF5F00"/>
  </svg>
);

const AmexLogo = () => (
  <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
    <rect width="32" height="20" rx="3" fill="#2E77BC"/>
    <text x="2" y="14" fontFamily="Arial" fontWeight="bold" fontSize="8" fill="white">AMEX</text>
  </svg>
);

const DiscoverLogo = () => (
  <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
    <rect width="32" height="20" rx="3" fill="#FFFFFF" stroke="#e2e8f0"/>
    <text x="1" y="13" fontFamily="Arial" fontWeight="bold" fontSize="6.5" fill="#231F20">DISCOVER</text>
    <circle cx="25" cy="10" r="6" fill="#F76F20"/>
  </svg>
);

const DinersLogo = () => (
  <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
    <rect width="32" height="20" rx="3" fill="#FFFFFF" stroke="#e2e8f0"/>
    <text x="1" y="12" fontFamily="Arial" fontWeight="bold" fontSize="5.5" fill="#004A97">DINERS</text>
    <text x="1" y="18" fontFamily="Arial" fontWeight="bold" fontSize="5.5" fill="#004A97">CLUB</text>
  </svg>
);

const JCBLogo = () => (
  <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
    <rect width="32" height="20" rx="3" fill="#FFFFFF" stroke="#e2e8f0"/>
    <rect x="3"  y="3" width="8" height="14" rx="2" fill="#003087"/>
    <rect x="12" y="3" width="8" height="14" rx="2" fill="#CC0000"/>
    <rect x="21" y="3" width="8" height="14" rx="2" fill="#009F6B"/>
    <text x="4"  y="14" fontFamily="Arial" fontWeight="bold" fontSize="8" fill="white">J</text>
    <text x="13" y="14" fontFamily="Arial" fontWeight="bold" fontSize="8" fill="white">C</text>
    <text x="22" y="14" fontFamily="Arial" fontWeight="bold" fontSize="8" fill="white">B</text>
  </svg>
);

const LOGOS: Record<string, React.ReactNode> = {
  visa:       <VisaLogo />,
  mastercard: <MastercardLogo />,
  amex:       <AmexLogo />,
  discover:   <DiscoverLogo />,
  diners:     <DinersLogo />,
  jcb:        <JCBLogo />,
};

/* ── Component ── */
const CardTypeSelector: React.FC<CardTypeSelectorProps> = ({ selected, onChange, error }) => (
  <div>
    <S.Grid>
      {CARD_CONFIGS.map(cfg => (
        <S.Chip
          key={cfg.type}
          type="button"
          selected={selected === cfg.type}
          onClick={() => onChange(selected === cfg.type ? '' : cfg.type)}
          title={cfg.label}
        >
          <S.CardLogo>{LOGOS[cfg.type]}</S.CardLogo>
          <S.CardLabel selected={selected === cfg.type}>{cfg.label}</S.CardLabel>
        </S.Chip>
      ))}
    </S.Grid>
    {error && <S.ErrorText>{error}</S.ErrorText>}
  </div>
);

export default CardTypeSelector;
