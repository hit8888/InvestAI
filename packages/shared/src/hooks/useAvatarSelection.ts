import { useState, useEffect } from 'react';
import {
  Avatar1,
  Avatar2,
  Avatar3,
  Avatar4,
  Avatar5,
  Avatar6,
  Avatar7,
  Avatar8,
  Avatar9,
  Avatar10,
  Avatar11,
  Avatar12,
  Avatar13,
  Avatar14,
  Avatar15,
  Avatar16,
  Avatar17,
  Avatar18,
  Avatar19,
  AvatarComponentProps,
} from '@neuraltrade/saral';

const AVATAR_COMPONENTS = [
  Avatar1,
  Avatar2,
  Avatar3,
  Avatar4,
  Avatar5,
  Avatar6,
  Avatar7,
  Avatar8,
  Avatar9,
  Avatar10,
  Avatar11,
  Avatar12,
  Avatar13,
  Avatar14,
  Avatar15,
  Avatar16,
  Avatar17,
  Avatar18,
  Avatar19,
];

const AVATAR_NAMES = [
  'Avatar 1',
  'Avatar 2',
  'Avatar 3',
  'Avatar 4',
  'Avatar 5',
  'Avatar 6',
  'Avatar 7',
  'Avatar 8',
  'Avatar 9',
  'Avatar 10',
  'Avatar 11',
  'Avatar 12',
  'Avatar 13',
  'Avatar 14',
  'Avatar 15',
  'Avatar 16',
  'Avatar 17',
  'Avatar 18',
  'Avatar 19',
];

const STORAGE_KEY = 'meaku_session_avatar';

interface AvatarInfo {
  Component: React.ComponentType<AvatarComponentProps>;
  name: string;
  index: number;
}

export const useAvatarSelection = (sessionId?: string) => {
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarInfo | null>(null);

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    const storageKey = `${STORAGE_KEY}_${sessionId}`;

    // Try to get existing avatar from localStorage
    const storedAvatarIndex = localStorage.getItem(storageKey);

    if (storedAvatarIndex !== null) {
      // Use stored avatar
      const index = parseInt(storedAvatarIndex, 10);
      if (index >= 0 && index < AVATAR_COMPONENTS.length) {
        const avatar = {
          Component: AVATAR_COMPONENTS[index],
          name: AVATAR_NAMES[index],
          index,
        };
        setSelectedAvatar(avatar);
      }
    } else {
      // Generate new random avatar
      const randomIndex = Math.floor(Math.random() * AVATAR_COMPONENTS.length);
      const newAvatar = {
        Component: AVATAR_COMPONENTS[randomIndex],
        name: AVATAR_NAMES[randomIndex],
        index: randomIndex,
      };

      setSelectedAvatar(newAvatar);

      // Store in localStorage
      localStorage.setItem(storageKey, randomIndex.toString());
    }
  }, [sessionId]);

  const regenerateAvatar = () => {
    if (!sessionId) return;

    const storageKey = `${STORAGE_KEY}_${sessionId}`;
    const randomIndex = Math.floor(Math.random() * AVATAR_COMPONENTS.length);
    const newAvatar = {
      Component: AVATAR_COMPONENTS[randomIndex],
      name: AVATAR_NAMES[randomIndex],
      index: randomIndex,
    };

    setSelectedAvatar(newAvatar);
    localStorage.setItem(storageKey, randomIndex.toString());
  };

  return {
    selectedAvatar,
    regenerateAvatar,
    isAvatarLoaded: selectedAvatar !== null,
  };
};
