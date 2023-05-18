export function log(message?: any, ...optionalParams: any[]) {
  console.log(message, ...optionalParams);
}

export function info(message?: any, ...optionalParams: any[]) {
  console.info(
    `%c${message}`,
    "color: LightSkyBlue; background-color: #111122",
    ...optionalParams
  );
}

export function warn(message?: any, ...optionalParams: any[]) {
  console.warn(message, ...optionalParams);
}

export function error(message?: any, ...optionalParams: any[]) {
  console.error(message, ...optionalParams);
}
