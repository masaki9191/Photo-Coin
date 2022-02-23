import { useEthers, shortenAddress } from '@usedapp/core';
import { toast } from 'react-toastify';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3Modal from 'web3modal';
import 'react-toastify/dist/ReactToastify.css';
import './Header.scss';

const Header = () => {
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

  const handleClipboard = () => {
    navigator.clipboard.writeText(account || 'clipboard');
    toast.info('Wallet Address Copy.');
  };

  return (
    <header>
      <a className='flex' href='https://cheetahcc.com/'>
        <img className='w-16' src='assets/images/logo.png' alt='Logo' />
      </a>
      <div className='flex flex-row gap-8'>
        {!account ? (
          <button
            className='rounded relative inline-flex group items-center justify-center px-3.5 py-2 m-1 cursor-pointer border-b-4 border-l-2 active:border-indigo-600 active:shadow-none shadow-lg bg-gradient-to-tr from-indigo-600 to-indigo-500 border-indigo-700 text-white overflow-hidden'
            onClick={handleConnect}
          >
            <span className='absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-32 group-hover:h-32 opacity-10'></span>
            Connect
          </button>
        ) : (
          <>
            <button
              className='rounded relative inline-flex group items-center justify-center px-3.5 py-2 m-1 cursor-pointer border-b-4 border-l-2 active:border-purple-600 active:shadow-none shadow-lg bg-gradient-to-tr from-purple-600 to-purple-500 border-purple-700 text-white overflow-hidden'
              onClick={handleClipboard}
            >
              <span className='absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-40 group-hover:h-40 opacity-10'></span>
              {shortenAddress(account)}
            </button>
            <button
              className='rounded relative inline-flex group items-center justify-center px-3.5 py-2 m-1 cursor-pointer border-b-4 border-l-2 active:border-indigo-600 active:shadow-none shadow-lg bg-gradient-to-tr from-indigo-600 to-indigo-500 border-indigo-700 text-white overflow-hidden'
              onClick={() => deactivate()}
            >
              <span className='absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-32 group-hover:h-32 opacity-10'></span>
              Disconnect
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
