import styled from 'styled-components';

/* === SAFE AREA === */
export const SafeArea = styled.div`
  min-height: 100vh;
  background: #000;
  color: #fff;
`;

/* === HEADER (липкий, как ты хотел) === */
export const Header = styled.div`
  position: sticky;
  top: 0;
  z-index: 20;

  background: linear-gradient(
    to bottom,
    rgba(0,0,0,0.98),
    rgba(0,0,0,0.85)
  );

  padding: 70px 24px 16px;
`;

/* === CONTENT (обычный поток, скроллится весь экран) === */
export const Content = styled.div`
  padding: 16px 24px 32px;
`;

/* === TITLE === */
export const Title = styled.h1`
  font-size: 26px;
  font-weight: 600;
  line-height: 1.25;
`;

/* === USERNAME === */
export const Username = styled.div`
  margin-top: 6px;
  opacity: 0.6;
  font-size: 14px;
`;

/* === CARDS === */
export const Card = styled.div`
  background: linear-gradient(180deg, #111, #0b0b0b);
  border-radius: 20px;
  padding: 16px;
  margin-bottom: 14px;
`;

/* === ROW === */
export const Row = styled.div`
  font-size: 14px;
  line-height: 1.45;
  margin-bottom: 8px;
`;

export const Divider = styled.div`
  height: 1px;
  background: #222;
  margin: 10px 0;
`;

/* === CHECKBOX === */
export const CheckboxRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  margin: 20px 0;
  padding: 14px 16px;
  background: #0e0e0e;
  border-radius: 14px;
  font-size: 14px;
  cursor: pointer;

  input {
    width: 16px;
    height: 16px;
  }
`;

/* === FOOTER (БОЛЬШЕ НЕ FIXED) === */
export const Footer = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 44px; /* было 24px → подняли кнопки выше на 20px */
`;


/* === BUTTONS === */
export const BackButton = styled.button`
  flex: 1;
  height: 52px;
  border-radius: 16px;
  background: transparent;
  border: 1px solid #333;
  color: #fff;
  font-size: 15px;
`;

export const JoinButton = styled.button<{ disabled?: boolean }>`
  flex: 1;
  height: 52px;
  border-radius: 16px;
  background: #fff;
  color: #000;
  font-weight: 600;
  font-size: 15px;

  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
  pointer-events: ${({ disabled }) =>
    disabled ? 'none' : 'auto'};
`;
