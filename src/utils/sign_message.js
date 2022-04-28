export const loginMessage = (address, nonce, timestamp) => {
  return `
trojan-box wants you to sign in with your Ethereum account:
${address}
for login
Nonce: ${nonce}
Timestamp: ${timestamp}
`;
};

export const playGameMessage = (address, nonce, timestamp, cards, godIndex) => {
  return `
trojan-box wants you to sign in with your Ethereum account:
${address}
for play game
Nonce: ${nonce}
Timestamp: ${timestamp}
Cards: ${cards}
Chosen: ${godIndex}
`;
};
