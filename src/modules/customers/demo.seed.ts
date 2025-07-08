import { type IDatabase } from '@point-hub/papi'

export const seed = async (dbConnection: IDatabase, options: unknown) => {
  console.info(`[seed] customers data`)
  const documents: { name: string }[] = [{ name: 'customer 1' }, { name: 'customer 2' }]
  await dbConnection.collection('customers').createMany(documents, options)
}
