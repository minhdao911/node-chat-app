const expect = require('expect');
const {Room} = require("./room");

describe('Room', () => {
  var rooms;
  beforeEach(() => {
    rooms = new Room();
    rooms.roomList = ["Hack Club", "LOL", "dota2"];
  });
  it('should add room to room list', () => {
    var roomName = "Dota2";
    rooms.addRoom(roomName);
    expect(rooms.roomList).toInclude(roomName);
    expect(rooms.roomList.length).toBe(4);
  });
  it('should not add room to room list', () => {
    var roomName = "dota2";
    rooms.addRoom(roomName);
    expect(rooms.roomList.length).toBe(3);
  });
  it('should remove room', () => {
    var roomName = "dota2";
    rooms.removeRoom(roomName);
    expect(rooms.roomList.length).toBe(2);
  });
  it('should not add room simsimi', () => {
    var roomName = 'simsimi';
    rooms.addRoom(roomName);
    expect(rooms.roomList.length).toBe(3);
  });
});
