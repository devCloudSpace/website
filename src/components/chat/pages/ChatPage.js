import React, { useState, useEffect, useContext, useReducer, useMemo } from 'react';
import { Grid } from '@kiwicom/orbit-components/lib';
import ListOfChats from '../modules/ListOfChats';
import ChatDialog from '../modules/ChatDialog';
import api from '@api';
import Error from 'next/error';
import styled from 'styled-components';
import useMediaQuery from '@kiwicom/orbit-components/lib/hooks/useMediaQuery';
import Router from 'next/router';
import useWindowDimensions from '@utils/hooks/useWindowDimensions';
import useNavbarHeight from '../../navbar/modules/useNavbarHeight';
import ChatContext from '../context';
import initialState from '../initialState';
import reducer from '../reducers';
import {
  setSelectedChatId,
  setIsNewChat,
  setHasError,
  setUser,
  setPostId,
  setPostType,
  setIsViewingChatsForMyPost,
} from '../actions';
import { getSelectedChatId, getIsNewChat, getHasError } from '../selectors';

const NoChatsContainer = styled.div`
  margin: 0 auto;
  margin-top: 40vh;
  width: fit-content;
`;

const ChatPageTabletAndDesktop = ({ gridContainerStyle }) => {
  return (
    <Grid style={gridContainerStyle} columns="1fr 3fr">
      <ListOfChats isShow={true} />
      <ChatDialog isShow={true} />
    </Grid>
  );
};

const ChatPageMobile = ({ gridContainerStyle }) => {
  const { state } = useContext(ChatContext);
  const selectedChatId = getSelectedChatId(state);
  const isNewChat = getIsNewChat(state);
  return (
    <Grid style={gridContainerStyle} columns="1fr">
      {/* Using the isShow props to conditionally display ListOfChats when has not selected a chat */}
      <ListOfChats isShow={selectedChatId === null && !isNewChat} />
      <ChatDialog isShow={selectedChatId !== null || isNewChat} />
    </Grid>
  );
};

const ChatPage = ({ user, chatId, postId, postType, isViewingChatsForMyPost }) => {
  const hasSelectedAChat = typeof chatId !== 'undefined' && chatId !== null;
  const [state, dispatch] = useReducer(reducer, initialState);

  // prevent re-rendering
  const contextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  // initialize context states
  useEffect(() => {
    dispatch(setSelectedChatId(hasSelectedAChat ? chatId : null));
    dispatch(setIsNewChat(false));
    dispatch(setHasError(false));
    dispatch(setUser(user));
    dispatch(setPostId(postId));
    dispatch(setPostType(postType));
    dispatch(setIsViewingChatsForMyPost(isViewingChatsForMyPost));
  }, []);

  const selectedChatId = getSelectedChatId(state);
  const hasError = getHasError(state);

  const [hasNoChatForOwnPost, setHasNoChatForOwnPost] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  const checkIfSelectedChatHasError = (rawChat) => {
    // Check if chat exists
    if (!rawChat.exists) {
      dispatch(setHasError(true));
      return;
    }
    const chat = rawChat.data();
    // Check if logged in user is part of the chat
    if (chat.npo.id !== user.user.userId && chat.donor.id !== user.user.userId) {
      dispatch(setHasError(true));
      return;
    }
  };

  const setChatPropertiesForPost = (rawChats) => {
    dispatch(setIsNewChat(rawChats.docs.length === 0));

    if (isViewingChatsForMyPost && rawChats.docs.length === 0) {
      setHasNoChatForOwnPost(true);
    } else {
      setHasNoChatForOwnPost(false);
    }
  };

  const initialChecks = async () => {
    if (selectedChatId) {
      const rawChat = await api.chats.getChat(selectedChatId);
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
    // handle changes in url param `chatId`, when clicked on back/forward button
    const handleRouteChange = () => {
      if (typeof window === 'undefined') {
        return;
      }
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const chatIdParam = urlParams.get('chatId');
      if (chatIdParam !== selectedChatId) {
        dispatch(setSelectedChatId(chatIdParam));
      }
    };

    Router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [selectedChatId]); // compare url param with the most recently updated selectedChatId

  useEffect(() => {
    initialChecks().then(() => setIsMounted(true));
  }, [selectedChatId]);

  const { isTablet } = useMediaQuery();
  const { height } = useWindowDimensions();
  const navBarOffsetHeight = useNavbarHeight();

  const gridContainerStyle = {
    height: `${height - navBarOffsetHeight}px`,
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

  return (
    <ChatContext.Provider value={contextValue}>
      {isTablet ? (
        <ChatPageTabletAndDesktop gridContainerStyle={gridContainerStyle} />
      ) : (
        <ChatPageMobile gridContainerStyle={gridContainerStyle} />
      )}
    </ChatContext.Provider>
  );
};

export default ChatPage;
