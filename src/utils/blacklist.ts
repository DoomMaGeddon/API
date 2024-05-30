const revokedTokens: string[] = [];

const addToBlacklist = (token: string) => {
    revokedTokens.push(token);
};

const isTokenRevoked = (token: string) => {
    return revokedTokens.includes(token);
};

export { addToBlacklist, isTokenRevoked };