import {
  enableStaticRendering as enableMobxStaticRendering,
  observer,
} from 'mobx-react-lite';

import {
  ConfigProvider,
  ThemeProvider,
  configService,
  initApiHttpClient,
  monitoringErrorService,
  noDataImgSrc,
  outdatedReleaseImgSrc,
  placeholderImgSrc,
  theme,
} from '@example/shared';

import { SelectRecipient, Sign } from '../screens';

const params = new URLSearchParams(window.location.hash.split('?')[1]);

configService.init({
  apiUrl: window.__ENV__.PUBLIC_API_URL,
  monitoringDsn: window.__ENV__.PUBLIC_SENTRY_DSN,
  monitoringStand: window.__ENV__.PUBLIC_SENTRY_ENV,
  monitoringRelease: window.__ENV__.PUBLIC_RELEASE_TAG,
});

initApiHttpClient();
enableMobxStaticRendering(typeof window === 'undefined');

export const App = observer(() => {
  return (
    <ConfigProvider
      imagesMap={{
        noDataImgSrc: noDataImgSrc,
        defaultErrorImgSrc: placeholderImgSrc,
        outdatedReleaseErrorImgSrc: outdatedReleaseImgSrc,
      }}
      captureException={monitoringErrorService.captureException}
    >
      <ThemeProvider theme={theme}>
        {params.get('type') === 'select' ? <SelectRecipient /> : <Sign />}
      </ThemeProvider>
    </ConfigProvider>
  );
});

export default App;
