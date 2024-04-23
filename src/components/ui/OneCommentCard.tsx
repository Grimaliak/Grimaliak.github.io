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
    <Card variant="outlined"
    sx={{
      display: 'flex',
      flexDirection: 'column',
      maxWidth: isChildComment ? '528px' : '561px',
      position: 'relative',
      boxShadow: 'none',
      border: 'none',
      backgroundColor: 'rgba(0, 0, 0, 0)',
      marginLeft: isChildComment ? '34px' : 0,
      '@media (max-width: 320px)': {
        maxWidth: isChildComment ? '252px' : '272px',
        marginLeft: isChildComment ? '20px' : 0,
        }
    }}
  >
      <CardContent sx={{padding: 0}}>
        <Box sx={{display: 'flex', justifyContent: 'space-between' }}> 
          <Box sx={{display: 'flex'}}>
          <Box>
          <Avatar src={author?.avatar} sx={{ width: 68, height: 68, marginRight: '20px', 
          '@media (max-width: 320px)': {
            width: '40px',
            height: '40px',
            } }} />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>     
        <Typography variant="body2" color="textSecondary" gutterBottom sx={{color: 'white', fontFamily: 'Lato, sans-serif', fontWeight: 'bold', fontSize: '16', marginBottom: 0,
            '@media (max-width: 320px)': {
              fontSize: '14',
              }
          }}>
          {author?.name}
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom sx={{color: '#8297AB', fontFamily: 'Lato, sans-serif', fontWeight: '400', fontSize: '16', marginBottom: 0,
          '@media (max-width: 320px)': {
            fontSize: '14',
            }
          }}>
          {correctDate(comment.created)}
        </Typography>
          </Box>
          </Box>
        <Box style={{ display: 'flex', alignItems: 'center' }} onClick={toggleLike}>
          {liked ? <FavoriteIcon color="error" fontSize="small" sx={{ width: 22, height: 22, marginRight: '8px', '@media (max-width: 320px)': { width: 20, height: 20 }}} /> : <FavoriteBorderIcon color="error" fontSize="small" sx={{ width: 22, height: 22, marginRight: '8px', '@media (max-width: 320px)': { width: 20, height: 20 } }}/>}
          <Typography variant="body2" color="textSecondary" sx={{ fontFamily: 'Lato, sans-serif', fontWeight: 'bold', fontSize: '15', color: 'white',
              '@media (max-width: 320px)': {
              fontSize: '14',
              }
          }}>
            {comment.likes}
          </Typography>
        </Box>
        </Box>
      </CardContent>
        <Typography variant="body2" color="textPrimary" gutterBottom sx={{ fontFamily: 'Lato, sans-serif', fontWeight: '400', fontSize: '16', whiteSpace: 'pre-line', wordBreak: 'break-word', color: 'white', marginLeft: '88px', marginBottom: 0,
          '@media (max-width: 320px)': {
            marginLeft: '60px',
            }
          }}>
          {comment.text}
        </Typography>
    </Card>
  );
}
