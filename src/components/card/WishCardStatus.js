import React from 'react';
import { colors } from '../../../utils/constants/colors';
import styled from 'styled-components';
import { COMPLETED, CLOSED } from '../../../utils/constants/postStatus';

const CardStatusContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const CardStatusWrapper = styled.div`
  display: flex;
  background-color: ${(props) => getColor(props.status)};
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 15px;
  padding-right: 15px;
  color: white;
`;

const getColor = (status) => {
  switch (status) {
    case COMPLETED:
      return colors.completedTagBackground;
    case CLOSED:
      return colors.closedTagBackground;
    default:
      return 'black';
  }
};
const CardStatus = ({ status }) => {
  return (
    <CardStatusContainer>
      <CardStatusWrapper status={status}>{status.toUpperCase()}</CardStatusWrapper>
    </CardStatusContainer>
  );
};

export default CardStatus;