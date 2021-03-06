import React from 'react';
import { colors } from '@constants/colors';
import styled from 'styled-components';
import { COMPLETED, CLOSED } from '@constants/postStatus';

const CardStatusContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  background-color: ${(props) => getColor(props.status)};
  width: 100%;
  position: absolute;
  bottom: 0;
`;

const CardStatusWrapper = styled.div`
  display: flex;
  padding-left: 15px;
  padding-top: 5px;
  padding-bottom: 5px;
  color: white;
  flex: auto;
`;

const getColor = (status) => {
  switch (status) {
    case COMPLETED:
      return colors.primaryTeal.background;
    case CLOSED:
      return colors.primaryRed.background;
    default:
      return 'black';
  }
};
const CardStatus = ({ status }) => {
  return (
    <CardStatusContainer status={status}>
      <CardStatusWrapper>{status.toUpperCase()}</CardStatusWrapper>
    </CardStatusContainer>
  );
};

export default CardStatus;
