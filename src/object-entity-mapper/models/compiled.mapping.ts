export class CompiledMapping {
  public readonly entityKeys: string[];
  public readonly nestedEntityKeys: string[];
  public readonly objectKeyToEntityKeyMap: Record<string, string>;
  public readonly entityKeyToObjectKeyMap: Record<string, string>;
  public readonly objectKeyToFuncMap: Record<string, (i: unknown) => unknown>;
  public readonly entityKeyToFuncMap: Record<string, (i: unknown) => unknown>;
  public readonly objectElementKeyToFuncMap: Record<string, (i: unknown) => unknown>;
  public readonly entityElementKeyToFuncMap: Record<string, (i: unknown) => unknown>;
  public readonly objectKeyToNestedMapping: Record<string, CompiledMapping>;
  public readonly entityKeyToNestedMapping: Record<string, CompiledMapping>;

  constructor() {
    this.entityKeys = [];
    this.nestedEntityKeys = [];
    this.objectKeyToEntityKeyMap = {};
    this.entityKeyToObjectKeyMap = {};
    this.objectKeyToFuncMap = {};
    this.entityKeyToFuncMap = {};
    this.objectElementKeyToFuncMap = {};
    this.entityElementKeyToFuncMap = {};
    this.objectKeyToNestedMapping = {};
    this.entityKeyToNestedMapping = {};
  }
}
