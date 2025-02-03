import fs from 'fs/promises';

import { Telegraf } from 'telegraf';

// Создаем экземпляр бота
const bot = new Telegraf('7560641741:AAHHSQb677dpihj6W4TP1uKkNS1oG2fIe6M');

const filePath = './users.json';

// Функция для сохранения информации о пользователе
async function saveUserInfo(user) {
  try {
    let users = [];

    // Пробуем прочитать существующий файл
    try {
      const data = await fs.readFile(filePath, 'utf8');

      users = JSON.parse(data);
    } catch (error) {
      // Если файл не существует, создаем новый массив
      console.log('Создаем новый файл users.json');
    }

    // Проверяем, существует ли уже пользователь
    const existingUserIndex = users.findIndex((u) => u.id === user.id);

    if (existingUserIndex === -1) {
      // Добавляем нового пользователя
      users.push({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        language_code: user.language_code,
        registration_date: new Date().toISOString(),
      });
    }

    // Сохраняем обновленный список пользователей
    await fs.writeFile(filePath, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Ошибка при сохранении информации о пользователе:', error);
  }
}

// Обработка команды /start
bot.command('start', async (ctx) => {
  await saveUserInfo(ctx.from);

  ctx.reply(
    `Добро пожаловать, ${ctx.from.first_name}! Бот готов к работе. Присылайте файл для подписания`,
  );
});

// Обработка документов (файлов)
bot.on('document', async (ctx) => {
  try {
    const file = await ctx.telegram.getFile(ctx.message.document.file_id);
    const fileUrl = `https://api.telegram.org/file/bot${bot.token}/${file.file_path}`;

    const fileData = {
      fileUrl,
      fileName: ctx.message.document.file_name,
      messageId: ctx.message.message_id,
      chatId: ctx.chat.id,
    };

    const data = await fs.readFile(filePath, 'utf8');

    // Кодируем данные для передачи через URL
    const encodedData = encodeURIComponent(
      JSON.stringify({ fileData, users: JSON.parse(data) }),
    );

    await ctx.reply(
      `Выберите получателя для файла: ${ctx.message.document.file_name}`,
      {
        reply_markup: {
          keyboard: [
            [
              {
                text: 'Выбрать получателя',
                web_app: {
                  url: `https://kaluga-astral.github.io/tg-miniapp-prototype/#/select?data=${encodedData}`,
                },
              },
            ],
          ],
          resize_keyboard: true,
          one_time_keyboard: true,
          input_field_placeholder: 'Нажмите кнопку "Подписать"',
        },
      },
    );
  } catch (error) {
    console.error('Ошибка при получении файла:', error);
    ctx.reply('Произошла ошибка при обработке файла');
  }
});

// Обработка данных от веб-приложения
bot.on('web_app_data', async (ctx) => {
  if (JSON.parse(ctx.message.web_app_data.data).type === 'sign') {
    const { id: userId } = JSON.parse(ctx.message.web_app_data.data).data;
    const { messageId, chatId } = JSON.parse(
      ctx.message.web_app_data.data,
    ).fileData;

    console.log('Получены данные от веб-приложения:', ctx.message.web_app_data);

    try {
      const data = await fs.readFile(filePath, 'utf8');
      const users = JSON.parse(data);

      const recipient = users.find((user) => user.id === Number(userId));

      if (recipient) {
        // Отправляем сообщение отправителю
        await ctx.reply(
          `Файл отправлен "${recipient.first_name} ${recipient.last_name}" на подписание. Ожидайте`,
        );

        const encodedData = encodeURIComponent(
          JSON.stringify({
            fileData: JSON.parse(ctx.message.web_app_data.data).fileData,
            user: ctx.from,
          }),
        );

        // Пересылаем файл получателю
        await ctx.telegram.forwardMessage(recipient.id, chatId, messageId);

        // Отправляем сообщение с кнопкой подписания
        await ctx.telegram.sendMessage(
          recipient.id,
          `Пользователь ${ctx.from.first_name} ${
            ctx.from.last_name || ''
          } отправил вам файл на подписание. Ознакомьтесь с файлом и нажмите кнопку "Подписать"`,
          {
            reply_markup: {
              keyboard: [
                [
                  {
                    text: 'Подписать',
                    web_app: {
                      url: `https://kaluga-astral.github.io/tg-miniapp-prototype/#/sign?data=${encodedData}`,
                    },
                  },
                ],
              ],
              resize_keyboard: true,
              one_time_keyboard: true,
              input_field_placeholder: 'Нажмите кнопку "Подписать"',
            },
          },
        );
      }
    } catch (error) {
      console.error('Ошибка при обработке данных:', error);
      ctx.reply('Произошла ошибка при обработке данных');
    }
  }

  if (JSON.parse(ctx.message.web_app_data.data).type !== 'sign') {
    const { data } = JSON.parse(ctx.message.web_app_data.data);

    console.log('Получены данные от веб-приложения sign:', data);

    const { messageId, chatId } = data.fileData;
    const { id: recipientId } = data.user;

    await ctx.telegram.forwardMessage(recipientId, chatId, messageId);

    await ctx.telegram.sendMessage(
      recipientId,
      `Пользователь ${ctx.from.first_name} ${
        ctx.from.last_name || ''
      } подписал файл`,
    );
  }
});

// Запускаем бота
bot.launch();
// Включаем graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
