import type { IObjClean } from '@point-hub/express-utils'
import type { ISchemaValidation } from '@point-hub/papi'

import type { IUniqueValidation } from '@/utils/unique-validation'

import { collectionName, ModuleExampleEntity } from '../entity'
import type { IModuleExampleNationality } from '../interface'
import type { ICreateManyModuleExampleRepository } from '../repositories/create-many.repository'
import { createManyValidation } from '../validations/create-many.validation'

export interface IInput {
  module_examples: {
    name?: string
    age?: number
    nationality?: IModuleExampleNationality
    notes?: string
  }[]
}

export interface IDeps {
  schemaValidation: ISchemaValidation
  createManyModuleExampleRepository: ICreateManyModuleExampleRepository
  uniqueValidation: IUniqueValidation
  objClean: IObjClean
}

export interface IOutput {
  inserted_count: number
  inserted_ids: string[]
}

export class CreateManyModuleExampleUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation({ module_examples: input.module_examples }, createManyValidation)
    // 2. validate unique
    const filters = input.module_examples.map((example) => ({
      match: { name: example.name },
    }))
    await deps.uniqueValidation.handleMany(collectionName, filters)
    // 3. define entity
    const entities = []
    for (const document of input.module_examples) {
      const moduleExampleEntity = new ModuleExampleEntity({
        name: document.name,
        age: document.age,
        nationality: document.nationality,
        notes: document.notes,
        created_at: new Date(),
      })
      moduleExampleEntity.data = deps.objClean(moduleExampleEntity.data)
      entities.push(moduleExampleEntity.data)
    }
    // 4. database operation
    const response = await deps.createManyModuleExampleRepository.handle(entities)
    // 5. output
    return {
      inserted_ids: response.inserted_ids,
      inserted_count: response.inserted_count,
    }
  }
}
