export type ASTHash = string;
import type {AST} from 'zql/src/zql/ast/ast.js';
import {buildPipeline} from 'zql/src/zql/ast-to-ivm/pipeline-builder.js';
import {TreeView} from 'zql/src/zql/ivm/view/tree-view.js';
import {assert} from 'shared/src/asserts.js';
import {makeComparator} from 'zql/src/zql/ivm/compare.js';
import type {PipelineEntity} from 'zql/src/zql/ivm/types.js';
import type {GroupAndClientIDStr} from './view-syncer.js';
import type {ZQLiteContext} from '../context.js';

/**
 * In the future, there will be one PipelineManager per ViewSyncer process.
 *
 * The PipelineManager holds all the queries that are currently being executed.
 * De-duped by unique hash.
 */
export class PipelineManager {
  readonly #pipelines = new Map<ASTHash, TreeView<PipelineEntity>>();
  readonly #pipelineConsumers = new Map<ASTHash, Set<GroupAndClientIDStr>>();
  readonly #consumersToHashes = new Map<GroupAndClientIDStr, Set<ASTHash>>();
  readonly context: ZQLiteContext;

  constructor(context: ZQLiteContext) {
    this.context = context;
  }

  getOrCreatePipeline(consumer: GroupAndClientIDStr, hash: ASTHash, ast: AST) {
    this.#updateConsumerMapping(consumer, hash);

    const existing = this.#pipelines.get(hash);
    if (existing) {
      return existing;
    }

    const pipeline = buildPipeline(
      (sourceName: string) => this.context.getSource(sourceName),
      ast,
      true,
    );

    const {orderBy, limit} = ast;
    assert(orderBy);
    assert(orderBy.length > 0);

    const view = new TreeView(
      this.context,
      pipeline,
      makeComparator<Record<string, unknown>>(orderBy),
      orderBy,
      limit,
      ast.table,
      false,
    );
    this.#pipelines.set(hash, view);

    view.pullHistoricalData();

    return view;
  }

  #updateConsumerMapping(consumer: GroupAndClientIDStr, hash: ASTHash) {
    let consumers = this.#pipelineConsumers.get(hash);
    if (!consumers) {
      consumers = new Set();
      this.#pipelineConsumers.set(hash, consumers);
    }
    consumers.add(consumer);

    let hashes = this.#consumersToHashes.get(consumer);
    if (!hashes) {
      hashes = new Set();
      this.#consumersToHashes.set(consumer, hashes);
    }
    hashes.add(hash);
  }

  removeConsumer(consumer: GroupAndClientIDStr) {
    const hashes = this.#consumersToHashes.get(consumer);
    if (!hashes) {
      return;
    }

    for (const hash of hashes) {
      const consumers = this.#pipelineConsumers.get(hash);
      assert(consumers, 'consumers should exist for the hash');

      consumers.delete(consumer);
      if (consumers.size === 0) {
        this.#pipelines.get(hash)?.destroy();
        this.#pipelines.delete(hash);
        this.#pipelineConsumers.delete(hash);
      }
    }

    this.#consumersToHashes.delete(consumer);
  }
}
