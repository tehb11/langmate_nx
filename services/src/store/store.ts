import { Store } from '@tanstack/react-store';

import { initialState } from './initialState';

export const store = new Store(initialState);
