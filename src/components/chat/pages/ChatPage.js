import React, { useState, useEffect } from 'react';
import { Grid, Stack } from '@kiwicom/orbit-components/lib';
import ListOfChats from '../modules/ListOfChats';
import ChatDialog from '../modules/ChatDialog';
import api from '../../../../utils/api';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import { EMAIL_BAR_HEIGHT, NAVBAR_HEIGHT } from '../../../../utils/constants/navbar';
import useMediaQuery from '@kiwicom/orbit-components/lib/hooks/useMediaQuery';

const NoChatsContainer = styled.div`
  margin: 0 auto;
  margin-top: 40vh;
  width: fit-content;
`;

const ChatPage = ({ user, postId, postType, isViewingChatsForMyPost }) => {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [isNewChat, setIsNewChat] = useState(false);
  const [hasNoChatForOwnPost, setHasNoChatForOwnPost] = useState(true);

  useEffect(() => {
    // only get chats for post if postId query is given
    if (postId) {
      api.chats.getChatsForPost(postId).then((rawChats) => {
        // sometimes getChatsForPost does not finish executing
        setIsNewChat(rawChats.docs.length === 0);

        // if viewing own chats for a specific post and the post have no chat
        if (isViewingChatsForMyPost && rawChats.docs.length === 0) {
          setHasNoChatForOwnPost(true);
        } else {
          setHasNoChatForOwnPost(false);
        }

        // if you are continue-ing to chat with a post that is not yours, automatically select chat and show
        // the messsages
        if (!isViewingChatsForMyPost && rawChats.docs.length > 0) {
          setSelectedChatId(rawChats.docs[0].data().chatId);
        }
      });
    } else {
      setHasNoChatForOwnPost(false);
    }
  }, []);

  const { isTablet } = useMediaQuery();
  const navBarConstant = isTablet ? 'DESKTOP' : 'MOBILE';
  const navBarOffsetHeight = user
    ? user.user.emailVerified
      ? NAVBAR_HEIGHT[navBarConstant]
      : NAVBAR_HEIGHT[navBarConstant] + EMAIL_BAR_HEIGHT[navBarConstant]
    : NAVBAR_HEIGHT[navBarConstant];

  const gridContainerStyle = {
    height: `calc(100vh - ${navBarOffsetHeight}px)`,
    width: '100vw',
  };

  const ChatPageTabletAndDesktop = () => {
    return (
      <Grid style={gridContainerStyle} columns="1fr 3fr">
        <ListOfChats
          user={user}
          setSelectedChatId={setSelectedChatId}
          isNewChat={isNewChat}
          postId={postId}
          postType={postType}
          isViewingChatsForMyPost={isViewingChatsForMyPost}
        />
        <ChatDialog
          loggedInUser={user}
          selectedChatId={selectedChatId}
          setSelectedChatId={setSelectedChatId}
          navBarHeight={navBarOffsetHeight}
          isNewChat={isNewChat}
          setIsNewChat={setIsNewChat}
          postId={postId}
          postType={postType}
        />
      </Grid>
    );
  };

  const ChatPageMobile = () => {
    return (
      <Grid style={gridContainerStyle} columns="1fr">
        {selectedChatId == null ? (
          <ListOfChats
            user={user}
            setSelectedChatId={setSelectedChatId}
            isNewChat={isNewChat}
            postId={postId}
            postType={postType}
            isViewingChatsForMyPost={isViewingChatsForMyPost}
          />
        ) : (
          <ChatDialog
            loggedInUser={user}
            selectedChatId={selectedChatId}
            setSelectedChatId={setSelectedChatId}
            navBarHeight={navBarOffsetHeight}
            isNewChat={isNewChat}
            setIsNewChat={setIsNewChat}
            postId={postId}
            postType={postType}
          />
        )}
      </Grid>
    );
  };

  if (hasNoChatForOwnPost && isViewingChatsForMyPost) {
    return <NoChatsContainer>No chats for this post yet.</NoChatsContainer>;
  }

  return isTablet ? <ChatPageTabletAndDesktop /> : <ChatPageMobile />;
};

export default ChatPage;
