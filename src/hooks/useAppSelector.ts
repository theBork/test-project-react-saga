import { useSelector, TypedUseSelectorHook } from 'react-redux'
import { AppState } from "../store";

const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;

export default useAppSelector;
