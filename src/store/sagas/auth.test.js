import { cloneableGenerator } from '@redux-saga/testing-utils';

import * as logoutSagas from './auth'

describe('Logout saga functionality', () => {
  const authVars = ['token', 'expirationDate', 'userId']
  const IT_MESSAGE = 'should remove all authentication local storage variables'

  beforeEach(() => {
    for (const authVar of authVars) {
      localStorageFake.setItem(authVar, 'temp')
    }
  })

  it(`Not using call ${IT_MESSAGE}`, () => {
    const gen = cloneableGenerator(logoutSagas.logoutSagaNotUsingCall)(null, localStorageFake)
    const clone = gen.clone()

    let result = clone.next()
    while (!result.done) {
      result = clone.next()
    }

    authVars.forEach(authVar => expect(localStorageFake.getItem(authVar)).toEqual(null))
  })

  it(`Not using call, but using forEach ${IT_MESSAGE}`, () => {
    const gen = cloneableGenerator(
      logoutSagas.logoutSagaNotUsingCallUsingForEach)(null, localStorageFake)
    const clone = gen.clone()

    let result = clone.next()
    while (!result.done) {
      result = clone.next()
    }

    authVars.forEach(authVar => expect(localStorageFake.getItem(authVar)).toEqual(null))
  })

  it(`Not using call, but using map ${IT_MESSAGE}`, () => {
    const gen = cloneableGenerator(
      logoutSagas.logoutSagaNotUsingCallUsingMap)(null, localStorageFake)
    const clone = gen.clone()

    let result = clone.next()
    while (!result.done) {
      result = clone.next()
    }

    authVars.forEach(authVar => expect(localStorageFake.getItem(authVar)).toEqual(null))
  })
})