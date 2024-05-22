export const getUserIdFromLocalStorage = () => {
  const userTokensString = localStorage.getItem("userTokens");
  const userTokens = JSON.parse(userTokensString);
  return userTokens?.userId || null;
};

export const getUserEmailFromLocalStorage = () => {
  const userTokensString = localStorage.getItem("userTokens");
  const userTokens = JSON.parse(userTokensString);
  return userTokens?.email || null;
};
