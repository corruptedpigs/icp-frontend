const COINK_ADDRESS =
  process.env.NEXT_PUBLIC_TRACKED_TOKEN_ADDRESS;
const USDC_ADDRESS = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";
const COINK_SYMBOL =
  process.env.NEXT_PUBLIC_TRACKED_TOKEN_SYMBOL;

export function buildUniswapUrl(inputToken, outputToken, exactAmount) {
  const base = "https://app.uniswap.org/swap";
  const params = new URLSearchParams({
    inputCurrency: inputToken,
    outputCurrency: outputToken,
    chain: "polygon",
  });
  if (exactAmount && Number(exactAmount) > 0) {
    params.set("exactAmount", exactAmount);
    params.set("exactField", "input");
  }
  return `${base}?${params.toString()}`;
}

export function buildBuyCoinkUrl(exactCoinkAmount) {
  return buildUniswapUrl(USDC_ADDRESS, COINK_ADDRESS, exactCoinkAmount);
}

export { COINK_ADDRESS, COINK_SYMBOL };
