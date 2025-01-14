import type { TypedUseSelectorHook } from "react-redux";
import { useDispatch, useSelector, useStore } from "react-redux";
import { AppDispatch, RootState, AppStore } from "./store";

// these will replace redux's vanilla useDispatch and useSelector
export const useAppDispatch : ()=>AppDispatch = useDispatch;
export const useAppSelector : TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore : ()=>AppStore = useStore