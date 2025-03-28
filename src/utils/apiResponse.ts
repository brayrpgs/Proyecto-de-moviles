import { Response } from 'express';

export class ApiResponse {
  
  static success(res: Response, data: any = null, status: number = 200) {
    res.status(status).json({
      success: true,
      data
    });
  }

  static error(res: Response, message: string, status: number = 400) {
    res.status(status).json({
      success: false,
      error: message
    });
  }

}