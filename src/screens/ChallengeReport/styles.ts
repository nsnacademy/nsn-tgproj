import styled from 'styled-components';

export const SafeArea = styled.div`
  min-height: 100vh;
  background: #000;
  color: #fff;
  display: flex;
  flex-direction: column;
  padding-top: 100px;
`;

export const Header = styled.div`
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const BackButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 20px;
`;

export const Title = styled.h1`
  font-size: 18px;
  margin: 0;
`;

export const Content = styled.div`
  flex: 1;
  padding: 20px;
`;

export const Field = styled.div`
  margin-bottom: 20px;
`;

export const Label = styled.div`
  font-size: 14px;
  opacity: 0.7;
  margin-bottom: 8px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: none;
  font-size: 16px;
`;

export const Footer = styled.div`
  padding: 20px;
`;

/* === CHECK ROW === */

export const CheckRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`;

export const CheckDot = styled.div<{ active: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid #fff;
  background: ${({ active }) => (active ? '#fff' : 'transparent')};
  transition: all 0.15s ease;
`;

export const CheckText = styled.div<{ active: boolean }>`
  font-size: 14px;
  opacity: ${({ active }) => (active ? 1 : 0.6)};
`;

/* === BUTTON === */

export const PrimaryButton = styled.button`
  width: 100%;
  padding: 16px;
  border-radius: 14px;
  border: none;
  background: #fff;
  color: #000;
  font-size: 16px;
  font-weight: 600;
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
`;
