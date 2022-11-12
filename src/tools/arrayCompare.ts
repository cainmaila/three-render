/**
 * 比較出 arrB 來過過濾 arrA，列出 B 沒有的值
 * @param arrA
 * @param arrB
 * @returns
 */
export const difference = <T>(arrA: T[], arrB: T[]) => {
  return arrA.filter((e) => {
    return arrB.indexOf(e) === -1;
  });
};
