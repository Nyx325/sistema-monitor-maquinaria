import { Request, Response } from "express";

export interface IController {
  add(req: Request, res: Response): Promise<void>;
  update(req: Request, res: Response): Promise<void>;
  delete(req: Request, res: Response): Promise<void>;
  get(req: Request, res: Response): Promise<void>;
  getBy(req: Request, res: Response): Promise<void>;
}
