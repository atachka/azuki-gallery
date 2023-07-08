import { Box } from '@mui/material';
import NftListItem from '../nftListItem/NftListItem';

const NftList = ({ uris }: { uris: string[] }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '20px',
        margin: '0 0.5%',
      }}
    >
      {uris.length
        ? uris.map((uri: string, index: number) => (
            <NftListItem uri={uri} key={index} />
          ))
        : null}
    </Box>
  );
};

export default NftList;
