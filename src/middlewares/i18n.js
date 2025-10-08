import { translations } from '../locales/index.js';

const detectLanguage = (req) => {
  if (req.query.lang) {
    const lang = req.query.lang.toLowerCase();
    const supportedLangs = {
      'pt': 'pt-BR',
      'pt-br': 'pt-BR',
      'en': 'en-US',
      'en-us': 'en-US',
      'es': 'es-ES',
      'es-es': 'es-ES'
    };
    return supportedLangs[lang] || 'pt-BR';
  }
  
  const acceptLanguage = req.headers['accept-language'];
  
  if (!acceptLanguage) return 'pt-BR';
  
  const primaryLang = acceptLanguage.split(',')[0].split('-')[0];
  const fullLang = acceptLanguage.split(',')[0];
  
  if (translations[fullLang]) {
    return fullLang;
  }
  
  const supportedLangs = {
    'pt': 'pt-BR',
    'en': 'en-US', 
    'es': 'es-ES'
  };
  
  return supportedLangs[primaryLang] || 'pt-BR';
};

export const i18nMiddleware = (req, res, next) => {
  const language = detectLanguage(req);
  
  req.t = (key, params = {}) => {
    let message = translations[language][key] || translations['pt-BR'][key] || key;
    
    Object.keys(params).forEach(param => {
      message = message.replace(`{${param}}`, params[param]);
    });
    
    return message;
  };
  
  req.language = language;
  
  next();
};

export const createResponse = (req, data = null, message = 'success', statusCode = 200) => {
  return {
    success: statusCode < 400,
    message: req.t(message),
    data,
    language: req.language
  };
};
