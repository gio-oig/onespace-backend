const Joi = require('joi');

const loginValidation = async (data) => {
	const schema = Joi.object({
		email: Joi.string().email({
			minDomainSegments: 2,
			tlds: { allow: ['com', 'net'] },
		}),
		password: Joi.string().required(),
	});

	return await schema.validateAsync(data, { abortEarly: false });
};

module.exports = { loginValidation };
