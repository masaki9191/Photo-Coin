import { ethers } from 'ethers';
import { Contract } from '@ethersproject/contracts';
import { useContractCall, useContractFunction } from '@usedapp/core';
import ContractABI from '../abi/ContractABI.json';
import { ContractAddress } from '../contracts';
// import { configure } from '@testing-library/react';

const ContractInterface = new ethers.utils.Interface(ContractABI);

const NFTContract = new Contract(ContractAddress, ContractInterface);

export const useMaxSupply = () => {
  const [maxSupply] =
    useContractCall({
      abi: ContractInterface,
      address: ContractAddress,
      method: 'maxSupply',
      args: [],
    }) ?? [];

  return maxSupply;
};

export const useMaxMintAmountPerTx = () => {
  const [maxMintAmountPerTx] =
    useContractCall({
      abi: ContractInterface,
      address: ContractAddress,
      method: 'maxMintAmountPerTx',
      args: [],
    }) ?? [];

  return maxMintAmountPerTx;
};

export const useCost = () => {
  const [cost] =
    useContractCall({
      abi: ContractInterface,
      address: ContractAddress,
      method: 'cost',
      args: [],
    }) ?? [];

  return cost;
};

export const usePaused = () => {
  const [paused] =
    useContractCall({
      abi: ContractInterface,
      address: ContractAddress,
      method: 'paused',
      args: [],
    }) ?? [];

  return paused;
};

export const useTotalSupply = () => {
  const [totalSupply] =
    useContractCall({
      abi: ContractInterface,
      address: ContractAddress,
      method: 'totalSupply',
      args: [],
    }) ?? [];

  return totalSupply;
};

export const useMint = () => {
  const { state, send, event } = useContractFunction(NFTContract, 'mint', {});

  return { state, send, event };
};
