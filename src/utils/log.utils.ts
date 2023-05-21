export function log(message?: unknown, ...optionalParams: unknown[]) {
	console.log(message, ...optionalParams);
}

export function info(message?: unknown, ...optionalParams: unknown[]) {
	console.info(`%c${message}`, 'color: LightSkyBlue; background-color: #111122', ...optionalParams);
}

export function warn(message?: unknown, ...optionalParams: unknown[]) {
	console.warn(message, ...optionalParams);
}

export function error(message?: unknown, ...optionalParams: unknown[]) {
	console.error(message, ...optionalParams);
}

export function notImplemented(): never {
	throw new Error('not implemented');
}
