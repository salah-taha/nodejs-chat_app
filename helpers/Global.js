class Global {
  constructor() {
    this.globalRoom = [];
  }
  EnterRoom(id, name, room, img) {
    var user = { id, name, room, img };
    this.globalRoom.push(user);
    return user;
  }

  GetRoomList(room) {
    var users = this.globalRoom.filter((user) => user.room === room);

    var namesArray = users.map((user) => {
      return { name: user.name, img: user.img };
    });

    return namesArray;
  }
}

module.exports = { Global };
