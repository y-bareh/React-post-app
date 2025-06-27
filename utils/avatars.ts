// Avatar utility functions
const avatarImages = [
  require('@/avatar1.avif'),
  require('@/avatar2.avif'),
  require('@/avatar3.avif'),
  require('@/avatar4.avif'),
];

export const getAvatarForUser = (userId: number) => {
  const index = userId % avatarImages.length;
  return avatarImages[index];
};

export const getRandomAvatar = () => {
  const randomIndex = Math.floor(Math.random() * avatarImages.length);
  return avatarImages[randomIndex];
};
