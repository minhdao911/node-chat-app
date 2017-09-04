class Room {
  constructor () {
    this.roomList = [];
  }
  addRoom(roomName){
    if(this.roomCheck(roomName)){
      this.roomList.push(roomName);
    }
  }
  roomCheck(roomName){
    var room = this.roomList.filter((room) => room === roomName);
    if(room.length>0 || roomName === 'simsimi'){
      return false;
    }else{
      return true;
    }
  }
  removeRoom(roomName){
    if(!this.roomCheck(roomName)){
      this.roomList = this.roomList.filter((room) => room !== roomName);
    }
  }
}

module.exports = {Room};
