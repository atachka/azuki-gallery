import { Box, Typography } from '@mui/material';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const NftListItem = ({ uri }: { uri: string }) => {
  const [data, setData] = useState<{ name: string; image: string } | null>(
    null
  );
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  console.log(uri);
  useEffect(() => {
    observer.current = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    });

    const observerElement = document.getElementById('observer');
    if (observerElement) {
      observer.current.observe(observerElement);
    }

    return () => {
      observer.current?.disconnect();
    };
  }, [uri]);

  const handleIntersection: IntersectionObserverCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.current?.disconnect();
      }
    });
  };
  useEffect(() => {
    if (isVisible) {
      const fetchData = async () => {
        const slicedUri = uri.slice(6);
        const response = await axios.get(`https://ipfs.io/ipfs${slicedUri}`);
        setData(response.data);
      };

      fetchData();
    }
  }, [isVisible, uri]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <Box id="observer">
      {data && (
        <Box
          sx={{
            maxWidth: '330px',
            maxHeight: '330px',
            borderRadius: '20px',
            overflow: 'hidden',
            bgcolor: 'white',
            boxShadow: 'rgba(0, 0, 0, 0.08) 0px 4px 15px',
          }}
        >
          <Box
            sx={{
              maxWidth: '330px',
              maxHeight: '250px',
              overflow: 'hidden',
              position: 'relative',
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <LazyLoadImage
              effect="blur"
              src={`https://ipfs.io/ipfs${data.image.slice(6)}`}
              alt="Image"
              width={330}
              height={250}
              style={{
                transform: isHovered ? 'scale(1.2)' : 'scale(1)',
                transition: 'transform 0.3s',
              }}
            />
          </Box>
          <Typography sx={{ margin: '10px 0 10px 10px', fontWeight: 'bold' }}>
            {data.name}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default NftListItem;
