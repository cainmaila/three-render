import { useRecoilState } from 'recoil';
import { atom } from 'recoil';

export enum VIEWER_PAGE_STATE {
  INIT = '',
  LOADING = 'LOADING',
  ERROR = 'ERROR',
  VIEW = 'view',
}

const viewerPageState = atom<VIEWER_PAGE_STATE>({
  key: 'viewerPageState',
  default: VIEWER_PAGE_STATE.INIT,
});

const viewerPageStateMessage = atom<string>({
  key: 'viewerPageStateMessage',
  default: '',
});

/* 頁面狀態 */
export const useViewerPageState = () => {
  const [getViewerPageState, setSiewerPageState] =
    useRecoilState(viewerPageState);
  const [getViewerPageStateMessage, setViewerPageStateMessage] = useRecoilState(
    viewerPageStateMessage,
  );
  return {
    viewerPageState: getViewerPageState,
    setSiewerPageState,
    viewerPageStateMessage: getViewerPageStateMessage,
    setViewerPageStateMessage,
  };
};
