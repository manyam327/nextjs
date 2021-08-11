declare module '*.svg' {
  import * as React from 'react';

  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement>
  >;

  export default ReactComponent;
}

declare module 'react-bs-notifier' {
  let AlertList: any;
  export { AlertList };
}

declare module 'react-animated-number' {
  let variable: any = function () { };
  export default variable;
}