import { User } from './db';

export async function createUser(username: string): Promise<any> {
  try {
    // @ts-ignore
    const { Attributes } = await User.update(
      {
        username,
      },
      {
        returnValues: 'ALL_NEW',
        conditions: {
          attr: 'pk',
          exists: false,
        },
      },
    );

    return Attributes;
  } catch (e) {
    if (e.code === 'ConditionalCheckFailedException') {
      throw new Error('Username not available.');
    }

    throw e;
  }
}
