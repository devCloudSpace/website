import React, { useState, useEffect } from 'react';
import { Grid } from '@kiwicom/orbit-components/lib';
import ListOfChats from '../modules/ListOfChats';
import ChatDialog from '../modules/ChatDialog';
import api from '../../../../utils/api';
import Error from 'next/error';
import styled from 'styled-components';
import { EMAIL_BAR_HEIGHT, NAVBAR_HEIGHT } from '../../../../utils/constants/navbar';
import useMediaQuery from '@kiwicom/orbit-components/lib/hooks/useMediaQuery';

const NoChatsContainer = styled.div`
  margin: 0 auto;
  margin-top: 40vh;
  width: fit-content;
`;

const ChatPageTabletAndDesktop = ({
  user,
  selectedChatId,
  setSelectedChatId,
  postId,
  postType,
  isNewChat,
  setIsNewChat,
  isViewingChatsForMyPost,
  navBarHeight,
  gridContainerStyle,
}) => {
  return (
    <Grid style={gridContainerStyle} columns="1fr 3fr">
      <ListOfChats
        user={user}
        selectedChatId={selectedChatId}
        setSelectedChatId={setSelectedChatId}
        postId={postId}
        isCreatingNewChat={isNewChat}
        isViewingChatsForMyPost={isViewingChatsForMyPost}
      />
      <ChatDialog
        loggedInUser={user}
        selectedChatId={selectedChatId}
        setSelectedChatId={setSelectedChatId}
        navBarHeight={navBarHeight}
        isNewChat={isNewChat}
        setIsNewChat={setIsNewChat}
        postId={postId}
        postType={postType}
      />
    </Grid>
  );
};

const ChatPageMobile = ({
  user,
  selectedChatId,
  setSelectedChatId,
  postId,
  postType,
  isNewChat,
  setIsNewChat,
  isViewingChatsForMyPost,
  navBarHeight,
  gridContainerStyle,
}) => {
  return (
    <Grid style={gridContainerStyle} columns="1fr">
      {/* Show list of chats when no chat is selected and not creating a new chat */}
      {selectedChatId == null && !isNewChat ? (
        <ListOfChats
          user={user}
          selectedChatId={selectedChatId}
          setSelectedChatId={setSelectedChatId}
          postId={postId}
          isViewingChatsForMyPost={isViewingChatsForMyPost}
        />
      ) : (
        <ChatDialog
          loggedInUser={user}
          selectedChatId={selectedChatId}
          setSelectedChatId={setSelectedChatId}
          navBarHeight={navBarHeight}
          isNewChat={isNewChat}
          setIsNewChat={setIsNewChat}
          postId={postId}
          postType={postType}
        />
      )}
    </Grid>
  );
};

const ChatPage = ({ user, chatId, postId, postType, isViewingChatsForMyPost }) => {
  const hasSelectedAChat = typeof chatId !== 'undefined' && chatId !== null;
  const [selectedChatId, setSelectedChatId] = useState(hasSelectedAChat ? chatId : null);
  const [isNewChat, setIsNewChat] = useState(false);
  const [hasNoChatForOwnPost, setHasNoChatForOwnPost] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const checkIfSelectedChatHasError = (rawChat) => {
    // Check if chat exists
    if (!rawChat.exists) {
      setHasError(true);
      return;
    }
    const chat = rawChat.data();
    // Check if logged in user is part of the chat
    if (chat.npo.id !== user.user.userId && chat.donor.id !== user.user.userId) {
      setHasError(true);
      return;
    }
  };

  const setChatPropertiesForPost = (rawChats) => {
    setIsNewChat(rawChats.docs.length === 0);

    if (isViewingChatsForMyPost && rawChats.docs.length === 0) {
      setHasNoChatForOwnPost(true);
    } else {
      setHasNoChatForOwnPost(false);
    }
  };

  const initialChecks = async () => {
    if (chatId && postId) {
      const [rawChat, rawChatsForPost] = await Promise.all([
        api.chats.getChat(chatId),
        api.chats.getChatsForPost(postId),
      ]);
      checkIfSelectedChatHasError(rawChat);
      setChatPropertiesForPost(rawChatsForPost);
    } else if (chatId) {
      const rawChat = await api.chats.getChat(chatId);
      checkIfSelectedChatHasError(rawChat);
      setHasNoChatForOwnPost(false);
    } else if (postId) {
      const rawChatsForPost = await api.chats.getChatsForPost(postId);
      setChatPropertiesForPost(rawChatsForPost);
    } else {
      setHasNoChatForOwnPost(false);
    }
  };

  useEffect(() => {
    initialChecks().then(() => setIsMounted(true));
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

  if (hasError) {
    return <Error />;
  }

  if (!isMounted) {
    return null;
  }

  if (hasNoChatForOwnPost && isViewingChatsForMyPost) {
    return <NoChatsContainer>No chats for this post yet.</NoChatsContainer>;
  }

  return isTablet ? (
    <ChatPageTabletAndDesktop
      user={user}
      selectedChatId={selectedChatId}
      setSelectedChatId={setSelectedChatId}
      postId={postId}
      postType={postType}
      isNewChat={isNewChat}
      setIsNewChat={setIsNewChat}
      isViewingChatsForMyPost={isViewingChatsForMyPost}
      navBarHeight={navBarOffsetHeight}
      gridContainerStyle={gridContainerStyle}
    />
  ) : (
    <ChatPageMobile
      user={user}
      selectedChatId={selectedChatId}
      setSelectedChatId={setSelectedChatId}
      postId={postId}
      postType={postType}
      isNewChat={isNewChat}
      setIsNewChat={setIsNewChat}
      isViewingChatsForMyPost={isViewingChatsForMyPost}
      navBarHeight={navBarOffsetHeight}
      gridContainerStyle={gridContainerStyle}
    />
  );
};

export default ChatPage;