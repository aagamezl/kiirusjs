const ERROR_MESSAGES = {
  KJ0001: 'Router Config path is missing',
  KJ0002: 'Router Config component is missing',
}

export const getErrorMessage = (error) => {
  return ERROR_MESSAGES[error]
}
