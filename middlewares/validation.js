import { celebrate, Joi } from "celebrate";
import validator from 'validator';
import constatns from '../constatns.js';

const { BAD_REQUEST } = constatns;

const validationUrl = (value) => {
    if (validator.isURL(value)) return value;
    return BAD_REQUEST.text;
}

export const signinValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(1),
    remember: Joi.bool().truthy('true', '1').falsy('false', '0').valid(true, false).default(false)
  })
});

export const signupValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(1),
  }),
});