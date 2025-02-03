import {
  enableStaticRendering as enableMobxStaticRendering,
  observer,
} from 'mobx-react-lite';
import { useRoutes } from 'react-router-dom';

import {
  ConfigProvider,
  NotificationContainer,
  RouterServiceAdapter,
  ThemeProvider,
  configService,
  initApiHttpClient,
  monitoringErrorService,
  noDataImgSrc,
  outdatedReleaseImgSrc,
  placeholderImgSrc,
  theme,
} from '@example/shared';

import { routes } from './routes';

configService.init({
  apiUrl: window.__ENV__.PUBLIC_API_URL,
  monitoringDsn: window.__ENV__.PUBLIC_SENTRY_DSN,
  monitoringStand: window.__ENV__.PUBLIC_SENTRY_ENV,
  monitoringRelease: window.__ENV__.PUBLIC_RELEASE_TAG,
});

initApiHttpClient();
enableMobxStaticRendering(typeof window === 'undefined');

export const App = observer(() => {
  const renderRoutes = useRoutes(routes);

  return (
    <ConfigProvider
      imagesMap={{
        noDataImgSrc: noDataImgSrc,
        defaultErrorImgSrc: placeholderImgSrc,
        outdatedReleaseErrorImgSrc: outdatedReleaseImgSrc,
      }}
      captureException={monitoringErrorService.captureException}
    >
      <RouterServiceAdapter />
      <ThemeProvider theme={theme}>
        <NotificationContainer />
        {renderRoutes}
      </ThemeProvider>
    </ConfigProvider>
  );
});

export default App;
