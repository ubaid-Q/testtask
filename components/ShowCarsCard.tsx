import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { Button } from '@mui/material';

export default function ShowCarsCard({carsCount}) {
  const theme = useTheme();

  return (
    <Card sx={{ display: 'flex' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="h5">
            {carsCount}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div">
            Registered Cars
          </Typography>
          <br/>
          <Button variant='outlined' href='/cars' type='button' size='small'>View All Cars</Button>
        </CardContent>
      </Box>
      <CardMedia
        component="img"
        sx={{ width: 300,height:200 }}
        image="/cars.jpg"
        alt="Live from space album cover"
      />
    </Card>
  );
}
