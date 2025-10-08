import { rateLimit } from "express-rate-limit";

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  message: (req) => ({
    success: false,
    message: req.t('tooManyRequests'),
    language: req.language
  }),
  standardHeaders: true,
  legacyHeaders: false,
});

export const projectLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 5,
  message: (req) => ({
    success: false,
    message: req.t('projectLimitExceeded'),
    language: req.language
  })
});

export const taskLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 5,
  message: (req) => ({
    success: false,
    message: req.t('taskLimitExceeded'),
    language: req.language
  })
});