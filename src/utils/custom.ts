import _ from 'lodash';

export function removeUndefinedAndEmpty(
  obj: Record<string, any>,
): Record<string, any> {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([_, value]) => value !== undefined && value !== '',
    ),
  );
}

type FilterKeys<T> = Array<keyof T>;

interface GetInfoDataParams<T> {
  filterKeys: FilterKeys<T>;
  object: T;
}

export const getInfoData = <T>({
  filterKeys,
  object,
}: GetInfoDataParams<T>): Partial<T> => {
  return _.pick(object, filterKeys);
};
