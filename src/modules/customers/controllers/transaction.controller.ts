import { objClean } from '@point-hub/express-utils'
import type { IController, IControllerInput } from '@point-hub/papi'

import { UniqueValidation } from '@/utils/unique-validation'
import { schemaValidation } from '@/utils/validation'

import { CreateCustomerRepository } from '../repositories/create.repository'
import { CreateManyCustomerRepository } from '../repositories/create-many.repository'
import { DeleteCustomerRepository } from '../repositories/delete.repository'
import { DeleteManyCustomerRepository } from '../repositories/delete-many.repository'
import { UpdateCustomerRepository } from '../repositories/update.repository'
import { UpdateManyCustomerRepository } from '../repositories/update-many.repository'
import { CreateCustomerUseCase } from '../use-cases/create.use-case'
import { CreateManyCustomerUseCase } from '../use-cases/create-many.use-case'
import { DeleteCustomerUseCase } from '../use-cases/delete.use-case'
import { DeleteManyCustomerUseCase } from '../use-cases/delete-many.use-case'
import { UpdateCustomerUseCase } from '../use-cases/update.use-case'
import { UpdateManyCustomerUseCase } from '../use-cases/update-many.use-case'

export const transactionCustomerController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const createCustomerRepository = new CreateCustomerRepository(controllerInput.dbConnection, { session })
    const createManyCustomerRepository = new CreateManyCustomerRepository(controllerInput.dbConnection, { session })
    const updateCustomerRepository = new UpdateCustomerRepository(controllerInput.dbConnection, { session })
    const updateManyCustomerRepository = new UpdateManyCustomerRepository(controllerInput.dbConnection, { session })
    const deleteCustomerRepository = new DeleteCustomerRepository(controllerInput.dbConnection, { session })
    const deleteManyCustomerRepository = new DeleteManyCustomerRepository(controllerInput.dbConnection, { session })
    const uniqueValidation = new UniqueValidation(controllerInput.dbConnection)
    // 3. handle business rules
    const responseCreate = await CreateCustomerUseCase.handle(controllerInput.httpRequest['body'].new, {
      createCustomerRepository,
      schemaValidation,
      uniqueValidation,
      objClean,
    })
    // 3.1. create
    await CreateCustomerUseCase.handle(controllerInput.httpRequest['body'].create, {
      createCustomerRepository,
      schemaValidation,
      uniqueValidation,
      objClean,
    })
    await session.commitTransaction()
    session.startTransaction()
    // 3.2. create many
    const responseCreateMany = await CreateManyCustomerUseCase.handle(controllerInput.httpRequest['body'].createMany, {
      createManyCustomerRepository,
      schemaValidation,
      uniqueValidation,
      objClean,
    })
    await session.commitTransaction()
    session.startTransaction()
    // 3.3. update
    await UpdateCustomerUseCase.handle(
      {
        _id: responseCreate.inserted_id,
        data: {
          name: controllerInput.httpRequest['body'].update.name,
        },
      },
      {
        uniqueValidation,
        updateCustomerRepository,
        schemaValidation,
        objClean,
      },
    )
    await session.commitTransaction()
    session.startTransaction()
    // 3.4. update many
    await UpdateManyCustomerUseCase.handle(
      {
        filter: {
          name: controllerInput.httpRequest['body'].updateMany.filter.name,
        },
        data: {
          name: controllerInput.httpRequest['body'].updateMany.data.name,
        },
      },
      {
        updateManyCustomerRepository,
        schemaValidation,
        objClean,
      },
    )
    await session.commitTransaction()
    session.startTransaction()
    // 3.5. delete
    await DeleteCustomerUseCase.handle(
      { _id: controllerInput.httpRequest['body'].delete === true ? responseCreate.inserted_id : '' },
      {
        schemaValidation,
        deleteCustomerRepository,
      },
    )
    await session.commitTransaction()
    session.startTransaction()
    // 3.6. delete many
    await DeleteManyCustomerUseCase.handle(
      { ids: controllerInput.httpRequest['body'].deleteMany === true ? responseCreateMany.inserted_ids : [''] },
      {
        schemaValidation,
        deleteManyCustomerRepository,
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
