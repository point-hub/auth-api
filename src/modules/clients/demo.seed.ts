import { type IDatabase } from '@point-hub/papi'

export const seed = async (dbConnection: IDatabase, options: unknown) => {
  console.info(`[seed] clients data`)
  const documents: { name: string }[] = []
  await dbConnection.collection('clients').createMany(documents, options)
}
