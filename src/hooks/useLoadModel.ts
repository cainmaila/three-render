/* 載入模型 */

import axios from 'axios-observable/dist/axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { I_ModelMeta_v2 } from './useModelPath';

const LOADNG = 'loading';
const WATTING = 500;

const useLoadModel = () => {
  const { model } = useParams(); //router params
  const [retry, setRetry] = useState(0);
  const [modelMeta, setModelMeta] = useState<I_ModelMeta_v2 | undefined>();
  useEffect(() => {
    if (retry === 0) return;
    axios.get(`/load/${model}`).subscribe({
      next: ({ data }) => {
        if (data === LOADNG) {
          setTimeout(() => {
            setRetry(retry + 1);
          }, WATTING);
        } else {
          setModelMeta(data);
        }
      },
      error: (e) => console.error(e),
    });
  }, [retry]);
  useEffect(() => {
    setRetry(1);
    return () => {};
  }, [model]);

  return { modelMeta };
};

export default useLoadModel;
