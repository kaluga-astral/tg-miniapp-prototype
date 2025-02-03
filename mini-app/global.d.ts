/// <reference types="@astral/ui/declarations" />
/// <reference types="vite-plugin-svgr/client" />

declare module '*.woff' {
  const src: string;

  export default src;
}

declare module '*.woff2' {
  const src: string;

  export default src;
}

declare module '*.png' {
  const content: string;
  export default content;
}
declare module '*.jpg' {
  const content: string;
  export default content;
}
declare module '*.jpeg' {
  const content: string;
  export default content;
}
declare module '*.webp' {
  const content: string;
  export default content;
}
declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.svg' {
  import React = require('react');

  export const ReactComponent: React.SFC<React.SVGProps<SVGSVGElement>>;

  const src: string;

  export default src;
}

interface Window {
  __ENV__: {
    PUBLIC_API_URL: string;
    PUBLIC_SENTRY_DSN: string;
    PUBLIC_SENTRY_ENV: string;
    PUBLIC_RELEASE_TAG: string;
  };
}
