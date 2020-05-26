import React from 'react';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import styled, { css } from 'styled-components';
import { Badge, Stack, Text, Heading } from '@kiwicom/orbit-components/lib';
import WishInformationHeader from '../../postDetails/PostDetailsHeader';

const WishInformationBodyContainer = styled.div`
  min-height: 100px;
  ${media.desktop(css`
    min-height: 250px;
  `)};
`;

const WishInformation = ({
  loginUserId,
  wishUserId,
  wishUserName,
  profileImageUrl,
  orgName,
  wishId,
  title,
  description,
  status,
  categoryTags,
}) => {
  const CategoryTags = () => {
    return categoryTags.map((category) => {
      return <Badge key={category}>{category}</Badge>;
    });
  };

  const WishInformationBody = () => {
    return (
      <WishInformationBodyContainer>
        <Stack direction="column" spacing="loose">
          <Stack>
            <Heading type="title2">{title}</Heading>
            <Text>{description}</Text>
          </Stack>
          <Stack direction="row">
            <CategoryTags />
          </Stack>
        </Stack>
      </WishInformationBodyContainer>
    );
  };

  return (
    <Stack spaceAfter="largest">
      <WishInformationHeader
        loginUserId={loginUserId}
        postUserId={wishUserId}
        postUserName={wishUserName}
        profileImageUrl={profileImageUrl}
        orgName={orgName}
        postId={wishId}
        postStatus={status}
        postType="wish"
      />
      <WishInformationBody />
    </Stack>
  );
};

export default WishInformation;