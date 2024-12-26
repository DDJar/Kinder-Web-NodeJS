import { useContext } from 'react';
import { UserProviderContext } from './userProvider';

export const useUserProvider = () => useContext(UserProviderContext);
