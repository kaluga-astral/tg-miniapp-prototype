import { captureException, init } from '@sentry/browser';

import { configService } from '../ConfigService';

type MonitoringErrorServiceConfig = {
  monitoringDsn: string;
  monitoringStand: string;
  monitoringRelease: string;
};

class MonitoringErrorService {
  public captureException = captureException;

  constructor(config: MonitoringErrorServiceConfig) {
    this.init(config);
  }

  private init = (config: MonitoringErrorServiceConfig) => {
    init({
      dsn: config.monitoringDsn,
      release: config.monitoringRelease,
      dist: config.monitoringStand,
      tracesSampleRate: 1.0,
    });
  };
}

export const monitoringErrorService = new MonitoringErrorService(
  configService.config,
);
