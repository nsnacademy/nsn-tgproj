import styled from 'styled-components';

/* ======================
   BASE
====================== */
export const SafeArea = styled.div`
  min-height: 100vh;
  background: #000;
  color: #fff;
  display: flex;
  flex-direction: column;
  padding-bottom: 100px;
  position: relative;
  overflow: hidden;
`;

export const LoadingState = styled.div`
  text-align: center;
  padding: 60px 20px;
  font-size: 14px;
  opacity: 0.6;
`;

/* ======================
   HEADER
====================== */
export const Header = styled.div`
  padding: 70px 20px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  background: #000;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

export const BackButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
  border: none;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    transform: translateX(-2px);
  }
`;

export const HeaderTitle = styled.div`
  flex: 1;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.3;
`;

/* ======================
   CONTENT
====================== */
export const Content = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

/* ======================
   REPORT CARD
====================== */
export const ReportCard = styled.div`
  background: rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

export const TodayDate = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const DateLabel = styled.div`
  font-size: 12px;
  opacity: 0.5;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const StatusBadge = styled.div<{
  $status: 'none' | 'pending' | 'approved' | 'rejected';
}>`

  display: inline-block;
  font-size: 12px;
  padding: 8px 14px;
  border-radius: 12px;
  background: ${({ $status }) => {
  switch ($status) {
    case 'approved': return 'rgba(76, 175, 80, 0.15)';
    case 'pending': return 'rgba(255, 193, 7, 0.15)';
    case 'rejected': return 'rgba(255, 80, 80, 0.15)';
    default: return 'rgba(255, 255, 255, 0.08)';
  }
}};

  color: ${({ $status }) => {
  switch ($status) {
    case 'approved': return '#4CAF50';
    case 'pending': return '#FFC107';
    case 'rejected': return '#ff6b6b';
    default: return 'rgba(255, 255, 255, 0.7)';
  }
}};

  border: 1px solid ${({ $status }) => {
  switch ($status) {
    case 'approved': return 'rgba(76, 175, 80, 0.3)';
    case 'pending': return 'rgba(255, 193, 7, 0.3)';
    case 'rejected': return 'rgba(255, 80, 80, 0.3)';
    default: return 'rgba(255, 255, 255, 0.1)';
  }
}};

`;

export const SuccessMessage = styled.div`
  margin-top: 12px;
  font-size: 13px;
  padding: 10px 14px;
  border-radius: 10px;
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid rgba(76, 175, 80, 0.2);
  color: #4CAF50;
  display: flex;
  align-items: center;
  gap: 8px;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
`;

/* ======================
   SECTIONS
====================== */
export const Section = styled.div`
  background: rgba(255, 255, 255, 0.04);
  border-radius: 18px;
  padding: 18px;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

export const SectionHeader = styled.div`
  margin-bottom: 20px;
`;

export const SectionTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  opacity: 0.95;
  margin-bottom: 4px;
`;

export const SectionSubtitle = styled.div`
  font-size: 12px;
  opacity: 0.5;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

/* ======================
   INPUTS
====================== */
export const InputField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const InputLabel = styled.div`
  font-size: 14px;
  font-weight: 500;
  opacity: 0.8;
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const MetricLabel = styled.span`
  font-size: 12px;
  opacity: 0.6;
  font-weight: 400;
`;

export const InputWrapper = styled.div`
  position: relative;
`;

export const Input = styled.input<{ $hasValue?: boolean }>`
  width: 100%;
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid ${({ $hasValue }) => 
    $hasValue ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 12px;
  color: #fff;
  font-size: 16px;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.4);
    background: rgba(255, 255, 255, 0.1);
  }
  
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #fff;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.4);
    background: rgba(255, 255, 255, 0.1);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

/* ======================
   PROOF SECTION
====================== */
export const ProofSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ProofGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
`;

export const ProofItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
`;

export const ProofIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ProofText = styled.div`
  font-size: 12px;
  opacity: 0.7;
  text-align: center;
`;

/* ======================
   FILE UPLOAD
====================== */
export const FileUpload = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px dashed rgba(255, 255, 255, 0.2);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

export const UploadIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const UploadText = styled.div`
  font-size: 14px;
  opacity: 0.8;
  flex: 1;
`;

export const FileInput = styled.input`
  display: none;
`;

export const FilePreview = styled.div`
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const FileItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
`;

export const FileName = styled.div`
  font-size: 13px;
  opacity: 0.8;
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const FileRemove = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.08);
  border: none;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
  }
`;

/* ======================
   CONFIRMATION
====================== */
export const ConfirmationCard = styled.div`
  padding: 20px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
`;

export const CheckboxRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
`;

export const Checkbox = styled.div<{ $checked: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 8px;
  background: ${({ $checked }) => 
    $checked ? '#fff' : 'rgba(255, 255, 255, 0.1)'};
  border: 2px solid ${({ $checked }) => 
    $checked ? '#fff' : 'rgba(255, 255, 255, 0.2)'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
`;

export const CheckboxLabel = styled.div`
  flex: 1;
`;

export const CheckboxText = styled.div<{ $checked: boolean }>`
  font-size: 14px;
  color: ${({ $checked }) => 
    $checked ? '#fff' : 'rgba(255, 255, 255, 0.7)'};
  font-weight: ${({ $checked }) => $checked ? '500' : '400'};
  line-height: 1.4;
`;

/* ======================
   FOOTER
====================== */
export const Footer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px 20px 24px;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  z-index: 900;
`;

export const PrimaryButton = styled.button<{ $variant?: 'simple' | 'result' }>`
  width: 100%;
  height: 56px;
  border-radius: 16px;
  border: none;
  background: ${({ $variant }) => 
    $variant === 'result' 
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      : '#fff'};
  color: ${({ $variant }) => 
    $variant === 'result' ? '#fff' : '#000'};
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.4);
    background: ${({ $variant }) => 
      $variant === 'result' 
        ? 'linear-gradient(135deg, #5a6fd8 0%, #6a4191 100%)'
        : 'rgba(255, 255, 255, 0.95)'};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const DisabledButton = styled(PrimaryButton)`
  opacity: 0.6;
  cursor: not-allowed;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);

  &:hover {
    transform: none;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    background: rgba(255, 255, 255, 0.1);
  }
`;