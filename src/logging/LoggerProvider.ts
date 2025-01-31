import {Logger, loggerComposition} from "./Logger";

export interface LoggerProvider {
    getLogger(scope: string): Logger
}

export function loggerProviderComposition(...providers: LoggerProvider[]): LoggerProvider {
    return {
        getLogger(scope: string): Logger {
            return loggerComposition(...providers.map(x => x.getLogger(scope)))
        }
    }
}