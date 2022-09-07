//  Change to project schema 

const signUpSchema = {
    type: "object",
    properties: {
      name: {type: "string", minLength: 2, maxLength: 50},
      email: { type: "string", format: "email" },
      password1: { type: "string", minLength: 2 },
      password2: { type: "string", minLength: 2 },
    },
    required: ["email", "password1", "password2"],
      additionalProperties: false,
  };

  const loginSchema = {
    type: "object",
    properties: {
        email: { type: "string", format: "email" },
        password: { type: "string", minLength: 2 },
    },
    required: ["email", "password"],
}


  module.exports = {signUpSchema, loginSchema}