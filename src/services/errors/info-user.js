import User from '../../dao/models/user.model.js'

const user = new User();

export const generateErrorInfo = (user) => {
    return `Una o más propiedades estaban incompletas o inválidas. Lista de propiedades requeridas:
    *first_name: necesita un string, se recibió ${user.first_name}
    *last_name: necesita un string, se recibió ${user.last_name}
    *age: necesita un string, se recibió ${user.age}`
}
