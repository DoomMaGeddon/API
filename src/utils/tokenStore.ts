const activeTokens: Set<string> = new Set();

const addToken = (token: string) => {
    activeTokens.add(token);
};

const removeToken = (token: string) => {
    activeTokens.delete(token);
};

const isTokenActive = (token: string) => {
    return activeTokens.has(token);
};

export { addToken, removeToken, isTokenActive };