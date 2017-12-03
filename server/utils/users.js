class Users {
    constructor () {
        this.users = [];
    };

    addUser (id, name, room) {
        var user = {id, name, room};
        this.users.push(user);
        return user;
    };

    removeUser (id) {
        var user = this.getUser(id);
            if(user){
                this.users =  this.users.filter((user) => user.id !== id);
            }

            return user;
    };

    getUser (id) {
        var user = this.users.filter((user) => user.id === id)[0];
        return user;
    };

    getUserList (room) {
        var users = this.users.filter((user) => user.room === room); //this function gets called with each individual user. Return true to keep the item in the array, or false to remove it from the array
        var namesArray = users.map((user) => user.name); //map takes a function similar to filter, but map returns the property value(s) we want to use instead
        return namesArray;
    };
};

module.exports = {
    Users
};