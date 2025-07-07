import { objClean } from '@point-hub/express-utils'
import type { IController, IControllerInput } from '@point-hub/papi'

import { UniqueValidation } from '@/utils/unique-validation'
import { schemaValidation } from '@/utils/validation'

import { CreateClientRepository } from '../repositories/create.repository'
import { CreateManyClientRepository } from '../repositories/create-many.repository'
import { DeleteClientRepository } from '../repositories/delete.repository'
import { DeleteManyClientRepository } from '../repositories/delete-many.repository'
import { UpdateClientRepository } from '../repositories/update.repository'
import { UpdateManyClientRepository } from '../repositories/update-many.repository'
import { CreateClientUseCase } from '../use-cases/create.use-case'
import { CreateManyClientUseCase } from '../use-cases/create-many.use-case'
import { DeleteClientUseCase } from '../use-cases/delete.use-case'
import { DeleteManyClientUseCase } from '../use-cases/delete-many.use-case'
import { UpdateClientUseCase } from '../use-cases/update.use-case'
import { UpdateManyClientUseCase } from '../use-cases/update-many.use-case'

export const transactionClientController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const createClientRepository = new CreateClientRepository(controllerInput.dbConnection, { session })
    const createManyClientRepository = new CreateManyClientRepository(controllerInput.dbConnection, { session })
    const updateClientRepository = new UpdateClientRepository(controllerInput.dbConnection, { session })
    const updateManyClientRepository = new UpdateManyClientRepository(controllerInput.dbConnection, { session })
    const deleteClientRepository = new DeleteClientRepository(controllerInput.dbConnection, { session })
    const deleteManyClientRepository = new DeleteManyClientRepository(controllerInput.dbConnection, { session })
    const uniqueValidation = new UniqueValidation(controllerInput.dbConnection)
    // 3. handle business rules
    const responseCreate = await CreateClientUseCase.handle(controllerInput.httpRequest['body'].new, {
      createClientRepository,
      schemaValidation,
      uniqueValidation,
      objClean,
    })
    // 3.1. create
    await CreateClientUseCase.handle(controllerInput.httpRequest['body'].create, {
      createClientRepository,
      schemaValidation,
      uniqueValidation,
      objClean,
    })
    await session.commitTransaction()
    session.startTransaction()
    // 3.2. create many
    const responseCreateMany = await CreateManyClientUseCase.handle(controllerInput.httpRequest['body'].createMany, {
      createManyClientRepository,
      schemaValidation,
      uniqueValidation,
      objClean,
    })
    await session.commitTransaction()
    session.startTransaction()
    // 3.3. update
    await UpdateClientUseCase.handle(
      {
        _id: responseCreate.inserted_id,
        data: {
          name: controllerInput.httpRequest['body'].update.name,
        },
      },
      {
        uniqueValidation,
        updateClientRepository,
        schemaValidation,
        objClean,
      },
    )
    await session.commitTransaction()
    session.startTransaction()
    // 3.4. update many
    await UpdateManyClientUseCase.handle(
      {
        filter: {
          name: controllerInput.httpRequest['body'].updateMany.filter.name,
        },
        data: {
          name: controllerInput.httpRequest['body'].updateMany.data.name,
        },
      },
      {
        updateManyClientRepository,
        schemaValidation,
        objClean,
      },
    )
    await session.commitTransaction()
    session.startTransaction()
    // 3.5. delete
    await DeleteClientUseCase.handle(
      { _id: controllerInput.httpRequest['body'].delete === true ? responseCreate.inserted_id : '' },
      {
        schemaValidation,
        deleteClientRepository,
      },
    )
    await session.commitTransaction()
    session.startTransaction()
    // 3.6. delete many
    await DeleteManyClientUseCase.handle(
      { ids: controllerInput.httpRequest['body'].deleteMany === true ? responseCreateMany.inserted_ids : [''] },
      {
        schemaValidation,
        deleteManyClientRepository,
      },
    )
    await session.commitTransaction()
    // 4. return response to client
    return {
      status: 201,
      json: {
        inserted_id: responseCreate.inserted_id,
      },
    }
  } catch (error) {
    await session?.abortTransaction()
    throw error
  } finally {
    await session?.endSession()
  }
}
