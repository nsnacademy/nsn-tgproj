import styled from 'styled-components';

/* === SAFE AREA === */
export const SafeArea = styled.div`
  height: 100vh;
  background: #000;
  color: #fff;

  display: flex;
  flex-direction: column;

  overflow: hidden;
`;

/* === FIXED HEADER === */
export const Header = styled.div`
  position: sticky;
  top: 0;
  z-index: 50;

  background: linear-gradient(
    to bottom,
    rgba(0,0,0,0.98),
    rgba(0,0,0,0.85)
  );

  padding: 24px 24px 16px;
`;

/* === SCROLLABLE CONTENT === */
export const Content = styled.div`
  flex: 1;                 /* 🔥 КЛЮЧЕВОЕ */
  overflow-y: auto;

  padding: 70 24px 140px;   /* место под Footer */
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

/* === FOOTER === */
export const Footer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;

  display: flex;
  gap: 12px;
  padding: 16px 24px 24px;

  background: linear-gradient(
    to top,
    rgba(0,0,0,0.98),
    rgba(0,0,0,0)
  );
`;

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
