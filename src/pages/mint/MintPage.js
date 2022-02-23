import { useEffect, useReducer } from 'react';
import CountUp from 'react-countup';
import { toast } from 'react-toastify';
import { utils } from 'ethers';
import { useEthers } from '@usedapp/core';
import { FaDiscord, FaTwitter } from 'react-icons/fa';
import { ReactComponent as MinusIcon } from 'assets/icons/icon-minus.svg';
import { ReactComponent as PlusIcon } from 'assets/icons/icon-plus.svg';
import {
  useTotalSupply,
  useCost,
  useMaxSupply,
  useMaxMintAmountPerTx,
  usePaused,
  useMint,
} from 'hooks';
import 'react-toastify/dist/ReactToastify.css';
import './MintPage.scss';
import AppLayout from 'pages/AppLayout';

const MintPage = () => {
  const { account } = useEthers();

  const tokenPrice = useCost();
  const totalSupply = useTotalSupply();
  const maxSupply = useMaxSupply();
  const maxMintAmountPerTx = useMaxMintAmountPerTx();
  const paused = usePaused();
  const { state: mintState, send: mint } = useMint();
  const initialState = { numberOfToken: 1 };

  const reducer = (state, action) => {
    switch (action) {
      case 'plus':
        if (state.numberOfToken < parseInt(maxMintAmountPerTx, 10))
          return { numberOfToken: state.numberOfToken + 1 };
        return { numberOfToken: state.numberOfToken };
      case 'minus':
        if (state.numberOfToken > 1)
          return { numberOfToken: state.numberOfToken - 1 };
        return { numberOfToken: state.numberOfToken };
      case 'max':
        return { numberOfToken: parseInt(maxMintAmountPerTx, 10) };
      default:
        throw new Error('There is an error');
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    mintState.status === 'Exception' && toast.error(mintState.errorMessage);
    mintState.status === 'Success' && toast.info('Mint success!');
  }, [mintState]);

  const handleMint = async () => {
    if (!account) {
      toast.error('Please connect on Ethereum network.');
      return;
    }

    const ethPrice =
      (state.numberOfToken * parseInt(tokenPrice, 10)) / 10 ** 18;

    if (!paused) {
      mint(state.numberOfToken, {
        value: utils.parseEther(ethPrice.toString()),
      });
    } else {
      toast.info('Mint not started.');
    }
  };

  return (
    <AppLayout>
      <div className='mint-page'>
        <div className='content'>
          <div id='stars'></div>
          <div id='stars2'></div>
          <div id='stars3'></div>
          <div id='stars4'></div>

          <div className='mask'>
            <div className='banner'>
              <h1 className='text-4xl'>Get Your Own CheetahCC NFT</h1>
              <div className='nft-panel unselectable'>
                <div className='title'>Amount</div>
                <div className='nft-counter'>
                  <MinusIcon onClick={(e) => dispatch('minus')} />
                  <div className='amount'>{state.numberOfToken}</div>
                  <PlusIcon onClick={(e) => dispatch('plus')} />
                </div>
                <button
                  className='unselectable'
                  onClick={(e) => dispatch('max')}
                >
                  Get max
                </button>
              </div>
              <h3 className='text-lg mb-4 unselectable'>
                Total{' '}
                <span>
                  {tokenPrice
                    ? (state.numberOfToken * parseInt(tokenPrice, 10)) /
                      10 ** 18
                    : 0}
                </span>{' '}
                ETH
              </h3>
              <button
                className='rounded relative inline-flex group items-center justify-center px-12 py-3 m-1 cursor-pointer border-b-4 border-l-2 active:border-purple-600 active:shadow-none shadow-lg bg-gradient-to-tr from-purple-600 to-purple-500 border-purple-700 text-white overflow-hidden unselectable'
                onClick={handleMint}
              >
                <span className='absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-32 group-hover:h-32 opacity-10'></span>
                Mint
              </button>
              <div className='grid grid-cols-1 md:grid-cols-2 mt-16'>
                <div className='flex flex-row md:flex-col gap-4 justify-center'>
                  <div className='text-lg text-gray-300'>Community Members</div>
                  <div className='flex justify-center gap-2 text-2xl md:text-3xl  items-center'>
                    <FaDiscord />{' '}
                    <CountUp
                      end={350}
                      duration={3}
                      separator=','
                      decimal=','
                      suffix=' +'
                    />
                  </div>
                </div>
                <div className='flex flex-row md:flex-col gap-4 justify-center'>
                  <div className='text-lg text-gray-300 font-bold'>
                    Followers on twitter
                  </div>
                  <div className='flex justify-center gap-2 text-2xl md:text-3xl items-center'>
                    <FaTwitter />{' '}
                    <CountUp
                      end={680}
                      duration={3}
                      separator=','
                      decimal=','
                      suffix=' +'
                    />
                  </div>
                </div>
              </div>
              <div
                className='relative w-full h-24 rounded-xl bg-opacity-90 bg-white mt-24 flex items-center justify-center
               md:justify-start'
              >
                <div className='px-5 md:px-20'>
                  <div className='text-lg text-gray-800'>Available</div>
                  <h3 className='text-3xl text-purple-900'>
                    {totalSupply ? (
                      <CountUp
                        end={parseInt(totalSupply, 10)}
                        duration={1}
                        separator=','
                        decimal=','
                      />
                    ) : (
                      0
                    )}
                    /{' '}
                    {maxSupply ? (
                      <CountUp
                        end={maxSupply}
                        duration={2}
                        separator=','
                        decimal=','
                      />
                    ) : (
                      0
                    )}
                  </h3>
                </div>
                <img
                  className='absolute bottom-0 right-0 hidden md:block object-cover rounded-br-xl'
                  width='280'
                  height='136'
                  src='assets/images/cheetah-group.png'
                  alt='Group'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default MintPage;
