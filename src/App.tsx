import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  TextField,
} from '@mui/material';
import { ethers } from 'ethers';
import abi from './abi.json';
import NftList from './nftList/NftList';
import { useState } from 'react';

function App() {
  const [uris, setUris] = useState<string[]>([]);
  const [isValid, setIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState('');

  const connectWallet = async () => {
    if (!ethers.isAddress(address)) {
      setIsValid(false);
      return;
    }
    setIsLoading(true);
    setIsValid(true);
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.JsonRpcProvider(
        'https://mainnet.infura.io/v3/3d72b2b6b76a43babe64ad1f939f7614'
      );

      const contractAddress = '0xed5af388653567af2f388e6224dc7c4b3241c544';
      const contract = new ethers.Contract(contractAddress, abi, provider);
      const balance = await contract.balanceOf(address);

      const promises = [];

      for (let i = 0; i < balance; i++) {
        promises.push(contract.tokenOfOwnerByIndex(address, i));
      }

      const tokenIds = await Promise.all(promises);
      const tokenUriPromises = [];

      for (let i = 0; i < tokenIds.length; i++) {
        const tokenId = tokenIds[i];
        tokenUriPromises.push(contract.tokenURI(tokenId));
      }

      const tokenUris = await Promise.all(tokenUriPromises);
      setUris(tokenUris);
    }
    setIsLoading(false);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      padding="20px"
    >
      <FormControl
        sx={{
          gap: '20px',
          margin: '10px',
        }}
      >
        <TextField
          helperText={isValid ? ' ' : 'Invalid Address'}
          error={!isValid}
          sx={{ width: '410px' }}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <Button onClick={connectWallet}>Connect Wallet</Button>
      </FormControl>
      {isLoading ? <CircularProgress /> : <NftList uris={uris} />}
    </Box>
  );
}

export default App;
