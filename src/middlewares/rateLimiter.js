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

export const createProjectLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 5,
  message: (req) => ({
    success: false,
    message: req.t('projectLimitExceeded'),
    language: req.language
  })
});

export const githubLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutos
  max: 20,
  message: (req) => ({
    success: false,
    message: req.t('githubLimitExceeded'),
    language: req.language
  })
});
