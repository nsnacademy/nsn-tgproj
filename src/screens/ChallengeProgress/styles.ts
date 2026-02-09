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
  padding: 16px 20px;
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

export const HeaderTitle = styled.div`
  flex: 1;
  font-size: 18px;
  font-weight: 600;
`;

export const RatingTag = styled.div`
  font-size: 12px;
  opacity: 0.6;
`;

export const Content = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

export const ProgressBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ProgressBar = styled.div`
  height: 8px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  overflow: hidden;
`;

export const ProgressFill = styled.div`
  height: 100%;
  background: #fff;
`;

export const ProgressMainText = styled.div`
  font-size: 15px;
`;

export const ProgressSubText = styled.div`
  font-size: 13px;
  opacity: 0.45;
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const SectionTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  opacity: 0.8;
`;

export const ConditionList = styled.ul`
  padding-left: 16px;
  margin: 0;
`;

export const ConditionItem = styled.li`
  font-size: 14px;
  opacity: 0.7;
`;

export const ParticipantsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
`;

export const ParticipantIcon = styled.span`
  opacity: 0.7;
`;

export const RatingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const RatingItem = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
`;

export const ActionBlock = styled.div`
  padding: 20px;
  margin-top: auto;
`;

export const PrimaryButton = styled.button`
  width: 100%;
  height: 48px;
  border-radius: 14px;
  background: #fff;
  color: #000;
  font-size: 16px;
  font-weight: 600;
  border: none;
`;

export const DisabledButton = styled(PrimaryButton)`
  opacity: 0.4;
`;
