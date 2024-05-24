/**
 * A difference index that is backed by a source
 * as the primary index.
 *
 * - track retractions
 * - compact out retractions
 *
 * How can we compact a retraction?
 * Well if we have a retraction we know it isn't in the source.
 * So no compacting.
 *
 * We just drop retractions for compacting.
 */
export class SourceBackedDifferenceIndex {}
