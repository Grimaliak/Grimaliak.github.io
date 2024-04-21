import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import getCommentsRequest from '../../api/comments/getCommentsRequest';
import OneCommentCard from '../ui/OneCommentCard';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Button from '@mui/material/Button';
import { Box, Container, Divider } from '@mui/material';
import { commentType } from '../../types/comments';

export default function CommentsPage(): JSX.Element {
  const [comments, setComments] = useState<commentType[]>([]);
  const [totalLikes, setTotalLikes] = useState<number>(0);
  const [totalComments, setTotalComments] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchComments = async (currentPage: number) => {
    setLoading(true);
    try {
      const response = await getCommentsRequest(currentPage);
      setComments(response.data);
      calculateTotals(response.data);
      setLoading(false);
    } catch (error) {
      if (currentPage === 2) {
        fetchComments(2);
      } else {
        console.error(error);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchComments(page);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const clickHandler = () => {
    setPage((prevPage) => (prevPage === 3 ? 1 : prevPage + 1));
  };

  const calculateTotals = (data: commentType[]) => {
    let totalLikesCount = 0;
    let totalCommentsCount = data.length;
    data.forEach((comment) => {
      totalLikesCount += comment.likes;
    });
    setTotalLikes(totalLikesCount);
    setTotalComments(totalCommentsCount);
  };

  const updateTotalLikes = (updatedLikes: number, id: number) => {
    const index = comments.findIndex((comment) => comment.id === id);
    const updatedComments = [...comments];
    const updatedComment = { ...updatedComments[index] };
    const prevLikes = updatedComment.likes;
    updatedComment.likes = updatedLikes;
    updatedComments[index] = updatedComment;
    setComments(updatedComments);
    setTotalLikes((prevTotalLikes) => prevTotalLikes + (updatedLikes - prevLikes));
  };

  const renderComments = (comments: commentType[], parentId: number | null, isParentComment: boolean) => {
    const filteredComments = comments.filter((comment) => comment.parent === parentId);
    return filteredComments.map((comment) => (
      <React.Fragment key={comment.id}>
        <OneCommentCard 
          key={comment.id} 
          comment={comment}  
          updateTotalLikes={updateTotalLikes} 
          isParentComment={isParentComment}
        />
        {renderComments(comments, comment.id, false)}
      </React.Fragment>
    ));
  };

  const CommentsInfo = () => (
    <Box 
    sx={{ 
      width: '45%', 
      paddingTop: '50px', 
      display: 'flex', 
      justifyContent: 'space-between', 
      color: 'white',
      '@media (max-width: 768px)': {
        width: '60%',
        minWidth: '375px',
        '@media (max-width: 650px)': {
          width: '80%',
          minWidth: '375px',
        },
        '@media (max-width: 375px)': {
          width: '80%',
          minWidth: '350px',
        },
      },
  }}>
      <Box>{totalComments} комментариев</Box>
      <Box style={{ display: 'flex', alignItems: 'center'}}>
        <FavoriteBorderIcon color="error" fontSize="small" />
        <Box style={{ marginLeft: '3px'}}>{totalLikes}</Box>
      </Box>
    </Box>
  );

  const NextPageButton = () => (
    <Box style={{ margin: '20px 0' }}>
      <Button variant="contained" style={{ backgroundColor: 'grey', color: 'black'}} onClick={clickHandler}>Загрузить еще</Button>
    </Box>
  );

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh' }}>
      {loading ? (    
        <CircularProgress/>
      ) : (
        <>
          <CommentsInfo />
          <Divider sx={{ width: '45%', backgroundColor: 'white', margin: '10px 0px 20px 0px',
  '@media (max-width: 768px)': {
    width: '60%',
    minWidth: '375px',
  },
  '@media (max-width: 650px)': {
    width: '80%',
    minWidth: '375px',
  },
  '@media (max-width: 375px)': {
    width: '80%',
    minWidth: '350px',
  }
}} />
          <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            flexDirection: 'column', 
            width: '45%', 
            '@media (max-width: 768px)': {
              flexDirection: 'column',
              alignItems: 'center',
              width: '60%',
              minWidth: '375px',
        },
            '@media (max-width: 650px)': {
            flexDirection: 'column',
            alignItems: 'center',
            width: '80%',
            minWidth: '375px',
      },
      '@media (max-width: 375px)': {
        flexDirection: 'column',
        alignItems: 'center',
        width: '80%',
        minWidth: '350px',
  },
      }}>
            {renderComments(comments, null, true)}
          </Box>
          <NextPageButton />
        </>
      )}
    </Container>
  );
}
