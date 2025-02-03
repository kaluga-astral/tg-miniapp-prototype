import { Placeholder } from '@example/shared';

type Props = {
  title?: string;
};

export const NotFoundScreen = ({ title = 'Не найдено' }: Props) => {
  return <Placeholder title={title} />;
};
