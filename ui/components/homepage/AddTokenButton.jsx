"use client";

import { useWallet } from "../../../app/context/WalletContext";

/**
 * id: add-token-btn
 * Styled after the PolygonScan "Add Polygon network" button:
 * MetaMask fox icon + token symbol, pill shape, subtle border.
 */
export default function AddTokenButton({ id = "add-token-btn", className = "" }) {
  const { account, isPolygonNetwork, trackedTokenAddress, tokenSymbol, addTrackedTokenToWallet } = useWallet();

  if (!account || !isPolygonNetwork() || !trackedTokenAddress) return null;

  return (
    <button
      id={id}
      onClick={addTrackedTokenToWallet}
      className={`inline-flex items-center gap-1.5 rounded-full border border-gray-300 bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1.5 shadow-sm transition-colors ${className}`}
      title={`Add ${tokenSymbol} to MetaMask`}
    >
      {/* MetaMask fox SVG (simplified) */}
      <svg width="16" height="16" viewBox="0 0 318 318" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M274.1 35.5 174.1 109l18.9-44.6z" fill="#E2761B" stroke="#E2761B" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="m43.9 35.5 99.1 74.2-17.9-45.3zm185.7 171.8-26.6 40.7 56.9 15.7 16.3-55.4zm-202.1.9 16.2 55.4 56.9-15.7-26.6-40.7z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="m167.2 194.5-15.7-24.7-64.7 3 74.4 103zm-16.4-24.7-15.7 24.7 6 82.3 74.4-103z" fill="#F6851B" stroke="#F6851B" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="m159 176.5 63.4-39.2-9.9-23.2zm-63.4-39.2 9.9-23.2-53.5 16.2 63.4 39.2z" fill="#763D16" stroke="#763D16" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      Add {tokenSymbol}
    </button>
  );
}
