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
  padding: 90px 20px 140px;
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export const Title = styled.h1`
  font-size: 22px;
  font-weight: 600;
`;

export const Text = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 12px;
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 8px;
`;

/* =========================
   CARD ROW (CARD + ACTIONS)
========================= */

export const CardRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

/* =========================
   CHALLENGE CARD
========================= */

export const ChallengeCard = styled.div`
  flex: 1;

  background: rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 16px 18px;

  display: flex;
  flex-direction: column;
  gap: 4px;

  cursor: pointer;

  &:active {
    background: rgba(255, 255, 255, 0.1);
  }
`;

export const ChallengeTitle = styled.div`
  font-size: 15px;
  font-weight: 500;
`;

export const ChallengeMeta = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
`;

/* =========================
   ACTIONS (RIGHT SIDE)
========================= */

export const ShareButton = styled.button`
  width: 34px;
  height: 34px;
  border-radius: 17px;

  border: none;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  font-size: 15px;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  touch-action: manipulation;

  &:active {
    transform: scale(0.9);
  }

  &:hover {
    background: rgba(255, 255, 255, 0.25);
  }
`;

export const PendingBadge = styled.div`
  min-width: 28px;
  height: 28px;
  border-radius: 14px;

  background: #ff4d4f;
  color: #fff;
  font-size: 13px;
  font-weight: 600;

  display: flex;
  align-items: center;
  justify-content: center;
`;
