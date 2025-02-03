import {
  Button,
  ContentState,
  Filename,
  Iframe,
  MenuItem,
  Select,
  Typography,
} from '@astral/ui';
import { useEffect, useState } from 'react';

// Объявляем типы для WebApp
declare global {
  interface Window {
    Telegram: {
      WebApp: {
        ready(): void;
        sendData(data: string): void;
        expand(): void;
        MainButton: {
          setText(text: string): void;
          onClick(fn: () => void): void;
          show(): void;
          showProgress(): void;
          hideProgress(): void;
        };
      };
    };
  }
}

const params = new URLSearchParams(window.location.search);
const {
  user,
  fileData,
}: {
  fileData: { fileUrl: string; fileName: string };
  user: any;
} = JSON.parse(params.get('data') || '{}');

export const Sign = () => {
  const handleSign = () => {
    window.Telegram.WebApp.MainButton.showProgress();

    setTimeout(() => {
      window.Telegram.WebApp.sendData(
        JSON.stringify({ data: { user, fileData } }),
      );
    }, 2000);
  };

  useEffect(() => {
    window.Telegram.WebApp.MainButton.setText('Подписать');
    window.Telegram.WebApp.MainButton.onClick(handleSign);
    window.Telegram.WebApp.MainButton.show();
    // Инициализируем WebApp при монтировании компонента
    window.Telegram.WebApp.ready();
  }, []);

  return (
    <div style={{ padding: '50px 12px 12px', display: 'grid', gap: 20 }}>
      <Typography variant="h4">Подписание файла:</Typography>
      <div style={{ maxWidth: 300 }}>
        <Filename variant="h4" color="info">
          {fileData.fileName}
        </Filename>
      </div>
    </div>
  );
};
