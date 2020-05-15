import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Stack, Card, CardSection, Button, Text } from '@kiwicom/orbit-components/lib';
import api from '../../../../utils/api/index';
import styled from 'styled-components';
import Avatar from '../../imageContainers/Avatar';
import GreySubtleButton from '../../buttons/GreySubtleButton';
import Desktop from '@kiwicom/orbit-components/lib/Desktop';
import Mobile from '@kiwicom/orbit-components/lib/Mobile';
import { dummyTopCategoriesAndTheirWishes } from '../../../../utils/dummyData/topCategoriesAndTheirWishes';

const TopCategoriesContainer = styled.div`
  text-align: center;
  width: 90%;
  margin: 0 auto;
  margin-bottom: 2vh;
`;

const ResizableTitle = styled.div`
  font-size: calc(10px + 0.5vw);
  font-weight: bold;
`;

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 10px;
  box-shadow: 0px 0px 10px 0px rgba(37, 42, 49, 0.16), 0px 2px 8px 0px rgba(37, 42, 49, 0.12);
  width: 100%;
`;

const BlackText = styled.div`
  color: black;
  font-size: ${(props) => {
    if (props.size === 'small') {
      return '12px';
    }
    if (props.size === 'medium') {
      return '14px';
    }
    if (props.size === 'large') {
      return '18px';
    }
  }};
`;

const CardHeaderContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 1vh;
`;

const ClickableDiv = styled.a`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
`;

const TwoLineTextContainer = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  line-height: 1.5em;
  max-height: 3em;
  font-size: 14px;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-align: start;
  color: black;
`;

const AvatarDetails = ({ name, distance }) => {
  return (
    <div style={{ width: 'fit-content', float: 'left', margin: '0 auto', marginLeft: '5px' }}>
      <Stack direction="column" spacing="extraTight">
        <BlackText size="small">{name}</BlackText>
        <BlackText size="small">{distance}km away</BlackText>
      </Stack>
    </div>
  );
};

const TimePosted = ({ numberOfHoursAgo }) => {
  return (
    <div style={{ float: 'right' }}>
      <BlackText size="small">{numberOfHoursAgo}hour(s) ago</BlackText>
    </div>
  );
};

const CardHeader = ({ name, imageUrl }) => {
  return (
    <CardHeaderContainer>
      <div style={{ float: 'left' }}>
        <Avatar imageUrl={imageUrl} />
      </div>
      <AvatarDetails name={name} distance="2.5" />
      <TimePosted numberOfHoursAgo="1" />
    </CardHeaderContainer>
  );
};

const CardDescription = ({ title, description }) => {
  return (
    <Stack direction="column" spacing="tight">
      <Text size="normal" weight="bold">
        {title}
      </Text>
      <TwoLineTextContainer>{description}</TwoLineTextContainer>
    </Stack>
  );
};

const CardContent = ({ title, description, name, imageUrl }) => {
  return (
    <div style={{ width: '100%', height: '100px' }}>
      <CardHeader name={name} imageUrl={imageUrl} />
      <CardDescription title={title} description={description} />
    </div>
  );
};

const CategoryHeader = ({ title }) => {
  return (
    <div style={{ width: '100%', height: 'fit-content' }}>
      <Desktop>
        <Text size="large" align="center" weight="bold">
          {title}
        </Text>
      </Desktop>
      <Mobile>
        <Text size="normal" align="center" weight="bold">
          {title}
        </Text>
      </Mobile>
    </div>
  );
};

const TopCategories = ({ numberOfPosts, numberOfCategories }) => {
  const [topCategoriesAndTheirWishes, setTopCategoriesAndTheirWishes] = useState([]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      setTopCategoriesAndTheirWishes(dummyTopCategoriesAndTheirWishes);
    } else {
      getTopCategoriesAndTheirWishes(numberOfPosts, numberOfCategories);
    }
  }, []);

  const getTopCategoriesAndTheirWishes = (numberOfCategories, numberOfPosts) => {
    api.categories
      .getAll()
      .then((response) => {
        // get top {@numberOfCategories} categories
        const categories = [];
        response.docs.slice(0, numberOfCategories).forEach((doc) => categories.push(doc.data()));
        return categories;
      })
      .then((categories) => {
        // get {@numberOfPosts} wishes for each top categories
        getWishesForTopCategories(categories, numberOfPosts)
          .then((topCategoriesAndTheirWishes) => setTopCategoriesAndTheirWishes(topCategoriesAndTheirWishes));
      })
      .catch((err) => {});
  }

  async function getWishesForTopCategories(categories, numberOfPosts) {
    let topCategoriesAndTheirWishes = [];
    for (let i = 0; i < categories.length; i++) {
      const response = await api.wishes.getTopNPendingWishes(categories[i].id, numberOfPosts);
      const category = categories[i];
      category.wishes = [];
      response.docs.forEach((doc) => category.wishes.push(doc.data()));
      topCategoriesAndTheirWishes = [...topCategoriesAndTheirWishes, category];
    }
    return topCategoriesAndTheirWishes;
  }

  const getTopNCategoryCards = () => {
    const router = useRouter();
    return topCategoriesAndTheirWishes.map((categoryWishes) => {
      const categoryHref = '/category/' + categoryWishes.id;
      const handleClick = (event) => {
        event.preventDefault();
        router.push(categoryHref);
      };
      return (
        <CardWrapper key={categoryWishes.id}>
          <Card header={<CategoryHeader title={categoryWishes.name} />}>
            {categoryWishes.wishes.map((wish) => {
              const postHref = '/wishes/' + wish.wishesId;
              return (
                <CardSection
                  key={wish.wishesId}
                  header={
                    <CardContent
                      name={wish.organization.name}
                      title={wish.title}
                      description={wish.description}
                      imageUrl={wish.user.profileImageUrl}
                    />
                  }
                >
                  <ClickableDiv href={postHref} onClick={handleClick} />
                </CardSection>
              );
            })}
            <Button size="small" asComponent={GreySubtleButton} onClick={handleClick}>
              <BlackText size="small">View all</BlackText>
            </Button>
          </Card>
        </CardWrapper>
      );
    });
  };


  return (
    <TopCategoriesContainer>
      <ResizableTitle style={{ marginBottom: '1vh' }}>Top Categories</ResizableTitle>
      <Stack desktop={{ direction: 'row' }} direction="column" align="start" spacing="extraLoose">
        {getTopNCategoryCards()}
      </Stack>
    </TopCategoriesContainer>
  );
};

export default TopCategories;
