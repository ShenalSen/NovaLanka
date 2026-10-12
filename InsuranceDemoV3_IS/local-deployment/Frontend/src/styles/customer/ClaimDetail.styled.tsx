import styled from 'styled-components';

export const PageContainer = styled.div`
  padding: 32px;
  background-color: #f5f7fb;
  min-height: calc(100vh - 64px);
`;

export const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

export const BackButton = styled.button`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  color: #6C5CE7;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 10px 16px;
  margin-bottom: 24px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
  
  &:hover {
    background-color: #f8f7ff;
    border-color: #d8d4f7;
    box-shadow: 0 3px 8px rgba(108, 92, 231, 0.1);
    transform: translateY(-1px);
  }
`;

export const ClaimDetailCard = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin-bottom: 32px;
`;

export const ClaimHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 16px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const ClaimTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
  padding-bottom: 8px;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 40px;
    height: 3px;
    background: #6C5CE7;
    border-radius: 2px;
  }
`;

export const ProgressTracker = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin: 48px 0;
  position: relative;
  padding: 0 40px;
`;

export const ProgressLine = styled.div`
  position: absolute;
  top: 24px;
  left: 40px;
  right: 40px;
  height: 4px;
  background: linear-gradient(to right, rgba(108, 92, 231, 0.1), rgba(108, 92, 231, 0.1));
  border-radius: 4px;
  z-index: 0;
`;

export const ProgressActiveLine = styled.div<{ progress: number }>`
  position: absolute;
  top: 24px;
  left: 40px;
  height: 4px;
  width: ${props => props.progress}%;
  background: linear-gradient(to right, #6C5CE7, #4CD964);
  border-radius: 4px;
  z-index: 1;
  transition: width 0.5s ease;
  box-shadow: 0 2px 4px rgba(76, 217, 100, 0.2);
`;

export const ProgressPoint = styled.div<{ status: 'completed' | 'current' | 'pending', $specialStatus?: 'Approved' | 'Declined' | 'Closed' | null }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
  font-size: 20px;
  font-weight: 600;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 3px solid transparent;
    ${props => {
    if (props.$specialStatus === 'Declined' && props.status === 'current') {
      return `
        background: white;
        color: #FF3B30;
        border-color: #FF3B30;
        transform: scale(1.05);
        box-shadow: 
          0 8px 20px rgba(255, 59, 48, 0.15),
          0 2px 5px rgba(255, 59, 48, 0.1);
      `;
    } else if (props.$specialStatus === 'Approved' && props.status === 'current') {
      return `
        background: white;
        color: #4CD964;
        border-color: #4CD964;
        transform: scale(1.05);
        box-shadow: 
          0 8px 20px rgba(76, 217, 100, 0.15),
          0 2px 5px rgba(76, 217, 100, 0.1);
      `;
    } else if (props.$specialStatus === 'Closed') {
      return `
        background: linear-gradient(145deg, #45c259, #53e277);
        color: white;
        transform: scale(1);
        box-shadow: 
          0 6px 15px rgba(76, 217, 100, 0.2),
          0 2px 5px rgba(76, 217, 100, 0.1),
          inset 0 -2px 5px rgba(0, 0, 0, 0.1);
      `;
    } else if (props.status === 'completed') {
      return `
        background: linear-gradient(145deg, #45c259, #53e277);
        color: white;
        transform: scale(1);
        box-shadow: 
          0 6px 15px rgba(76, 217, 100, 0.2),
          0 2px 5px rgba(76, 217, 100, 0.1),
          inset 0 -2px 5px rgba(0, 0, 0, 0.1);
      `;
    } else if (props.status === 'current') {
      return `
        background: white;
        color: #6C5CE7;
        border-color: #6C5CE7;
        transform: scale(1.05);
        box-shadow: 
          0 8px 20px rgba(108, 92, 231, 0.15),
          0 2px 5px rgba(108, 92, 231, 0.1);
      `;
    } else {
      return `
        background: #f9f9f9;
        color: #a0a0a0;
        border-color: #e8e8e8;
        box-shadow: 
          0 3px 8px rgba(0, 0, 0, 0.05),
          inset 0 1px 1px rgba(255, 255, 255, 0.8);
      `;
    }
  }}
    & svg {
    animation: ${props => props.status === 'completed' || props.$specialStatus === 'Closed' ? 'checkmark 0.5s ease-in-out forwards' : 'none'};
  }
  
  @keyframes checkmark {
    0% {
      transform: scale(0);
      opacity: 0;
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

export const ProgressLabel = styled.div<{ status: 'completed' | 'current' | 'pending', $specialStatus?: 'Closed' | null }>`
  font-size: 14px;
  color: ${props => props.status === 'current' ? '#6C5CE7' : 
    props.status === 'completed' || props.$specialStatus === 'Closed' ? '#333' : '#999'};
  text-align: center;
  width: 110px;
  margin-top: 12px;
  font-weight: ${props => props.status === 'current' || props.$specialStatus === 'Closed' ? '600' : '500'};
`;

export const ProgressContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 3;
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  margin-top: 48px;
`;

export const Card = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 24px;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid rgba(0, 0, 0, 0.04);
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  }
`;

export const CardTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #6C5CE7;
  margin: 0 0 16px 0;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f7;
`;

export const CardContent = styled.div`
  flex: 1;
`;

export const DataRow = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const DataLabel = styled.div`
  flex: 0 0 40%;
  font-size: 14px;
  color:rgb(81, 29, 204);
  font-weight: 600;
`;

export const DataValue = styled.div`
  flex: 0 0 60%;
  font-size: 15px;
  color: #333;
  font-weight: 500;
  word-break: break-word;
`;

export const SummaryCard = styled(Card)`
  grid-column: 1 / -1;
  background: linear-gradient(145deg, #f9f9ff,rgb(252, 252, 255));
`;

export const StatusBadge = styled.span<{ status: string }>`
  padding: 6px 12px;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
  display: inline-block;
  
  ${props => {
    switch (props.status) {
      case 'Submitted':
        return `
          background-color: #e5f0fd;
          color: #2d7bf4;
          border: 1px solid #c5dcfa;
        `;
      case 'Under Review':
        return `
          background-color: #fff2d9;
          color: #ffa000;
          border: 1px solid #ffe4ad;
        `;
      case 'Decision Made':
        return `
          background-color: #e5f6fd;
          color: #03a9f4;
          border: 1px solid #c5e9fa;
        `;
      case 'Payment Processing':
        return `
          background-color: #e5f8f6;
          color: #00bcd4;
          border: 1px solid #c5eee9;
        `;
      case 'Approved':
        return `
          background-color: #e5f8e9;
          color: #4cd964;
          border: 1px solid #c5eecf;
        `;
      case 'Declined':
        return `
          background-color: #fde7e5;
          color: #ff3b30;
          border: 1px solid #facbc5;
        `;
      case 'Closed':
        return `
          background-color: #f1eff8;
          color: #6c5ce7;
          border: 1px solid #e0ddf2;
        `;
      default:
        return `
          background-color: #f0f0f0;
          color: #666;
          border: 1px solid #ddd;
        `;
    }
  }}
`;

export const CardDescription = styled.p`
  font-size: 15px;
  line-height: 1.6;
  color: #333;
  margin: 0;
`;

export const Icon = styled.span`
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
