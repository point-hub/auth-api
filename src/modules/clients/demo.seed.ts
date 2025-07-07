import { type IDatabase } from '@point-hub/papi'

export const seed = async (dbConnection: IDatabase, options: unknown) => {
  console.info(`[seed] clients data`)
  const documents: { name: string }[] = [{ name: 'client 1' }, { name: 'client 2' }]
  await dbConnection.collection('clients').createMany(documents, options)
}
