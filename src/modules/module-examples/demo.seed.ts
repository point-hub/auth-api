import { type IDatabase } from '@point-hub/papi'

export const seed = async (dbConnection: IDatabase, options: unknown) => {
  console.info(`[seed] module_examples data`)
  const documents: { name: string }[] = [{ name: 'module example 1' }, { name: 'module example 2' }]
  await dbConnection.collection('module_examples').createMany(documents, options)
}
