import type {Mutation} from 'src/protocol/push';
import type {ClientGroupID} from './client-state';

export type PendingMutationMap = Map<ClientGroupID, Mutation[]>;
