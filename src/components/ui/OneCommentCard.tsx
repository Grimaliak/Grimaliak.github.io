import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import getAuthorsRequest from 'src/api/authors/getAuthorsRequest';
import { commentType } from 'src/types/comments';
import { authorType } from 'src/types/authors';
import { correctDate } from '../../lib/correctDate'
import { Box } from '@mui/material';

interface OneCommentProps {
  comment: commentType;
  updateTotalLikes: (updatedLikes: number, id: number) => void;
  isParentComment: boolean;
}

export default function OneCommentCard({ comment, updateTotalLikes, isParentComment }: OneCommentProps): JSX.Element {
  const [authors, setAuthors] = useState<authorType[]>([]);
  const [liked, setLiked] = useState(false);
  const [localLikes, setLocalLikes] = useState(comment.likes);

  const author = authors.find((author) => author.id === comment.author);
  const isChildComment = !isParentComment;

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const authorsData = await getAuthorsRequest();
        setAuthors(authorsData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAuthors();
  }, []);

  const toggleLike = () => {
    const updatedLikes = liked ? localLikes - 1 : localLikes + 1;
    updateTotalLikes(updatedLikes, comment.id);
    setLocalLikes(updatedLikes);
    setLiked(!liked);
  };

  return (
    <Card
    sx={{
      display: 'flex',
      width: '600px',
      margin: 0,
      position: 'relative',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      maxWidth: isChildComment ? '90%' : '100%',
      marginLeft: isChildComment ? 'auto' : 0,
      marginBottom: 1,
    }}
  >
      <Avatar src={author?.avatar} sx={{ width: 50, height: 50, margin: 2 }} />
      <CardContent>
        <Typography variant="body2" color="textSecondary" gutterBottom style={{color: 'white'}}>
          {author?.name}
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom style={{color: 'white'}}>
          {correctDate(comment.created)}
        </Typography>
        <Typography variant="body2" color="textPrimary" gutterBottom style={{ whiteSpace: 'pre-line', wordBreak: 'break-word', color: 'white'}}>
          {comment.text}
        </Typography>
        <Box style={{ position: 'absolute', top: '35px', right: '5%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center' }} onClick={toggleLike}>
          {liked ? <FavoriteIcon color="error" fontSize="small" /> : <FavoriteBorderIcon color="error" fontSize="small" />}
          <Typography variant="body2" color="textSecondary" sx={{ ml: 0.5, color: 'white'}}>
            {comment.likes}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
