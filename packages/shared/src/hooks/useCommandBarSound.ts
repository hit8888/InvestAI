import useSound, { UseSoundProps } from '@neuraltrade/core/hooks/useSound';

import { useCommandBarStore } from '../stores';

type UseCommandBarSoundProps = UseSoundProps;

const useCommandBarSound = (props: UseCommandBarSoundProps) => {
  const { config } = useCommandBarStore();
  const { sound_enabled } = config.command_bar ?? {};

  return useSound(props.soundPath, props.baseVolume, (sound_enabled ?? true) && (props.enabled ?? true));
};

export default useCommandBarSound;
