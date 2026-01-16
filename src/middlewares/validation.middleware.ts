import { plainToInstance } from 'class-transformer';
import { validate, validateOrReject, ValidationError } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@exceptions/HttpException';

/**
 * @name ValidationMiddleware
 * @description Allows use of decorator and non-decorator based validation
 * @param type dto
 * @param skipMissingProperties When skipping missing properties
 * @param whitelist Even if your object is an instance of a validation class it can contain additional properties that are not defined
 * @param forbidNonWhitelisted If you would rather to have an error thrown when any non-whitelisted properties are present
 */
const extractValidationErrors = (errors: ValidationError[]): string[] =>
  errors.flatMap(error => {
    const messages: string[] = [];

    if (error.constraints) {
      messages.push(...Object.values(error.constraints));
    }

    if (error.children?.length) {
      messages.push(...extractValidationErrors(error.children));
    }

    return messages;
  });

export const ValidationMiddleware =
  (
    type: any,
    skipMissingProperties = false,
    whitelist = false,
    forbidNonWhitelisted = false,
  ) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.body) {
        return next(new HttpException(400, 'Request body is required'));
      }

      const dto = plainToInstance(type, req.body);

      if (!dto || typeof dto !== 'object') {
        return next(new HttpException(400, 'Invalid request body'));
      }

      const errors = await validate(dto, {
        skipMissingProperties,
        whitelist,
        forbidNonWhitelisted,
      });

      if (errors.length > 0) {
        const messages = extractValidationErrors(errors);
        return next(
          new HttpException(
            400,
            messages.length ? messages.join(', ') : 'Validation failed',
          ),
        );
      }

      req.body = dto;
      next();
    } catch (err) {
      console.error('Unexpected validation error:', err);
      next(new HttpException(500, 'Internal validation error'));
    }
  };