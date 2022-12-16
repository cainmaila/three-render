import axios from 'axios-observable/dist/axios';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { first, map, mergeAll } from 'rxjs';
import { useEffectOnce } from 'usehooks-ts';
import { I_ModelMeta, MODEL_TYPE } from '../setting';

export interface I_ModelMeta_v2 {
  id: string;
  path: string;
  initPosition: [number, number, number];
  type: MODEL_TYPE;
  tag?: string;
}

export default (config: string) => {
  const { model } = useParams(); //router params
  const [modelMeta, setModelMeta] = useState<I_ModelMeta | undefined>();

  useEffectOnce(() => {
    axios
      .get(config)
      .pipe(
        map((res) => res?.data?.models),
        mergeAll(),
        first((_item) => {
          const item = _item as unknown as I_ModelMeta_v2;
          return item.id === model;
        }),
      )
      .subscribe((meta) => {
        const _a = meta as I_ModelMeta;
        setModelMeta(_a);
      });
  });
  return {
    modelMeta,
  };
};
