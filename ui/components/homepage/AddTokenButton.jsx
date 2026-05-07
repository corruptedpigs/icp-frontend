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
      {/* MetaMask fox logo */}
      <svg width="16" height="16" viewBox="0 0 35 33" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <g fillRule="evenodd">
          <polygon fill="#E17726" stroke="#E17726" strokeWidth=".25" points="32.958 1 19.178 10.774 21.616 4.703"/>
          <polygon fill="#E27625" stroke="#E27625" strokeWidth=".25" points="2.042 1 15.701 10.865 13.384 4.703"/>
          <polygon fill="#E27625" stroke="#E27625" strokeWidth=".25" points="28.129 23.534 24.387 29.259 32.167 31.411 34.42 23.649"/>
          <polygon fill="#E27625" stroke="#E27625" strokeWidth=".25" points=".598 23.649 2.833 31.411 10.613 29.259 6.889 23.534"/>
          <polygon fill="#E27625" stroke="#E27625" strokeWidth=".25" points="10.183 14.703 7.994 17.994 15.701 18.348 15.44 10.07"/>
          <polygon fill="#E27625" stroke="#E27625" strokeWidth=".25" points="24.817 14.703 19.42 9.979 19.178 18.348 26.867 17.994"/>
          <polygon fill="#E27625" stroke="#E27625" strokeWidth=".25" points="10.613 29.259 15.233 26.999 11.247 23.704"/>
          <polygon fill="#E27625" stroke="#E27625" strokeWidth=".25" points="19.767 26.999 24.387 29.259 23.753 23.704"/>
          <polygon fill="#D5BFB2" stroke="#D5BFB2" strokeWidth=".25" points="24.387 29.259 19.767 26.999 20.132 30.204 20.095 31.302"/>
          <polygon fill="#D5BFB2" stroke="#D5BFB2" strokeWidth=".25" points="10.613 29.259 14.905 31.302 14.886 30.204 15.233 26.999"/>
          <polygon fill="#233447" stroke="#233447" strokeWidth=".25" points="15.005 22.099 11.136 20.998 13.773 19.786"/>
          <polygon fill="#233447" stroke="#233447" strokeWidth=".25" points="19.995 22.099 21.227 19.786 23.882 20.998"/>
          <polygon fill="#CC6116" stroke="#CC6116" strokeWidth=".25" points="10.613 29.259 11.283 23.534 6.889 23.649"/>
          <polygon fill="#CC6116" stroke="#CC6116" strokeWidth=".25" points="23.717 23.534 24.387 29.259 28.129 23.649"/>
          <polygon fill="#CC6116" stroke="#CC6116" strokeWidth=".25" points="26.867 17.994 19.178 18.348 19.995 22.099 21.227 19.786 23.882 20.998"/>
          <polygon fill="#CC6116" stroke="#CC6116" strokeWidth=".25" points="11.136 20.998 13.773 19.786 15.005 22.099 15.701 18.348 7.994 17.994"/>
          <polygon fill="#E27525" stroke="#E27525" strokeWidth=".25" points="7.994 17.994 11.247 23.704 11.136 20.998"/>
          <polygon fill="#E27525" stroke="#E27525" strokeWidth=".25" points="23.882 20.998 23.753 23.704 26.867 17.994"/>
          <polygon fill="#E27525" stroke="#E27525" strokeWidth=".25" points="15.701 18.348 15.005 22.099 15.868 26.609 16.054 20.573"/>
          <polygon fill="#E27525" stroke="#E27525" strokeWidth=".25" points="19.178 18.348 18.964 20.555 19.132 26.609 19.995 22.099"/>
          <polygon fill="#F5841F" stroke="#F5841F" strokeWidth=".25" points="19.995 22.099 19.132 26.609 19.767 26.999 23.753 23.704 23.882 20.998"/>
          <polygon fill="#F5841F" stroke="#F5841F" strokeWidth=".25" points="11.136 20.998 11.247 23.704 15.233 26.999 15.868 26.609 15.005 22.099"/>
          <polygon fill="#C0AC9D" stroke="#C0AC9D" strokeWidth=".25" points="20.095 31.302 20.132 30.204 19.786 29.913 15.214 29.913 14.886 30.204 14.905 31.302 10.613 29.259 12.057 30.426 15.177 32.5 19.823 32.5 22.943 30.426 24.387 29.259"/>
          <polygon fill="#161616" stroke="#161616" strokeWidth=".25" points="19.767 26.999 19.132 26.609 15.868 26.609 15.233 26.999 14.886 30.204 15.214 29.913 19.786 29.913 20.132 30.204"/>
          <polygon fill="#763D16" stroke="#763D16" strokeWidth=".25" points="33.516 11.143 34.72 5.164 32.958 1 19.767 10.427 24.817 14.703 32.013 16.765 33.571 14.957 32.903 14.48 33.93 13.553 33.114 12.918 34.141 12.147"/>
          <polygon fill="#763D16" stroke="#763D16" strokeWidth=".25" points="0.28 5.164 1.484 11.143 0.877 12.147 1.904 12.918 1.087 13.553 2.115 14.48 1.447 14.957 3.005 16.765 10.183 14.703 15.233 10.427 2.042 1"/>
          <polygon fill="#F5841F" stroke="#F5841F" strokeWidth=".25" points="32.013 16.765 24.817 14.703 26.867 17.994 23.753 23.704 28.129 23.649 34.42 23.649"/>
          <polygon fill="#F5841F" stroke="#F5841F" strokeWidth=".25" points="10.183 14.703 3.005 16.765 .598 23.649 6.889 23.649 11.247 23.704 7.994 17.994"/>
          <polygon fill="#F5841F" stroke="#F5841F" strokeWidth=".25" points="19.178 18.348 19.767 10.427 21.634 4.703 13.384 4.703 15.233 10.427 15.701 18.348 15.85 20.591 15.868 26.609 19.132 26.609 19.15 20.591"/>
        </g>
      </svg>
      Add {tokenSymbol}
    </button>
  );
}
