import { availableKeysMap, AvailableKeys } from "../constants/keys";

export const getRandomAvailableKey = () => {
  const availableKeys = Object.keys(availableKeysMap) as AvailableKeys[];
  return availableKeys[Math.floor(Math.random() * 4)];
};
