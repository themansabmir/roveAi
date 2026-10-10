export interface IPlugin {
  name: string;
  initialize(registry: IPluginRegistry): Promise<void>;
  shutdown(): Promise<void>;
}

export interface IPluginRegistry {
  register(plugin: IPlugin): Promise<void>;
  get<T extends IPlugin>(name: string): T;
  shutdownAll(): Promise<void>;
}
