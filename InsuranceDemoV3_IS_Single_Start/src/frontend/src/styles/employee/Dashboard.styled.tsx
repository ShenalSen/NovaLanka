import styled from 'styled-components';

export const DashboardContainer = styled.div`
  padding: 24px;
  background: #f8fafc;
  min-height: calc(100vh - 64px);
`;

export const StatCardGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  @media (min-width: 992px) {
    flex-direction: row;
    max-width: none;
    margin: 0;
    gap: 32px;
  }
`;

export const StatCard = styled.div<{ bg?: string }>`
  flex: 1 1 0;
  background: ${props => props.bg || '#fff'};
  border-radius: 18px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
  border: 6.5px solidrgb(143, 143, 143); 
  padding: 18px 18px 18px 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  position: relative;
  transition: box-shadow 0.2s;
  min-height: 140px;
  &:hover {
    box-shadow: 0 6px 32px rgba(34,197,94,0.15);
  }
`;

export const StatInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const StatIcon = styled.div<{ bg: string }>`
  width: 56px;
  height: 56px;
  background: ${props => props.bg};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 28px;
  margin-bottom: 16px;
  box-shadow: 0 4px 16px rgba(34,197,94,0.10);
`;

export const StatLabel = styled.div`
  color:#1f2937;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 6px;
  letter-spacing: 0.5px;
`;

export const StatValue = styled.div`
  color: #262626;
  font-size: 3.2rem;
  font-weight: 900;
  letter-spacing: 1px;
  line-height: 1;
  text-shadow: 1px 2px 0 #fff, 2px 4px 8px rgba(0,0,0,0.10);
  margin-left: 24px;
  @media (max-width: 600px) {
    font-size: 2.8rem;
    margin-left: 12px;
  }
`;

export const PortalSection = styled.div`
  background: linear-gradient(90deg,rgb(219, 204, 232) 0%, #ede9fe 100%);
  border-radius: 18px;
  box-shadow: 0 4px 16px 0 rgba(139,92,246,0.08);
  padding: 14px 32px;
  margin-bottom: 36px;
  margin-top: 48px; 
  font-size: 17px;
  font-weight: 600;
  color:rgb(0, 0, 0);
  display: flex;
  align-items: center;
`;

export const PortalSectionadmin = styled.div`
  background: linear-gradient(90deg,rgb(219, 204, 232) 0%, #ede9fe 100%);
  border-radius: 18px;
  box-shadow: 0 4px 16px 0 rgba(139,92,246,0.08);
  padding: 14px 32px;
  margin-bottom: 36px;
  font-size: 17px;
  font-weight: 600;
  color:rgb(0, 0, 0);
  display: flex;
  align-items: center;
`;
