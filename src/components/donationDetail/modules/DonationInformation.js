import React from 'react';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import DonationInformationHeader from '../../postDetails/PostDetailsHeader';
import { Badge, Stack, Text, Heading } from '@kiwicom/orbit-components/lib';
import { donations } from '@constants/postType';
import Separator from '@kiwicom/orbit-components/lib/Separator';
import Grid from '@kiwicom/orbit-components/lib/utils/Grid';
import styled, { css } from 'styled-components';
import { getFormattedDate } from '@api/time';
import { donationItemConditionIconPath, donationDimensionIconPath } from '@constants/imagePaths';
import { colors } from '@constants/colors';

const ValidPeriodContainer = styled.div`
  padding-left: 20px;
  padding-right: 20px;
`;

const LocationContainer = styled.div`
  padding-left: 20px;
  padding-right: 20px;
  border-left: 1px solid ${colors.separator.background};
  height: 100%;
`;

const DonationDescriptionContainer = styled.div`
  min-height: 100px;
  ${media.desktop(css`
    min-height: 160px;
  `)};
`;

const DimensionTextContainer = styled.div`
  word-break: break-word;
`;

const BadgeWrapper = styled.div`
  margin-bottom: 8px !important;
`;

const TitleTextContainer = styled.div`
  word-break: break-word;
`;

const DescriptionTextContainer = styled.div`
  word-break: break-word;
`;

const DonationInformation = ({
  loginUserId,
  loginUserType,
  donationUserId,
  donationUserName,
  profileImageUrl,
  donationId,
  title,
  description,
  status,
  dimensions,
  itemCondition,
  validPeriodFrom,
  validPeriodTo,
  locations,
  categoryTags,
}) => {
  const CategoryTags = () => {
    return categoryTags.map((category) => {
      return (
        <BadgeWrapper key={category}>
          <Badge>{category}</Badge>
        </BadgeWrapper>
      );
    });
  };

  const ValidPeriod = () => {
    return (
      <ValidPeriodContainer>
        <Text spaceAfter="normal">Valid Period</Text>
        <Text align="center">
          {getFormattedDate(validPeriodFrom)} to {getFormattedDate(validPeriodTo)}
        </Text>
      </ValidPeriodContainer>
    );
  };

  const Locations = () => {
    return (
      <LocationContainer>
        <Text spaceAfter="normal">Nearest MRT/LRT</Text>
        <Text align="center">{locations.map((location) => location.name).join(', ')}</Text>
      </LocationContainer>
    );
  };

  const ItemCondition = () => {
    return (
      <Stack direction="row" align="center">
        <img src={donationItemConditionIconPath} height="24px" />
        <Text uppercase>{itemCondition}</Text>
      </Stack>
    );
  };

  const Dimension = () => {
    return (
      <Stack direction="row" align="center">
        <img src={donationDimensionIconPath} height="24px" />
        <DimensionTextContainer>
          <Text>{dimensions === '' ? 'Not provided' : dimensions}</Text>
        </DimensionTextContainer>
      </Stack>
    );
  };

  const DonationDescription = () => {
    return (
      <DonationDescriptionContainer>
        <Stack direction="column" spacing="loose">
          <Stack>
            <TitleTextContainer>
              <Heading type="title2">{title}</Heading>
            </TitleTextContainer>
            <DescriptionTextContainer>
              <pre>
                <Text>{description}</Text>
              </pre>
            </DescriptionTextContainer>
          </Stack>
          <Stack direction="row" wrap="true">
            <CategoryTags />
          </Stack>
        </Stack>
      </DonationDescriptionContainer>
    );
  };

  const DonationInformationBody = () => {
    return (
      <Stack direction="column" spacing="natural">
        <Stack>
          <Separator />
          <Grid columns="1fr 1fr">
            <ValidPeriod />
            <Locations />
          </Grid>
          <Separator />
        </Stack>
        <Stack direction="column" spacing="condensed">
          <ItemCondition />
          <Dimension />
        </Stack>
        <DonationDescription />
      </Stack>
    );
  };

  return (
    <Stack spaceAfter="largest">
      <DonationInformationHeader
        loginUserId={loginUserId}
        loginUserType={loginUserType}
        postUserId={donationUserId}
        postUserName={donationUserName}
        profileImageUrl={profileImageUrl}
        postId={donationId}
        postStatus={status}
        postType={donations}
      />
      <DonationInformationBody />
    </Stack>
  );
};

export default DonationInformation;
