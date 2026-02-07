import styled from 'styled-components';

export const SafeArea = styled.div`
  min-height: 100vh;
  background: #000;
  color: #fff;
  padding: 24px;
`;

export const Header = styled.div`
  margin-bottom: 18px;
`;

export const Title = styled.h1`
  font-size: 26px;
  font-weight: 600;
`;

export const Username = styled.div`
  margin-top: 6px;
  opacity: 0.6;
`;

export const Card = styled.div`
  background: #111;
  border-radius: 20px;
  padding: 16px;
  margin-bottom: 14px;
`;

export const Row = styled.div`
  font-size: 14px;
  line-height: 1.45;
  margin-bottom: 6px;
`;

export const Divider = styled.div`
  height: 1px;
  background: #222;
  margin: 10px 0;
`;

export const CheckboxRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  margin: 18px 0;
  font-size: 14px;
  cursor: pointer;
`;

export const Footer = styled.div`
  display: flex;
  gap: 12px;
`;

export const BackButton = styled.button`
  flex: 1;
  height: 52px;
  border-radius: 16px;
  background: transparent;
  border: 1px solid #333;
  color: #fff;
`;

export const JoinButton = styled.button<{ disabled?: boolean }>`
  flex: 1;
  height: 52px;
  border-radius: 16px;
  background: #fff;
  color: #000;
  font-weight: 600;
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
  pointer-events: ${({ disabled }) =>
    disabled ? 'none' : 'auto'};
`;
