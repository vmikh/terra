// Keep compressed files in browser memory; only active textures are decoded on GPU.
export class TextureCache {
  private requests = new Map<string, Promise<string>>();
  private urls = new Set<string>();
  private completed = new Set<string>();
  private controller = new AbortController();
  private running = false;
  constructor(
    private manifest: string[],
    private progress: (done: number, total: number, failed: boolean) => void,
  ) {}
  get(path: string): Promise<string> {
    if (this.controller.signal.aborted)
      return Promise.reject(new Error('disposed'));
    const existing = this.requests.get(path);
    if (existing) return existing;
    const request = fetch(path, { signal: this.controller.signal })
      .then(async (response) => {
        if (!response.ok)
          throw new Error(`Texture ${response.status}: ${path}`);
        const blob = await response.blob();
        if (this.controller.signal.aborted) throw new Error('disposed');
        const url = URL.createObjectURL(blob);
        this.urls.add(url);
        this.completed.add(path);
        this.report(false);
        return url;
      })
      .catch((error) => {
        this.requests.delete(path);
        throw error;
      });
    this.requests.set(path, request);
    return request;
  }
  private report(failed: boolean) {
    if (!this.controller.signal.aborted)
      this.progress(
        this.manifest.filter((path) => this.completed.has(path)).length,
        this.manifest.length,
        failed,
      );
  }
  async preload() {
    if (this.running || this.controller.signal.aborted) return;
    this.running = true;
    this.report(false);
    // Preserve foreground request deduplication and avoid flooding the connection.
    const queue = this.manifest.filter((path) => !this.completed.has(path));
    let cursor = 0;
    await Promise.all(
      Array.from({ length: 3 }, async () => {
        while (cursor < queue.length && !this.controller.signal.aborted) {
          const path = queue[cursor++];
          for (let attempt = 0; attempt < 2; attempt++) {
            try {
              await this.get(path);
              break;
            } catch {
              /* Retry once, then allow manual retry. */
            }
          }
        }
      }),
    );
    this.running = false;
    this.report(this.manifest.some((path) => !this.completed.has(path)));
  }
  dispose() {
    this.controller.abort();
    this.urls.forEach((url) => URL.revokeObjectURL(url));
    this.urls.clear();
    this.requests.clear();
  }
}
