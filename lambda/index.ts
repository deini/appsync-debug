import { createUser } from './createUser';
import { getUser } from './getUser';

type AppSyncEvent =
  | {
      info: { fieldName: 'getUser' };
      arguments: { username: string };
    }
  | {
      info: { fieldName: 'createUser' };
      arguments: { username: string };
    };

exports.handler = async (event: AppSyncEvent) => {
  console.log('EVEEEEEEEEENT');
  console.log(event);

  switch (event.info.fieldName) {
    case 'getUser':
      return await getUser(event.arguments.username);

    case 'createUser':
      return await createUser(event.arguments.username);

    default:
      return null;
  }
};
