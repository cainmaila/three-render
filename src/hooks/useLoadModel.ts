/* 載入模型 */

import axios from 'axios-observable/dist/axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useViewerPageState, VIEWER_PAGE_STATE } from './pageState';
import { I_ModelMeta_v2 } from './useModelPath';

const LOADNG = 'loading';
const WATTING = 500;

const useLoadModel = () => {
  const { model } = useParams(); //router params
  const [retry, setRetry] = useState(0);
  const [modelMeta, setModelMeta] = useState<I_ModelMeta_v2 | undefined>();
  const { setSiewerPageState, setViewerPageStateMessage } =
    useViewerPageState();
  useEffect(() => {
    if (retry === 0) return;
    axios.get(`/load/${model}`).subscribe({
      next: ({ data }) => {
        if (data === LOADNG) {
          setTimeout(() => {
            setRetry(retry + 1);
          }, WATTING);
        } else {
          if (data.error) {
            console.error('⁉️', data);
            setViewerPageStateMessage(data?.error);
            setSiewerPageState(VIEWER_PAGE_STATE.ERROR);
          } else {
            setModelMeta(data);
            setSiewerPageState(VIEWER_PAGE_STATE.VIEW);
          }
        }
      },
      error: (e) => {
        setViewerPageStateMessage(e.message);
        setSiewerPageState(VIEWER_PAGE_STATE.ERROR);
      },
    });
  }, [retry]);
  useEffect(() => {
    setSiewerPageState(VIEWER_PAGE_STATE.LOADING);
    setRetry(1);
    return () => {
      setSiewerPageState(VIEWER_PAGE_STATE.INIT);
    };
  }, [model]);

  return { modelMeta };
};

export default useLoadModel;
