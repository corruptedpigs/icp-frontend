"use client";

import { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { useSimulation } from '../context/SimulationContext';
import { fetchPlayerCards } from '../utils/gameApi';

const NFT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_TRACKED_NFT_ADDRESS;
const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
// Polygon Mainnet; change to 'polygon-amoy' for testnet
const ALCHEMY_NETWORK = 'polygon-mainnet';

function resolveIpfsUrl(uri) {
  if (!uri) return null;
  if (uri.startsWith('ipfs://')) {
    return `https://ipfs.corruptedpigs.com/ipfs/${uri.slice(7)}`;
  }
  if (uri.startsWith('https://ipfs.io/ipfs/')) {
    return `https://ipfs.corruptedpigs.com/ipfs/${uri.slice(21)}`;
  }
  return uri;
}

export function useWalletNFTs() {
  const { account } = useWallet();
  const { simulation } = useSimulation();
  const [nftImages, setNftImages] = useState([]);
  const [nfts, setNfts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (simulation) {
      // Cards come from the game backend; no Alchemy/Polygon traffic.
      if (!account) {
        setNftImages([]);
        setNfts([]);
        return;
      }
      const controller = new AbortController();
      setIsLoading(true);
      setError(null);
      fetchPlayerCards(account, {}, { signal: controller.signal })
        .then(({ cards }) => {
          if (controller.signal.aborted) return;
          const mapped = cards
            .map(card => ({
              id: String(card.id),
              tokenId: card.token_id ?? null,
              image: resolveIpfsUrl(card.image),
              burnPower: card.burn_power === null || card.burn_power === undefined ? null : Number(card.burn_power),
              name: card.name || null,
            }))
            .filter(card => card.image);
          setNfts(mapped);
          setNftImages(mapped.map(n => n.image));
        })
        .catch(err => {
          if (controller.signal.aborted) return;
          console.error('Error fetching simulated cards:', err);
          setError(err);
          setNfts([]);
          setNftImages([]);
        })
        .finally(() => {
          if (!controller.signal.aborted) setIsLoading(false);
        });
      return () => controller.abort();
    }

    if (!account || !NFT_CONTRACT_ADDRESS || !ALCHEMY_API_KEY) {
      setNftImages([]);
      setNfts([]);
      return;
    }

    let cancelled = false;

    const fetchNFTs = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const url = new URL(
          `https://${ALCHEMY_NETWORK}.g.alchemy.com/nft/v3/${ALCHEMY_API_KEY}/getNFTsForOwner?refreshCache=true`
        );
        url.searchParams.set('owner', account);
        url.searchParams.set('contractAddresses[]', NFT_CONTRACT_ADDRESS);
        url.searchParams.set('withMetadata', 'true');
        url.searchParams.set('pageSize', '100');

        const response = await fetch(url.toString());
        if (!response.ok) throw new Error(`Alchemy API error: ${response.status}`);

        const data = await response.json();
        // console.log(`Alchemy: account ${account} owns ${data.totalCount} NFT(s) from this collection`);

        const nfts = data.ownedNfts.map(nft => {
          const image = resolveIpfsUrl(
            nft.raw?.metadata?.image ||
            nft.image?.originalUrl ||
            nft.rawMetadata?.image ||
            nft.image?.cachedUrl
          );

          const attributes = nft.rawMetadata?.attributes || nft.raw?.metadata?.attributes || [];

          // console.log(`NFT ${nft.tokenId}: image=${image}, attributes=`, attributes);
          const burnPowerAttr = attributes.find(a =>
            a.trait_type?.toLowerCase().replace(/\s/g, '') === 'burnpower' ||
            a.trait_type?.toLowerCase() === 'burn power'
          );
          const burnPower = burnPowerAttr ? Number(burnPowerAttr.value) : null;
          return { image, burnPower, name: nft.name || nft.rawMetadata?.name || null };
        }).filter(nft => nft.image);

        // Keep backward-compat: nftImages is still the plain image array
        const images = nfts.map(n => n.image);

        if (!cancelled) {
          setNftImages(images);
          setNfts(nfts);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Error fetching NFTs:', err);
          setError(err);
          setNftImages([]);
          setNfts([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchNFTs();

    return () => {
      cancelled = true;
    };
  }, [account, simulation]);

  return { nftImages, nfts, isLoading, error };
}
