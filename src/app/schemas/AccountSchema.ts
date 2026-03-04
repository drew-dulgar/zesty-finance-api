import joi from 'joi';
import AccountService from '../services/AccountService.js';

const isUniqueEmail = async (email: string, helpers) => {
  const emailExists = await AccountService.getEmailExists(email);

  if (emailExists) {
    return helpers.message('Email already exist.')
  }
};


export const AccountSchema = {
  email: joi.string().trim().lowercase().email().max(512).label('Email'),
  firstName: joi.string().trim().max(255).label('First Name'),
  middleName: joi.string().trim().max(255).label('Middle Name'),
  lastName: joi.string().trim().max(255).label('Last Name'),
  username: joi.string().trim().max(50).label('Username'),
  tos: joi.boolean().equal(true).label('Terms of Service'),
  password: joi.string().min(5).label('Password'),
  passwordConfirm: joi.string().label('Password Confirmation'),
};

export const AccountConfirmEmail = joi.object({
  email: AccountSchema.email.concat(joi.string().required().external(isUniqueEmail))
});

export const AccountConfirmPassword = joi.object({
  password: AccountSchema.password,
  passwordConfirm: AccountSchema.passwordConfirm.equal(joi.ref('password')).messages({ 'any.only': '{{#label}} does not match Password' }),
});

const AccountDescribed = AccountConfirmEmail.describe();
const x = Object.keys(AccountDescribed.keys).reduce((schema, key) => {
  const { type, flags, rules, externals } = AccountDescribed.keys[key];

  if (!schema?.[key]) {
    schema[key] = {};
  }

  schema[key].type = type;
  schema[key].label = flags?.label || key;
  schema[key].required = flags?.presence === 'required';

  rules.forEach(rule => {

    switch(rule.name) {
      case 'min':
        schema[key].min = rule.args.limit;
      break;
      case 'max':
        schema[key].max = rule.args.limit;
      break;
      default:
    }
  });


  return schema;

}, {});


console.log(JSON.stringify(x));
const AccountCreate = joi.object({
  ...AccountSchema
}).options({
  stripUnknown: true,
  abortEarly: false,
});

export const AccountSchemaCreate = joi.compile(AccountCreate);
