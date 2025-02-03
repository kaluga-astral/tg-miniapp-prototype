// @ts-nocheck
const { Project } = require('ts-morph');
const ts = require('typescript');

const project = new Project({
  tsConfigFilePath: 'tsconfig.json',
});

// Создаем временный файл с исходным кодом
const sourceFile = project.createSourceFile(
  'sources.ts',
  `
import { httpService } from './httpService';

type DataDTO = { bla: string };

type Params1 = {
  id: string;
};

type Params2 = {
  offset: number;
};

/**
 * Объект с эндпоинтами для запросов к API
 */
export const sources = {
  /**
   * Получение данных пользователя
   * @param params Параметры запроса
   */
  getUser: (params: Params1) => pupy.get<DataDTO>('/user', params),
  getUserList: (params: Params2) => httpService.get<DataDTO>('/user/list', params),
};

export type { DataDTO, Params1, Params2 };
`,
  { overwrite: true },
);

// Получаем объявление sources
const sourcesDeclaration = sourceFile.getVariableDeclaration('sources');
const sourcesObject = sourcesDeclaration?.getInitializer();

if (!sourcesObject) {
  throw new Error('Не найдено объявление sources');
}

// Функция для преобразования имени метода
const transformMethodName = (name: string): string => {
  const prefixes = ['get', 'fetch', 'load', 'retrieve'];

  for (const prefix of prefixes) {
    if (name.startsWith(prefix)) {
      // Убираем префикс и делаем первую букву строчной
      const withoutPrefix = name.slice(prefix.length);

      return withoutPrefix.charAt(0).toLowerCase() + withoutPrefix.slice(1);
    }
  }

  return name;
};

// Получаем все методы из sources
const methods = sourceFile.getDescendantsOfKind(
  ts.SyntaxKind.PropertyAssignment,
);

// Разделяем методы на обычные и бесконечные
const { infiniteMethods, regularMethods } = methods.reduce(
  (acc: { infiniteMethods: ts.Node[]; regularMethods: ts.Node[] }, method) => {
    const parameters = method.getFirstDescendantByKind(ts.SyntaxKind.Parameter);
    const parameterType = parameters?.getType();
    const hasOffset = parameterType
      ?.getProperties()
      .some((prop) => prop.getName() === 'offset');

    if (hasOffset) {
      acc.infiniteMethods.push(method);
    } else {
      acc.regularMethods.push(method);
    }

    return acc;
  },
  { infiniteMethods: [], regularMethods: [] },
);

// Преобразуем обычные методы
const transformedRegularMethods = regularMethods
  .map((method) => {
    const oldName = method.getName();
    const newName = transformMethodName(oldName);

    const jsDoc =
      method
        .getLeadingCommentRanges()
        ?.map((comment) => comment.getText())
        .join('\n') || '';

    return `${jsDoc}\n  ${newName}: sources.${oldName}`;
  })
  .join(',\n  ');

// Преобразуем бесконечные методы
const transformedInfiniteMethods = infiniteMethods
  .map((method) => {
    const oldName = method.getName();
    const newName = transformMethodName(oldName);

    const jsDoc =
      method
        .getLeadingCommentRanges()
        ?.map((comment) => comment.getText())
        .join('\n') || '';

    return `${jsDoc}\n  ${newName}: sources.${oldName}`;
  })
  .join(',\n  ');

// Создаем новый fetcher объект
const fetcherObject = `{
  endpoints: sources,
  queries: {${transformedRegularMethods}},
  mutations: {},
  infiniteQueries: {${transformedInfiniteMethods}}
}`;

// Создаем новый файл с fetcher
const resultFile = project.createSourceFile(
  'result.ts',
  `
import { sources } from './sources';
import type { DataDTO, Params1, Params2 } from './sources';

import { createFetcherFactory } from './Fetcher';
import { MobxQuery } from '../MobxQuery';
import { RestPrefixQueryDetector } from './queries';

const cache = new MobxQuery();

const fetcher = createFetcherFactory(cache, new RestPrefixQueryDetector())(${fetcherObject});
`,
  { overwrite: true },
);

// Сохраняем результат
resultFile.saveSync();
sourceFile.saveSync();
