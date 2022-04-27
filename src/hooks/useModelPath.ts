import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { filter, find, from, map } from 'rxjs';
import setting, { I_ModelMeta } from '../setting';

export default () => {
  const { model } = useParams(); //router params
  const [modelMeta, setModelMeta] = useState<I_ModelMeta | undefined>();
  useEffect(() => {
    from(Object.entries(setting))
      .pipe(
        find((item) => {
          return item[0] === model;
        }),
        filter((item) => !!item),
        map((array) => array && { ...array[1], tag: array[0] }),
      )
      .subscribe((meta) => {
        const _a = meta as I_ModelMeta;
        setModelMeta(_a);
      });
  }, [model]);
  return {
    modelMeta,
  };
};
