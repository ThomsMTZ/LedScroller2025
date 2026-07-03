import {useCallback, useState} from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';

export const useOrientation = () => {
    const [isLandscapeLocked, setIsLandscapeLocked] = useState<boolean>(false);

    const lockLandscape = useCallback(async () => {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        setIsLandscapeLocked(true);
    }, []);

    const unlockOrientation = useCallback(async () => {
        await ScreenOrientation.unlockAsync();
        setIsLandscapeLocked(false);
    }, []);

    const toggleOrientation = useCallback(async () => {
        if (isLandscapeLocked) {
            await unlockOrientation();
        } else {
            await lockLandscape();
        }
    }, [isLandscapeLocked, lockLandscape, unlockOrientation]);

    return {
        isLandscapeLocked,
        setIsLandscapeLocked,
        toggleOrientation,
        lockLandscape,
    };
};
