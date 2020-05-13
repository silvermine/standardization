export interface IRepositoryReleaseSettings {
   release?: boolean;
   releaseName?: string;
   releaseNotes?: string;
}

export interface IReleaseItOptions {
   plugins?: {
      [pluginName: string]: Record<string, unknown>;
   };
   preRelease?: string;
   git: {
      push?: boolean;
      tag?: boolean | string;
      tagName?: string;
      tagAnnotation?: string;
      commitMessage?: string;
      changelog?: string | boolean;
      requireUpstream?: boolean;
   };
   npm: {
      publish: boolean;
   };
   gitHub?: IRepositoryReleaseSettings;
   gitLab?: IRepositoryReleaseSettings;
}
