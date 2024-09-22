export default class UserDTO {
    constructor(user) {
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.role = user.role;
        this.email = user.email;
        this.cart = user.cart;
        this.password = this.maskPassword(user.password);
    }

    maskPassword(password) {
        return '*'.repeat(password.length);
    }
}

