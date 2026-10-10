import { IPlugin, IPluginRegistry } from "../interfaces/plugin.interface";
import { logger } from "./logger";

export class PluginRegistry implements IPluginRegistry {
  private plugins: Map<string, IPlugin> = new Map();

  async register(plugin: IPlugin): Promise<void> {
    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin with name "${plugin.name}" is already registered.`);
    }
    logger.info({ plugin: plugin.name }, "Initializing plugin");
    await plugin.initialize(this);
    this.plugins.set(plugin.name, plugin);
  }

  get<T extends IPlugin>(name: string): T {
    const plugin = this.plugins.get(name);
    if (!plugin) {
      throw new Error(`Plugin "${name}" not found in registry.`);
    }
    return plugin as T;
  }

  async shutdownAll(): Promise<void> {
    for (const plugin of this.plugins.values()) {
      await plugin.shutdown();
    }
    this.plugins.clear();
  }
}

export const registry = new PluginRegistry();
