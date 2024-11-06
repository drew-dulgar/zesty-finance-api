import joi from 'joi';
import AccountService from '../services/AccountService.js';

const isUniqueEmail = async (email: string, helpers) => {
  const emailExists = await AccountService.getEmailExists(email);

  if (emailExists) {
    return helpers.message('Email already exist.')
  }
}

export const AccountSchema = {
  email: joi.string().trim().lowercase().required().email().external(isUniqueEmail).label('Email'),
  firstName: joi.optional(),
  tos: joi.boolean().equal(true).label('Terms of Service'),
  password: joi.string().required().min(5).label('Password'),
  passwordConfirm: joi.string().required().equal(joi.ref('password')).label('Password Confirmation').messages({ 'any.only': '{{#label}} does not match Password' }),
};



const AccountCreate = joi.object({
...AccountSchema
}).options({
  stripUnknown: true,
  abortEarly: false,
});

export const AccountSchemaCreate = joi.compile(AccountCreate);
