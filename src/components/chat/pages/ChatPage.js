import React, { useState, useEffect } from 'react';
import { Grid } from '@kiwicom/orbit-components/lib';
import ListOfChats from '../modules/ListOfChats';
import ChatDialog from '../modules/ChatDialog';
import api from '../../../../utils/api';
import styled from 'styled-components';
import { EMAIL_BAR_HEIGHT, NAVBAR_HEIGHT } from '../../../../utils/constants/navbar';
import { useRouter } from 'next/router';
import useMediaQuery from '@kiwicom/orbit-components/lib/hooks/useMediaQuery';

const NoChatsContainer = styled.div`
  margin: 0 auto;
  margin-top: 40vh;
  width: fit-content;
`;

const ChatPage = ({ user, chatId, postId, postType, isViewingChatsForMyPost }) => {
  const hasSelectedAChat = typeof chatId !== 'undefined' && chatId !== null;
  const [selectedChatId, setSelectedChatId] = useState(hasSelectedAChat ? chatId : null);
  const [isNewChat, setIsNewChat] = useState(chatId == null || typeof chatId == 'undefined');
  const [hasNoChatForOwnPost, setHasNoChatForOwnPost] = useState(true);
  const router = useRouter();

  // checks before loading page
  useEffect(() => {
    /**
     * Check if already created a chat for a post that is not yours
     */
    if (!isViewingChatsForMyPost) {
      api.chats
        .getChatsForPost(postId)
        .then((rawChat) => {
          if (rawChat.docs.length > 0) {
            const chat = rawChat.docs[0].data(); // assumption: should only have one chat since the chat is for another user's post
            router.push(`/chat/[chatId]`, `/chat/${chat.chatId}?postId=${postId}&postType=${postType}`, {
              shallow: true,
            });
          }
        })
        .catch(() => console.log('chat does not exist'));
    }

    if (chatId) {
      api.chats
        .getChat(chatId)
        .then((rawChat) => {
          // Check if chat exists
          if (!rawChat.exists) {
            router.push('/');
          }
          const chat = rawChat.data();
          // Check if logged in user is part of the chat
          if (chat.npo.id !== user.user.userId && chat.donor.id !== user.user.userId) {
            router.push('/');
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  useEffect(() => {
    // only get chats for post if postId query is given
    if (postId) {
      api.chats.getChatsForPost(postId).then((rawChats) => {
        setIsNewChat(rawChats.docs.length === 0);

        if (isViewingChatsForMyPost && rawChats.docs.length === 0) {
          setHasNoChatForOwnPost(true);
        } else {
          setHasNoChatForOwnPost(false);
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
        {selectedChatId == null && !isNewChat ? (
          <ListOfChats
            user={user}
            setSelectedChatId={setSelectedChatId}
            postId={postId}
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
