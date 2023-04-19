import type {
  ExperimentalNoIndexDiff,
  ExperimentalDiffOperationDel,
  ExperimentalDiffOperationAdd,
  ExperimentalDiffOperationChange,
  JSONValue,
} from '@rocicorp/reflect';

export enum OP {
  ADD = 'add',
  CHANGE = 'change',
  DELETE = 'del',
}

export const op = (op: 'add' | 'change' | 'del') =>
  op == OP.ADD ? OP.ADD : op == OP.DELETE ? OP.DELETE : OP.CHANGE;

export type Diff = ExperimentalNoIndexDiff[number];
export const isDeleteDiff = (
  diff: Diff,
): diff is ExperimentalDiffOperationDel<string> => diff.op == OP.DELETE;
export const isAddDiff = (
  diff: Diff,
): diff is ExperimentalDiffOperationAdd<string> => diff.op == OP.ADD;
export const isChangeDiff = (
  diff: Diff,
): diff is ExperimentalDiffOperationChange<string> => diff.op == OP.CHANGE;

export const getData = <T extends JSONValue>(diff: Diff): T => {
  if (isDeleteDiff(diff)) {
    return diff.oldValue as T;
  }
  return diff.newValue as T;
};
