class User {
  constructor () {
    this.userList = [];
  }
  addUser(id, name, room){
    var newUser = {id, name, room};
    this.userList.push(newUser);
    return newUser;
  }
  removeUser(id){
    var user = this.getUser(id);
    if(user){
      this.userList = this.userList.filter((user) => user.id !== id);
    }
    return user;
  }
  getUser(id){
    var user = this.userList.filter((user) => user.id === id);

    return user[0];
  }
  getUserList(room){
    var users = this.userList.filter((user) => user.room === room);
    var namesArray = users.map((user) => user.name);

    return namesArray;
  }
}

module.exports = {User};
