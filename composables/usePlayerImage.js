export default function usePlayerImage() {
  const getPlayerImage = (playerCode) => {
    return playerCode ? `https://resources.premierleague.com/premierleague/photos/players/110x140/p${playerCode}.png` : '';
  };

  return {
    getPlayerImage,
  };
}
