import React, { useState, useEffect } from 'react';
import ProfileAvatar from '../imageContainers/ProfileAvatar';
import ReportPostModal from '../modal/ReportPostModal';
import ClosePostModal from '../modal/ClosePostModal';
import SharePostModal from '../modal/SharePostModal';
import ChatButton from '../buttons/ChatButton';
import Verified from '../session/modules/Verified';
import api from '@api';
import {
  AlertCircle,
  Edit,
  CloseCircle,
  MenuKebab,
  ShareAndroid,
  FlightNomad,
} from '@kiwicom/orbit-components/lib/icons';
import { Button, Stack, Text, Popover, ButtonLink } from '@kiwicom/orbit-components/lib';
import { useRouter } from 'next/router';
import { COMPLETED, CLOSED } from '@constants/postStatus';
import { donations, wishes } from '@constants/postType';
import { donor, npo } from '@constants/userType';
import { colors } from '@constants/colors';
import { logStartChatToAnalytics } from '@utils/analytics';
import styled from 'styled-components';
import { clickedOnStartChatWithDonation, clickedOnStartChatWithWish } from '@utils/algolia/insights';
import useUser from '@components/session/modules/useUser';

const AvatarDetailsContainer = styled.div`
  position: relative;
`;

const ClickableProfile = styled.a`
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 1;
`;

const PostDetailsHeader = ({
  loginUserId,
  loginUserType,
  postUserId,
  postUserName,
  profileImageUrl,
  npoOrgName,
  postId,
  postStatus,
  postType,
}) => {
  const router = useRouter();
  const isOwnPost = loginUserId === postUserId; // whether login user is the post owner
  const isPostTypeSameAsUserType =
    (postType === donations && loginUserType === donor) || (postType === wishes && loginUserType === npo);
  const chatType = isOwnPost ? 'View Chats' : 'Chat';
  const postUrl = `https://www.giftforgood.io${router.asPath}`;
  const profileHref = `/profile/${postUserId}`;
  const isCompletedPost = postStatus === COMPLETED;

  const [isClosedPost, setIsClosedPost] = useState(postStatus === CLOSED);
  const [showReportPostModal, setShowPostPostModal] = useState(false);
  const [showClosePostModal, setShowClosePostModal] = useState(false);
  const [showSharePostModal, setShowSharePostModal] = useState(false);

  const userObject = useUser();

  const handleReportPostModal = () => {
    if (showReportPostModal) {
      setShowPostPostModal(false);
    } else {
      setShowPostPostModal(true);
    }
  };

  const handleClosePostModal = () => {
    if (showClosePostModal) {
      setShowClosePostModal(false);
    } else {
      setShowClosePostModal(true);
    }
  };

  const handleSharePostModal = () => {
    if (showSharePostModal) {
      setShowSharePostModal(false);
    } else {
      setShowSharePostModal(true);
    }
  };

  const handleOnClickChatBtn = (event) => {
    event.preventDefault();
    let destination = `/chat?postId=${postId}&postType=${postType}`;
    if (chatType === 'Chat') {
      logStartChatToAnalytics();
      if (postType === donations) {
        clickedOnStartChatWithDonation(userObject, postId);
      } else {
        clickedOnStartChatWithWish(userObject, postId);
      }
      api.chats.getChatsForPost(postId).then((rawChats) => {
        if (rawChats.docs.length > 0) {
          // assumption: can only have one chat for a post that is not yours,
          // bring user to the chat being selected
          destination = `/chat?chatId=${rawChats.docs[0].data().chatId}`;
        }
        router.push(destination);
      });
    } else {
      router.push(destination);
    }
  };

  const handleOnClickShareBtn = () => {
    // Sharing for mobile, safari desktop browser on https
    if (navigator.share) {
      navigator
        .share({
          text: postUrl,
        })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
      // For those that do not support navigator.share, e.g. Chrome desktop browser
      handleSharePostModal();
    }
  };

  const PopoverContent = ({ isDisabled }) => {
    const editPostHref = `/${postType}/edit?id=${postId}`;
    return (
      <>
        {showReportPostModal ? (
          <ReportPostModal
            postId={postId}
            postType={postType}
            loginUserId={loginUserId}
            onClose={handleReportPostModal}
          />
        ) : null}
        {showClosePostModal ? (
          <ClosePostModal
            postId={postId}
            postType={postType}
            onClose={handleClosePostModal}
            setIsClosedPost={setIsClosedPost}
          />
        ) : null}
        <Popover
          content={
            <Stack>
              {isOwnPost ? (
                <Stack direction="column" spacing="extraTight">
                  <ButtonLink
                    transparent
                    type="secondary"
                    iconLeft={<Edit />}
                    href={editPostHref}
                    disabled={isDisabled || isClosedPost || isCompletedPost}
                  >
                    Edit post
                  </ButtonLink>
                  {postType === wishes && (
                    <ButtonLink
                      type="secondary"
                      transparent
                      iconLeft={<FlightNomad />}
                      href={`/wishes/create?wishId=${postId}`}
                    >
                      Duplicate Wish
                    </ButtonLink>
                  )}
                  <ButtonLink
                    transparent
                    type="secondary"
                    iconLeft={<CloseCircle />}
                    onClick={handleClosePostModal}
                    disabled={isDisabled || isClosedPost || isCompletedPost}
                  >
                    Mark as closed
                  </ButtonLink>
                </Stack>
              ) : (
                <ButtonLink
                  transparent
                  type="secondary"
                  iconLeft={<AlertCircle />}
                  onClick={handleReportPostModal}
                  disabled={isDisabled || isClosedPost || isCompletedPost || true}
                >
                  Report post
                </ButtonLink>
              )}
            </Stack>
          }
          preferredAlign="end"
        >
          <Button size="small" type="secondary" iconLeft={<MenuKebab />}></Button>
        </Popover>
      </>
    );
  };

  const AvatarDetails = () => {
    return (
      <Stack align="center" direction="row" spacing="condensed" shrink>
        <AvatarDetailsContainer>
          <Stack align="center" direction="row" spacing="condensed" shrink>
            <ProfileAvatar imageUrl={profileImageUrl.small || profileImageUrl.raw} />
            <Stack direction="column" shrink spacing="none" space>
              <Text>{postUserName}</Text>
              {postType === wishes && <Text>{npoOrgName}</Text>}
            </Stack>
          </Stack>
          <ClickableProfile href={profileHref} />
        </AvatarDetailsContainer>
      </Stack>
    );
  };

  const Buttons = () => {
    return (
      <Stack align="center" inline justify="center" spacing="condensed">
        <Verified>
          {({ isDisabled }) => {
            return (
              <>
                <Button
                  disabled={
                    isDisabled ||
                    (!isOwnPost && isPostTypeSameAsUserType) ||
                    (chatType === 'Chat' && (isClosedPost || isCompletedPost))
                      ? true
                      : false
                  }
                  size="small"
                  asComponent={ChatButton}
                  onClick={handleOnClickChatBtn}
                  width="150px"
                >
                  {chatType}
                </Button>
                {showSharePostModal ? (
                  <SharePostModal
                    postId={postId}
                    postUrl={postUrl}
                    postType={postType}
                    onClose={handleSharePostModal}
                  />
                ) : null}
                <Button
                  size="small"
                  type="secondary"
                  iconLeft={<ShareAndroid />}
                  onClick={handleOnClickShareBtn}
                ></Button>
                <PopoverContent isDisabled={isDisabled} />
              </>
            );
          }}
        </Verified>
      </Stack>
    );
  };

  return (
    <Stack largeDesktop={{ align: 'center', direction: 'row', justify: 'between', shrink: true }} direction="column">
      <AvatarDetails />
      <Buttons />
    </Stack>
  );
};

export default PostDetailsHeader;
