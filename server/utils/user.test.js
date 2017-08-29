const expect = require('expect');
const {User} = require("./user");

describe('User', () => {
  var users;

  beforeEach(() => {
    users = new User();
    users.userList = [
      {
        id: '1',
        name: 'jen',
        room: 'node course'
      },
      {
        id: '2',
        name: 'mike',
        room: 'reactive course'
      },
      {
        id: '3',
        name: 'anna',
        room: 'node course'
      }
    ];
  });

  it('should add new user to user list', () => {
    var user = new User();
    var newUser = {
      id: '123',
      name: "John",
      room: 'Potato Couch'
    };
    var resUser = user.addUser(newUser.id, newUser.name, newUser.room);
    expect(user.userList).toEqual([newUser]);
  });

  it('should remove user', () => {
    var user = {
      id: '3',
      name: 'anna',
      room: 'node course'
    };
    var resUser = users.removeUser(user.id);
    expect(resUser).toEqual(user);
    expect(users.userList.length).toBe(2);
  });

  it('should not remove user', () => {
    var resUser = users.removeUser('44');
    expect(resUser).toNotExist();
    expect(users.userList.length).toBe(3);
  });

  it('should find user', () => {
    var user = users.userList[1];
    var resUser = users.getUser('2');
    expect(resUser).toEqual(user);
  });

  it('should not find user', () => {
    var resUser = users.getUser('50');
    expect(resUser).toNotExist();
  });

  it('should return names for node course', () => {
    var usersList = users.getUserList('node course');
    expect(usersList).toEqual(['jen', 'anna']);
  });

  it('should return names for reactive course', () => {
    var usersList = users.getUserList('reactive course');
    expect(usersList).toEqual(['mike']);
  });
});
