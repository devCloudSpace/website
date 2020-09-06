import React from 'react';
import { useSelector } from 'react-redux';
import { getCurrentPage } from '../selectors';
import { LANDING, NPO_REGISTER, DONOR_REGISTER, NPO_DETAILS } from '@utils/SubPages';

import RegisterLanding from '../modules/RegisterLanding';
import RegisterNpoOrganization from '../modules/RegisterNpoOrganization';
import RegisterNpoDetails from '../modules/RegisterNpoDetails';
import RegisterDonor from '../modules/RegisterDonor';

import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import styled, { css } from 'styled-components';

import dynamic from 'next/dynamic';
const RegisterBackground = dynamic(() => import('../modules/RegisterBackground'), { ssr: false });

const Wrapper = styled.div`
  display: flex;
  box-sizing: border-box;

  ${media.largeMobile(css`
    height: 100vh;
  `)};
`;

const Container = styled.div`
  display: flex;
  flex: 1;
  box-sizing: border-box;
  flex-direction: column;

  ${media.largeMobile(css`
    flex-direction: row;
  `)};
`;

const RightPanel = styled.div`
  padding: 30px 12px;
  flex-basis: 60%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;

  ${media.largeMobile(css`
    padding: 80px 4% 20px;
    overflow-x: hidden;
    overflow-y: scroll;
  `)};
`;

const RegisterPage = (props, state) => {
  const currentPage = useSelector(getCurrentPage);

  function rightRegister(currentPage) {
    switch (currentPage) {
      case LANDING:
        return <RegisterLanding />;
      case NPO_REGISTER:
        return <RegisterNpoOrganization />;
      case DONOR_REGISTER:
        return <RegisterDonor />;
      case NPO_DETAILS:
        return <RegisterNpoDetails />;
      default:
        return <RegisterLanding />;
    }
  }

  return (
    <Wrapper>
      <Container>
        <RegisterBackground />
        <RightPanel>{rightRegister(currentPage)}</RightPanel>
      </Container>
    </Wrapper>
  );
};

export default RegisterPage;
