export class AppConfig {
    userName: string;

    public static async loadFromFile(filepath: string): Promise<AppConfig> {
      return new AppConfig();
    }

    public static async saveToFile(filepath: string): Promise<void> {
      return;
    }
}
