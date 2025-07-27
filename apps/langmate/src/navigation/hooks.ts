import { useNavigation } from '@react-navigation/native';
import { AppNavigationProp } from './utils';

export const useAppNavigation = () => useNavigation<AppNavigationProp>();
