import { User } from './db';

export async function getUser(username: string): Promise<any> {
  const { Item } = await User.get({
    username: username.toLowerCase(),
  });

  return Item;
}
