import { Button, Filename, MenuItem, Select, Typography } from '@astral/ui';
import { useEffect, useState } from 'react';

// Объявляем типы для WebApp
declare global {
  interface Window {
    Telegram: {
      WebApp: {
        ready(): void;
        sendData(data: string): void;
        expand(): void;
      };
    };
  }
}

const params = new URLSearchParams(window.location.search);

const {
  users,
  fileData,
}: {
  users: Array<{
    id: string;
    first_name: string;
    last_name: string;
  }>;
  fileData: { fileUrl: string; fileName: string };
} = JSON.parse(params.get('data') || '{}');

let valueG;

export const SelectRecipient = () => {
  const [value, setValue] = useState<string>();

  const handleSend = () => {
    const data = users.find(
      (user) => `${user.first_name} ${user.last_name}` === valueG,
    );

    window.Telegram.WebApp.sendData(
      JSON.stringify({
        data,
        fileData,
        type: 'sign',
      }),
    );
  };

  const handleSelect = (event) => {
    setValue(event.target.value);
    valueG = event.target.value;
    window.Telegram.WebApp.MainButton.show();
  };

  useEffect(() => {
    window.Telegram.WebApp.MainButton.setText('Отправить');
    window.Telegram.WebApp.MainButton.onClick(handleSend);
    // Инициализируем WebApp при монтировании компонента
    window.Telegram.WebApp.ready();
  }, []);

  useEffect(() => {
    if (!value) {
      window.Telegram.WebApp.MainButton.hide();
    }
  }, [value]);

  return (
    <div style={{ padding: '50px 12px 12px', display: 'grid', gap: 20 }}>
      <Typography variant="h4">Выберите получателя для файла:</Typography>
      <div style={{ maxWidth: 300 }}>
        <Filename variant="h4" color="info">
          {fileData.fileName}
        </Filename>
      </div>
      <Select
        label="Получатель"
        placeholder="Выберите получателя"
        value={value}
        onChange={handleSelect}
      >
        {users.map((user) => (
          <MenuItem value={`${user.first_name} ${user.last_name}`}>
            {user.first_name} {user.last_name}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};
