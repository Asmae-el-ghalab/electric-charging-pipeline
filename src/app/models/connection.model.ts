export interface Connection {

  id: number;

  connectionType: string;

  powerKw: number;

  quantity: number;

  voltage: number;

  amps: number;

  level: string;

  currentType: string;
}