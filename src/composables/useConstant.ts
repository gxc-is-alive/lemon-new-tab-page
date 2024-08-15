export const useConstant = () => {
  const SERVER_STATUS_COLOR_MAP = {
    SERVICE_ALIVE: '#00cb50',
    SERVICE_DEAD: '#ff635b'
  }
  return {
    SERVER_STATUS_COLOR_MAP
  }
}
