export class SuccessResponse {
  public readonly error: boolean = false;

  public readonly statusCode: number = 200;

  public readonly result: any | undefined;

  constructor(result: any | undefined) {
    this.result = result;
  }
}
