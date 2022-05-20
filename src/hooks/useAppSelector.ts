import { useSelector, TypedUseSelectorHook } from 'react-redux'
import { RootState } from "../store/reducers";

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default useAppSelector;
