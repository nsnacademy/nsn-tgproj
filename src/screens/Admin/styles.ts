import styled from 'styled-components';

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
  color: rgba(255,255,255,0.7);
  margin-bottom: 12px;
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
`;



export const ChallengeTitle = styled.div`
  font-size: 15px;
  font-weight: 500;
`;

export const ChallengeMeta = styled.div`
  font-size: 12px;
  color: rgba(255,255,255,0.5);
  margin-top: 4px;
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

export const ChallengeCard = styled.div`
  background: rgba(255,255,255,0.06);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ChallengeInfo = styled.div`
  flex: 1;
  cursor: pointer;
`;

export const CardActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ShareButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  border: none;
  background: rgba(255,255,255,0.14);
  color: #fff;
  font-size: 15px;
  cursor: pointer;
  touch-action: manipulation;

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255,255,255,0.22);
  }

  &:active {
    transform: scale(0.94);
  }
`;
