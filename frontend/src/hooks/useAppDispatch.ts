import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';

// Typed dispatch hook
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Typed selector hook
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
