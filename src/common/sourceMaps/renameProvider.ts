/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { inject, injectable } from 'inversify';
import { MappingItem } from 'source-map';
import { ISourceWithMap, Source, SourceFromMap } from '../../adapter/sources';
import { StackFrame } from '../../adapter/stackTrace';
import { AnyLaunchConfiguration } from '../../configuration';
import { Base01Position, IPosition } from '../positions';
import { PositionToOffset } from '../stringUtils';
import { SourceMap } from './sourceMap';
import { ISourceMapFactory } from './sourceMapFactory';

interface IRename {
  original: string;
  compiled: string;
  position: Base01Position;
}

export interface IRenameProvider {
  /**
   * Provides renames at the given stackframe.
   */
  provideOnStackframe(frame: StackFrame): RenameMapping | Promise<RenameMapping>;

  /**
   * Provides renames for the given Source.
   */
  provideForSource(source: Source | undefined): RenameMapping | Promise<RenameMapping>;
}

export const IRenameProvider = Symbol('IRenameProvider');

@injectable()
export class RenameProvider implements IRenameProvider {
  private renames = new Map</* source uri */ string, Promise<RenameMapping>>();

  constructor(
    @inject(ISourceMapFactory) private readonly sourceMapFactory: ISourceMapFactory,
    @inject(AnyLaunchConfiguration) private readonly launchConfig: AnyLaunchConfiguration,
  ) {}

  /**
   * @inheritdoc
   */
  public provideOnStackframe(frame: StackFrame) {
    if (!this.launchConfig.sourceMapRenames) {
      return RenameMapping.None;
    }

    const location = frame.uiLocation();
    if (location === undefined) {
      return RenameMapping.None;
    } else if ('then' in location) {
      return location.then(s => this.provideForSource(s?.source));
    } else {
      return this.provideForSource(location?.source);
    }
  }

  /**
   * @inheritdoc
   */
  public provideForSource(source: Source | undefined) {
    if (!this.launchConfig.sourceMapRenames) {
      return RenameMapping.None;
    }

    if (!(source instanceof SourceFromMap)) {
      return RenameMapping.None;
    }

    const original: ISourceWithMap | undefined = source.compiledToSourceUrl.keys().next().value;
    if (!original) {
      throw new Error('unreachable');
    }

    const cached = this.renames.get(original.url);
    if (cached) {
      return cached;
    }

    const promise = this.sourceMapFactory
      .load(original.sourceMap.metadata)
      .then(async sm => {
        if (!sm?.hasNames) {
          return RenameMapping.None;
        }

        const content = await original.content();
        return content ? this.createFromSourceMap(sm, content) : RenameMapping.None;
      })
      .catch(() => RenameMapping.None);

    this.renames.set(original.url, promise);
    return promise;
  }

  private createFromSourceMap(sourceMap: SourceMap, content: string) {
    const toOffset = new PositionToOffset(content);
    const renames: IRename[] = [];

    // todo: may eventually want to be away
    let pendingName: MappingItem | undefined;
    sourceMap.eachMapping(mapping => {
      if (pendingName) {
        const startPos = new Base01Position(pendingName.generatedLine, pendingName.generatedColumn);
        const start = toOffset.convert(startPos);
        const end = toOffset.convert(
          new Base01Position(mapping.generatedLine, mapping.generatedColumn),
        );
        renames.push({
          compiled: content.slice(start, end),
          original: pendingName.name,
          position: startPos,
        });
        pendingName = undefined;
      }

      if (mapping.name) {
        pendingName = mapping;
      }
    });

    if (pendingName) {
      const position = new Base01Position(pendingName.generatedLine, pendingName.generatedColumn);
      renames.push({
        compiled: content.slice(toOffset.convert(position)),
        original: pendingName.name,
        position,
      });
    }

    renames.sort((a, b) => a.position.compare(b.position));

    return new RenameMapping(renames);
  }
}

/**
 * Accessor for mapping of compiled and original source names. This works by
 * getting the rename closest to a compiled position. It would be more
 * correct to parse the AST and use scopes, but doing so is relatively slow.
 * This is probably good enough.
 */
export class RenameMapping {
  public static None = new RenameMapping([]);

  constructor(private readonly renames: readonly IRename[]) {}

  /**
   * Gets the original identifier name from a compiled name, with the
   * interpreter paused at the given position.
   */
  public getOriginalName(compiledName: string, compiledPosition: IPosition) {
    return this.getClosestRename(compiledPosition, r => r.compiled === compiledName)?.original;
  }

  /**
   * Gets the compiled identifier name from an original name.
   */
  public getCompiledName(originalName: string, compiledPosition: IPosition) {
    return this.getClosestRename(compiledPosition, r => r.original === originalName)?.compiled;
  }

  private getClosestRename(compiledPosition: IPosition, filter: (rename: IRename) => boolean) {
    const compiled01 = compiledPosition.base01;
    let best: IRename | undefined;

    for (const rename of this.renames) {
      if (!filter(rename)) {
        continue;
      }

      const isBefore = rename.position.compare(compiled01) < 0;
      if (!isBefore && best) {
        return best;
      }

      best = rename;
    }

    return best;
  }
}
