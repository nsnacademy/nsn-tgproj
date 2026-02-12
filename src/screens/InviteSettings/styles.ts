import styled from 'styled-components';

/* =========================
   LAYOUT
========================= */

export const SafeArea = styled.div`
  min-height: 100vh;
  background: #000;
  color: #fff;
  display: flex;
  flex-direction: column;
`;

export const Container = styled.div`
  flex: 1;
  padding: 90px 20px 20px;
`;

export const HeaderRow = styled.div`
  margin-bottom: 24px;
`;

export const Title = styled.h1`
  font-size: 22px;
  font-weight: 600;
`;

/* =========================
   CONTENT
========================= */

export const Section = styled.div`
  background: rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const Label = styled.div`
  font-size: 14px;
  opacity: 0.8;
`;

export const Value = styled.div`
  font-size: 14px;
  font-weight: 500;
`;

export const Input = styled.input`
  width: 120px;
  padding: 8px 10px;
  border-radius: 10px;

  background: #000;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);

  outline: none;

  &:focus {
    border-color: #fff;
  }
`;

/* =========================
   FOOTER
========================= */

export const Footer = styled.div`
  padding: 16px 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Button = styled.button<{ $secondary?: boolean }>`
  width: 100%;
  padding: 14px;
  border-radius: 14px;

  border: none;
  font-weight: 600;
  font-size: 15px;

  background: ${({ $secondary }) =>
    $secondary ? 'rgba(255,255,255,0.1)' : '#fff'};
  color: ${({ $secondary }) =>
    $secondary ? '#fff' : '#000'};

  cursor: pointer;

  &:active {
    transform: scale(0.98);
  }
`;
