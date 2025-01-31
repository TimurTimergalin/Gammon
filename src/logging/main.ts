import {ConsoleLoggerProvider} from "./implementations/console";

const loggerProvider = new ConsoleLoggerProvider()

export const logger = (scope: string) => loggerProvider.getLogger(scope)