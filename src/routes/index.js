import React, { useEffect,lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Mainnet, Rinkeby, DAppProvider } from '@usedapp/core';

import { useEthers, shortenAddress } from '@usedapp/core';
import { toast } from 'react-toastify';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3Modal from 'web3modal';
import 'react-toastify/dist/ReactToastify.css';

const MintPage = lazy(() => import('../pages/mint'));
const ErrorPage = lazy(() => import('../pages/error'));

const config = {
  readOnlyChainId: Mainnet.chainId,
  readOnlyUrls: {
    [Mainnet.chainId]: `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_ID}`,
  },
};

const AppRoutes = () => {

  const { account, activate, deactivate } = useEthers();

  const handleConnect = async () => {
    const providerOptions = {
      injected: {
        display: {
          name: 'Metamask',
          description: 'Connect with the provider in your Browser',
        },
        package: null,
      },
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          bridge: 'https://bridge.walletconnect.org',
          infuraId: process.env.REACT_APP_INFURA_ID,
        },
      },
    };

    try {
      // check if the chain to connect to is installed
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1' }], // chainId must be in hexadecimal numbers
      });
    } catch (error) {
      console.error(error);
    }

    if (!account) {
      const web3Modal = new Web3Modal({
        providerOptions,
      });
      const provider = await web3Modal.connect();
      await activate(provider);
    }
  };

  useEffect(() => {
    handleConnect();
  }, []);

  return (
    <DAppProvider config={config}>
      <Routes>
        <Route path='/' element={<MintPage />} />
        <Route component={ErrorPage} />
      </Routes>
      <ToastContainer
        position='top-center'
        autoClose={5000}
        autoDismiss={true}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        icon={true}
        theme={'colored'}
        pauseOnHover={false}
        rtl={false}
      />
    </DAppProvider>
  );
};

export default AppRoutes;
