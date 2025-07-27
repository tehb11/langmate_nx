import { useStore } from '@tanstack/react-store';
import { store } from './store';
import { GlobalState } from './types';

export const useAppStore = () => useStore(store, (state: GlobalState) => state);
